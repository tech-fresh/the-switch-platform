import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const scriptEnvKeysToUnset = [
  "SWITCH_LIVE_BASE_URL",
  "SWITCH_LIVE_STUDENT_COOKIE",
  "SWITCH_LIVE_ADMIN_COOKIE",
  "SWITCH_AUTH_EDITOR_EMAILS",
  "SWITCH_AUTH_ADMIN_EMAILS",
  "SWITCH_OIDC_GOOGLE_CLIENT_ID",
  "SWITCH_OIDC_GOOGLE_CLIENT_SECRET",
  "SWITCH_OIDC_GOOGLE_AUTHORIZATION_URL",
  "SWITCH_OIDC_GOOGLE_TOKEN_URL",
  "SWITCH_OIDC_GOOGLE_USERINFO_URL",
  "SWITCH_OIDC_GOOGLE_SCOPES",
  "SWITCH_OIDC_GOOGLE_PROMPT",
];

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function buildIsolatedScriptEnv(overrides = {}) {
  const env = {
    ...process.env,
  };

  for (const key of scriptEnvKeysToUnset) {
    env[key] = "";
  }

  return {
    ...env,
    ...overrides,
  };
}

async function withTempDir(callback) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "switch-persistence-scripts-"));

  try {
    await callback(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

test("persistence migration script builds primary and backup sqlite databases from json files", async () => {
  await withTempDir(async (tempDir) => {
    await writeFile(
      path.join(tempDir, "saved-progress.json"),
      JSON.stringify({ records: [{ id: "saved-1", status: "paused" }] }, null, 2),
      "utf8",
    );
    await writeFile(
      path.join(tempDir, "access-profiles.json"),
      JSON.stringify({ profiles: [{ userId: "student-1", activeAccessArrangements: ["reader"] }] }, null, 2),
      "utf8",
    );

    const scriptPath = path.join(process.cwd(), "scripts", "persistence-migrate-to-sqlite.mjs");
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SWITCH_DATA_DIRECTORY: tempDir,
      },
    });

    assert.match(stdout, /SQLite migration completed/);
    assert.match(stdout, /saved-progress\.records: 1 record/);
    assert.match(stdout, /access-profiles\.profiles: 1 record/);

    const primaryDatabase = new DatabaseSync(path.join(tempDir, "switch-live.sqlite"), {
      readOnly: true,
    });
    const backupDatabase = new DatabaseSync(path.join(tempDir, "backups", "switch-live.sqlite"), {
      readOnly: true,
    });

    try {
      const primarySavedProgress = primaryDatabase
        .prepare("SELECT payload FROM collection_store WHERE collection_key = ?")
        .get("saved-progress.records");
      const backupSavedProgress = backupDatabase
        .prepare("SELECT payload FROM collection_store WHERE collection_key = ?")
        .get("saved-progress.records");

      assert.deepEqual(
        JSON.parse(primarySavedProgress.payload),
        [{ id: "saved-1", status: "paused" }],
      );
      assert.deepEqual(
        JSON.parse(backupSavedProgress.payload),
        [{ id: "saved-1", status: "paused" }],
      );
    } finally {
      primaryDatabase.close();
      backupDatabase.close();
    }
  });
});

test("persistence restore script replaces the primary sqlite database with the backup copy", async () => {
  await withTempDir(async (tempDir) => {
    await writeFile(
      path.join(tempDir, "saved-progress.json"),
      JSON.stringify({ records: [{ id: "saved-2", status: "submitted" }] }, null, 2),
      "utf8",
    );

    const migrateScriptPath = path.join(process.cwd(), "scripts", "persistence-migrate-to-sqlite.mjs");
    await execFileAsync(process.execPath, [migrateScriptPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SWITCH_DATA_DIRECTORY: tempDir,
      },
    });

    const backupBytes = await readFile(path.join(tempDir, "backups", "switch-live.sqlite"));
    await writeFile(path.join(tempDir, "switch-live.sqlite"), "corrupted-primary", "utf8");

    const restoreScriptPath = path.join(process.cwd(), "scripts", "persistence-restore-from-backup.mjs");
    const { stdout } = await execFileAsync(process.execPath, [restoreScriptPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SWITCH_PERSISTENCE_DRIVER: "sqlite",
        SWITCH_DATA_DIRECTORY: tempDir,
      },
    });

    assert.match(stdout, /SQLite backup restore completed/);

    const restoredPrimaryBytes = await readFile(path.join(tempDir, "switch-live.sqlite"));
    assert.equal(restoredPrimaryBytes.equals(backupBytes), true);
  });
});

test("live readiness script passes for an environment-only live configuration", async () => {
  await withTempDir(async (tempDir) => {
    const scriptPath = path.join(process.cwd(), "scripts", "live-readiness.mjs");
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      env: buildIsolatedScriptEnv({
        SWITCH_AUTH_MODE: "oidc",
        SWITCH_AUTH_SECRET: "live-readiness-secret",
        SWITCH_AUTH_BASE_URL: "https://switch.example.com",
        SWITCH_PERSISTENCE_DRIVER: "sqlite",
        SWITCH_DATA_DIRECTORY: tempDir,
        SWITCH_CMS_BACKEND_MODE: "live",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID: "client-id",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET: "client-secret",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL: "https://id.example.com/authorize",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL: "https://id.example.com/token",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL: "https://id.example.com/userinfo",
      }),
    });

    assert.match(stdout, /Live readiness passed/);
    assert.match(stdout, /Auth mode: oidc/);
    assert.match(stdout, /Persistence driver: sqlite/);
    assert.match(stdout, /Live URL checked: not supplied in this run/);
  });
});

test("live readiness script can record governance evidence when explicitly enabled", async () => {
  await withTempDir(async (tempDir) => {
    const scriptPath = path.join(process.cwd(), "scripts", "live-readiness.mjs");
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      env: buildIsolatedScriptEnv({
        SWITCH_AUTH_MODE: "oidc",
        SWITCH_AUTH_SECRET: "live-readiness-secret",
        SWITCH_AUTH_BASE_URL: "https://switch.example.com",
        SWITCH_PERSISTENCE_DRIVER: "sqlite",
        SWITCH_DATA_DIRECTORY: tempDir,
        SWITCH_CMS_BACKEND_MODE: "live",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID: "client-id",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET: "client-secret",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL: "https://id.example.com/authorize",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL: "https://id.example.com/token",
        SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL: "https://id.example.com/userinfo",
        SWITCH_RECORD_GOVERNANCE: "1",
        SWITCH_GOVERNANCE_ENVIRONMENT: "staging-eu",
      }),
    });

    assert.match(stdout, /Launch governance recording updated/i);

    const governanceDatabase = new DatabaseSync(path.join(tempDir, "switch-live.sqlite"), {
      readOnly: true,
    });
    const storedGovernance = governanceDatabase
      .prepare("SELECT payload FROM collection_store WHERE collection_key = ?")
      .get("launch-governance.records");
    const records = JSON.parse(storedGovernance.payload);
    const evidenceRecord = records.find(
      (record) =>
        record.kind === "evidence" &&
        record.targetId === "evidence-environment-base-url",
    );
    const authModeRecord = records.find(
      (record) =>
        record.kind === "environment" &&
        record.targetId === "environment-auth-mode",
    );
    const persistenceRecord = records.find(
      (record) =>
        record.kind === "environment" &&
        record.targetId === "environment-persistence-path",
    );

    assert.equal(evidenceRecord?.environment, "staging-eu");
    assert.equal(evidenceRecord?.status, "recorded");
    assert.match(evidenceRecord?.summary ?? "", /live readiness passed/i);
    assert.equal(authModeRecord?.status, "ready");
    assert.equal(authModeRecord?.environment, "staging-eu");
    assert.equal(persistenceRecord?.status, "ready");
    governanceDatabase.close();
  });
});

test("launch governance helper can record rehearsal evidence for release verification", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousRecordFlag = process.env.SWITCH_RECORD_GOVERNANCE;
    const previousEnvironment = process.env.SWITCH_GOVERNANCE_ENVIRONMENT;

    process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
    process.env.SWITCH_DATA_DIRECTORY = tempDir;
    process.env.SWITCH_RECORD_GOVERNANCE = "1";
    process.env.SWITCH_GOVERNANCE_ENVIRONMENT = "local-release-proof";

    const governanceScript = await import(
      `../scripts/launch-governance.mjs?test=${Date.now()}-release-recording`
    );

    const config = governanceScript.getGovernanceRecordingConfig("local-release-rehearsal");
    const recorded = await governanceScript.recordLocalReleaseRehearsal(config, [
      "lint",
      "test",
      "build",
      "test:smoke",
      "test:e2e",
      "test:final-smoke",
    ]);

    assert.equal(recorded, true);

    const governanceFile = JSON.parse(
      await readFile(path.join(tempDir, "launch-governance.json"), "utf8"),
    );
    const rehearsalRecord = governanceFile.records.find(
      (record) =>
        record.kind === "evidence" &&
        record.targetId === "evidence-smoke-rehearsal",
    );

    assert.equal(rehearsalRecord?.status, "recorded");
    assert.equal(rehearsalRecord?.environment, "local-release-proof");
    assert.match(rehearsalRecord?.summary ?? "", /lint, test, build, test:smoke, test:e2e, test:final-smoke/i);

    restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
    restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
    restoreEnv("SWITCH_RECORD_GOVERNANCE", previousRecordFlag);
    restoreEnv("SWITCH_GOVERNANCE_ENVIRONMENT", previousEnvironment);
  });
});

test("launch governance helper can record final-route rehearsal smoke checks", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousRecordFlag = process.env.SWITCH_RECORD_GOVERNANCE;
    const previousEnvironment = process.env.SWITCH_GOVERNANCE_ENVIRONMENT;
    const previousSmokeOwner = process.env.SWITCH_GOVERNANCE_SMOKE_OWNER;

    try {
      process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
      process.env.SWITCH_DATA_DIRECTORY = tempDir;
      process.env.SWITCH_RECORD_GOVERNANCE = "1";
      process.env.SWITCH_GOVERNANCE_ENVIRONMENT = "local-final-route-proof";
      process.env.SWITCH_GOVERNANCE_SMOKE_OWNER = "QA release lead";

      const governanceScript = await import(
        `../scripts/launch-governance.mjs?test=${Date.now()}-final-route-recording`
      );

      const config = governanceScript.getGovernanceRecordingConfig("local-final-route-rehearsal");
      const recorded = await governanceScript.recordFinalRouteRehearsal(config, [
        {
          checkId: "smoke-dashboard",
          note: "Local preview-style rehearsal confirmed dashboard continuity behaved correctly.",
        },
        {
          checkId: "smoke-account-admin",
          note: "Local preview-style rehearsal confirmed account access and admin route protection behaved correctly.",
        },
      ]);

      assert.equal(recorded, true);

      const governanceFile = JSON.parse(
        await readFile(path.join(tempDir, "launch-governance.json"), "utf8"),
      );
      const dashboardSmoke = governanceFile.records.find(
        (record) =>
          record.kind === "smoke" &&
          record.targetId === "smoke-dashboard",
      );
      const accountAdminSmoke = governanceFile.records.find(
        (record) =>
          record.kind === "smoke" &&
          record.targetId === "smoke-account-admin",
      );

      assert.equal(dashboardSmoke?.status, "ready");
      assert.equal(dashboardSmoke?.environment, "local-final-route-proof");
      assert.equal(dashboardSmoke?.owner, "QA release lead");
      assert.match(dashboardSmoke?.note ?? "", /local preview-style rehearsal/i);
      assert.equal(accountAdminSmoke?.status, "ready");
      assert.equal(accountAdminSmoke?.environment, "local-final-route-proof");
      assert.equal(accountAdminSmoke?.owner, "QA release lead");
    } finally {
      restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
      restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
      restoreEnv("SWITCH_RECORD_GOVERNANCE", previousRecordFlag);
      restoreEnv("SWITCH_GOVERNANCE_ENVIRONMENT", previousEnvironment);
      restoreEnv("SWITCH_GOVERNANCE_SMOKE_OWNER", previousSmokeOwner);
    }
  });
});

test("launch governance helper can record final live route proof", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousRecordFlag = process.env.SWITCH_RECORD_GOVERNANCE;
    const previousEnvironment = process.env.SWITCH_GOVERNANCE_ENVIRONMENT;
    const previousSmokeOwner = process.env.SWITCH_GOVERNANCE_SMOKE_OWNER;

    try {
      process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
      process.env.SWITCH_DATA_DIRECTORY = tempDir;
      process.env.SWITCH_RECORD_GOVERNANCE = "1";
      process.env.SWITCH_GOVERNANCE_ENVIRONMENT = "production-eu";
      process.env.SWITCH_GOVERNANCE_SMOKE_OWNER = "Release manager";

      const governanceScript = await import(
        `../scripts/launch-governance.mjs?test=${Date.now()}-live-route-recording`
      );

      const config = governanceScript.getGovernanceRecordingConfig("live-route-walkthrough");
      const recorded = await governanceScript.recordLiveRouteWalkthrough(
        config,
        [
          {
            checkId: "smoke-dashboard",
            note: "Live route walkthrough confirmed dashboard continuity behaved correctly.",
          },
          {
            checkId: "smoke-account-admin",
            note: "Live route walkthrough confirmed account access and admin route protection behaved correctly.",
          },
        ],
        "Live route walkthrough passed across the deployed environment.",
      );

      assert.equal(recorded, true);

      const governanceFile = JSON.parse(
        await readFile(path.join(tempDir, "launch-governance.json"), "utf8"),
      );
      const finalProof = governanceFile.records.find(
        (record) =>
          record.kind === "evidence" &&
          record.targetId === "evidence-final-live-proof",
      );

      assert.equal(finalProof?.status, "recorded");
      assert.equal(finalProof?.environment, "production-eu");
      assert.match(finalProof?.summary ?? "", /live route walkthrough passed/i);
    } finally {
      restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
      restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
      restoreEnv("SWITCH_RECORD_GOVERNANCE", previousRecordFlag);
      restoreEnv("SWITCH_GOVERNANCE_ENVIRONMENT", previousEnvironment);
      restoreEnv("SWITCH_GOVERNANCE_SMOKE_OWNER", previousSmokeOwner);
    }
  });
});

test("launch governance helper can record final launch sign-off bundle", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousRecordFlag = process.env.SWITCH_RECORD_GOVERNANCE;
    const previousEnvironment = process.env.SWITCH_GOVERNANCE_ENVIRONMENT;

    try {
      process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
      process.env.SWITCH_DATA_DIRECTORY = tempDir;
      process.env.SWITCH_RECORD_GOVERNANCE = "1";
      process.env.SWITCH_GOVERNANCE_ENVIRONMENT = "production-eu";

      const governanceScript = await import(
        `../scripts/launch-governance.mjs?test=${Date.now()}-launch-signoff-recording`
      );

      const config = governanceScript.getGovernanceRecordingConfig("live-launch-signoff");
      const recorded = await governanceScript.recordLaunchSignoffBundle(config, {
        reviews: [
          {
            reviewId: "privacy-retention-review",
            owner: "Student data lead",
            note: "Privacy and retention handling was approved for the production-eu release.",
          },
          {
            reviewId: "safeguarding-signposting-review",
            owner: "Student support lead",
            note: "Safeguarding wording and support boundaries were approved for the production-eu release.",
          },
          {
            reviewId: "release-approval-review",
            owner: "Launch manager",
            note: "Release approval path was confirmed with named authority for the production-eu release.",
          },
        ],
        signoffs: [
          {
            checkId: "signoff-privacy-retention",
            owner: "Student data lead",
            note: "Privacy and retention sign-off recorded for production-eu.",
          },
          {
            checkId: "signoff-release-approval",
            owner: "Launch manager",
            note: "Final release approval recorded for production-eu.",
          },
        ],
      });

      assert.equal(recorded, true);

      const governanceFile = JSON.parse(
        await readFile(path.join(tempDir, "launch-governance.json"), "utf8"),
      );
      const releaseReview = governanceFile.records.find(
        (record) =>
          record.kind === "review" &&
          record.targetId === "release-approval-review",
      );
      const releaseSignoff = governanceFile.records.find(
        (record) =>
          record.kind === "signoff" &&
          record.targetId === "signoff-release-approval",
      );

      assert.equal(releaseReview?.environment, "production-eu");
      assert.equal(releaseReview?.status, "ready");
      assert.match(releaseReview?.note ?? "", /release approval path/i);
      assert.equal(releaseSignoff?.environment, "production-eu");
      assert.equal(releaseSignoff?.status, "ready");
      assert.match(releaseSignoff?.note ?? "", /final release approval/i);
    } finally {
      restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
      restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
      restoreEnv("SWITCH_RECORD_GOVERNANCE", previousRecordFlag);
      restoreEnv("SWITCH_GOVERNANCE_ENVIRONMENT", previousEnvironment);
    }
  });
});

test("launch complete script can report the final sequence in dry-run mode", async () => {
  const scriptPath = path.join(process.cwd(), "scripts", "launch-complete.mjs");
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    env: buildIsolatedScriptEnv({
      SWITCH_LAUNCH_COMPLETE_DRY_RUN: "1",
    }),
  });

  assert.match(stdout, /Final launch completion sequence/i);
  assert.match(stdout, /npm run verify:live-readiness/i);
  assert.match(stdout, /npm run verify:persistence-recovery/i);
  assert.match(stdout, /npm run verify:live-walkthrough/i);
  assert.match(stdout, /npm run verify:launch-signoff/i);
  assert.match(stdout, /Preflight: missing required live inputs/i);
});

test("launch preflight report validates live launch requirements by auth mode", async () => {
  const { getLaunchPreflightReport } = await import(
    `../scripts/launch-preflight-utils.mjs?test=${Date.now()}-preflight`
  );

  const missingReport = getLaunchPreflightReport({
    SWITCH_AUTH_MODE: "oidc",
    SWITCH_LAUNCH_COMPLETE_DRY_RUN: "0",
  });
  assert.equal(missingReport.ready, false);
  assert.equal(missingReport.missing.includes("SWITCH_LIVE_BASE_URL"), true);
  assert.equal(missingReport.missing.includes("ONE_COMPLETE_OIDC_PROVIDER_BLOCK"), true);
  assert.equal(missingReport.missing.includes("SWITCH_LIVE_STUDENT_COOKIE"), true);

  const readyReport = getLaunchPreflightReport({
    SWITCH_AUTH_MODE: "external-header",
    SWITCH_AUTH_SECRET: "secret",
    SWITCH_PERSISTENCE_DRIVER: "sqlite",
    SWITCH_DATA_DIRECTORY: "/srv/switch/data",
    SWITCH_CMS_BACKEND_MODE: "live",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com",
    SWITCH_RECORD_GOVERNANCE: "1",
    SWITCH_GOVERNANCE_ENVIRONMENT: "production-eu",
    SWITCH_LAUNCH_APPROVER: "Release board",
    SWITCH_LAUNCH_STOP_AUTHORITY: "Platform lead",
    SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE: "done",
    SWITCH_EXTERNAL_AUTH_HEADER_SECRET: "header-secret",
    SWITCH_LIVE_STUDENT_USER_ID: "student-1",
    SWITCH_LIVE_STUDENT_DISPLAY_NAME: "Student One",
    SWITCH_LIVE_STUDENT_EMAIL: "student@example.com",
    SWITCH_LIVE_ADMIN_USER_ID: "admin-1",
    SWITCH_LIVE_ADMIN_DISPLAY_NAME: "Admin One",
    SWITCH_LIVE_ADMIN_EMAIL: "admin@example.com",
  });
  assert.equal(readyReport.ready, true);
  assert.deepEqual(readyReport.missing, []);

  const microsoftOidcReadyReport = getLaunchPreflightReport({
    SWITCH_AUTH_MODE: "oidc",
    SWITCH_AUTH_SECRET: "secret",
    SWITCH_AUTH_BASE_URL: "https://switch.example.com",
    SWITCH_PERSISTENCE_DRIVER: "sqlite",
    SWITCH_DATA_DIRECTORY: "/srv/switch/data",
    SWITCH_CMS_BACKEND_MODE: "live",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com",
    SWITCH_RECORD_GOVERNANCE: "1",
    SWITCH_GOVERNANCE_ENVIRONMENT: "production-eu",
    SWITCH_LAUNCH_APPROVER: "Release board",
    SWITCH_LAUNCH_STOP_AUTHORITY: "Platform lead",
    SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE: "done",
    SWITCH_LIVE_STUDENT_COOKIE: "switch_auth_session=student-cookie",
    SWITCH_LIVE_ADMIN_COOKIE: "switch_auth_session=admin-cookie",
    SWITCH_OIDC_MICROSOFT_CLIENT_ID: "microsoft-client-id",
    SWITCH_OIDC_MICROSOFT_CLIENT_SECRET: "microsoft-client-secret",
    SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    SWITCH_OIDC_MICROSOFT_TOKEN_URL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    SWITCH_OIDC_MICROSOFT_USERINFO_URL: "https://graph.microsoft.com/oidc/userinfo",
  });
  assert.equal(microsoftOidcReadyReport.ready, true);
  assert.deepEqual(microsoftOidcReadyReport.missing, []);

  const previewReport = getLaunchPreflightReport({
    SWITCH_AUTH_MODE: "preview-cookie",
    SWITCH_AUTH_SECRET: "secret",
    SWITCH_PERSISTENCE_DRIVER: "sqlite",
    SWITCH_DATA_DIRECTORY: "/srv/switch/data",
    SWITCH_CMS_BACKEND_MODE: "live",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com",
    SWITCH_RECORD_GOVERNANCE: "1",
    SWITCH_GOVERNANCE_ENVIRONMENT: "production-eu",
    SWITCH_LAUNCH_APPROVER: "Release board",
    SWITCH_LAUNCH_STOP_AUTHORITY: "Platform lead",
    SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE: "done",
    SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE: "done",
    SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE: "done",
  });
  assert.equal(previewReport.ready, false);
  assert.equal(
    previewReport.missing.includes(
      "SWITCH_AUTH_MODE (must be oidc or external-header for live launch)"
    ),
    true,
  );
});

test("launch status script reports code-complete and missing live inputs", async () => {
  const scriptPath = path.join(process.cwd(), "scripts", "launch-status.mjs");
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    env: buildIsolatedScriptEnv({
      SWITCH_AUTH_MODE: "oidc",
    }),
  });

  assert.match(stdout, /Final Path Mark 1 launch status/i);
  assert.match(stdout, /Code-complete closeout items: 7 of 10/i);
  assert.match(stdout, /Remaining live-only items:/i);
  assert.match(stdout, /The real live environment still needs proof outside local development/i);
  assert.match(stdout, /Missing live inputs:/i);
  assert.match(stdout, /SWITCH_LIVE_BASE_URL/i);
  assert.match(stdout, /npm run verify:launch-complete/i);
});

test("live readiness script fails when preview auth is still active", async () => {
  await withTempDir(async (tempDir) => {
    const scriptPath = path.join(process.cwd(), "scripts", "live-readiness.mjs");

    await assert.rejects(
      execFileAsync(process.execPath, [scriptPath], {
        cwd: process.cwd(),
        env: {
          ...process.env,
          SWITCH_AUTH_MODE: "preview-cookie",
          SWITCH_PERSISTENCE_DRIVER: "sqlite",
          SWITCH_DATA_DIRECTORY: tempDir,
          SWITCH_CMS_BACKEND_MODE: "live",
        },
      }),
      /SWITCH_AUTH_MODE is still preview-cookie/i,
    );
  });
});

test("repo lint script passes when the required environment example is present", async () => {
  const scriptPath = path.join(process.cwd(), "scripts", "repo-lint.mjs");
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    env: process.env,
  });

  assert.match(stdout, /Launch lint passed/);
  assert.match(stdout, /environment examples are present/i);
});

test("persistence recovery check script passes when active and backup files match", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const { createJsonFileCollectionStore } = await import(
      `../src/lib/persistence/json-file-store.ts?test=${Date.now()}-recovery-script-ready-store`
    );
    const store = createJsonFileCollectionStore({
      filename: "saved-progress.json",
      collectionKey: "records",
      directory: dataDirectory,
      backupDirectory,
    });

    await store.write([{ id: "saved-3", status: "submitted" }]);

    const scriptPath = path.join(process.cwd(), "scripts", "persistence-recovery-check.mjs");
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SWITCH_PERSISTENCE_DRIVER: "local-json",
        SWITCH_DATA_DIRECTORY: dataDirectory,
      },
    });

    assert.match(stdout, /Persistence recovery check/);
    assert.match(stdout, /Recovery ready: yes/);
    assert.match(stdout, /Recovery issues: 0/);
  });
});

test("persistence recovery check script fails when backup files drift", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const { createJsonFileCollectionStore } = await import(
      `../src/lib/persistence/json-file-store.ts?test=${Date.now()}-recovery-script-drift-store`
    );
    const store = createJsonFileCollectionStore({
      filename: "saved-progress.json",
      collectionKey: "records",
      directory: dataDirectory,
      backupDirectory,
    });

    await store.write([{ id: "saved-4", status: "in-progress" }]);
    await writeFile(
      path.join(backupDirectory, "saved-progress.json"),
      JSON.stringify({ records: [{ id: "saved-4", status: "paused" }] }, null, 2),
      "utf8",
    );

    const scriptPath = path.join(process.cwd(), "scripts", "persistence-recovery-check.mjs");
    try {
      await execFileAsync(process.execPath, [scriptPath], {
        cwd: process.cwd(),
        env: {
          ...process.env,
          SWITCH_PERSISTENCE_DRIVER: "local-json",
          SWITCH_DATA_DIRECTORY: dataDirectory,
        },
      });

      assert.fail("Expected persistence recovery check to fail when the backup files drift.");
    } catch (error) {
      const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`;

      assert.match(output, /Recovery ready: no/i);
      assert.match(output, /issue=backup-drift/i);
    }
  });
});
