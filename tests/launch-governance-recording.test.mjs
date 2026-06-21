import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import test from "node:test";

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

async function withTempDir(callback) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "switch-governance-"));

  try {
    await callback(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

test("launch governance records can be persisted and reflected in the overview", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousAuthMode = process.env.SWITCH_AUTH_MODE;
    const previousAuthSecret = process.env.SWITCH_AUTH_SECRET;
    const previousAuthBaseUrl = process.env.SWITCH_AUTH_BASE_URL;
    const previousCmsMode = process.env.SWITCH_CMS_BACKEND_MODE;

    try {
      process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
      process.env.SWITCH_DATA_DIRECTORY = tempDir;
      process.env.SWITCH_AUTH_MODE = "oidc";
      process.env.SWITCH_AUTH_SECRET = "governance-test-secret";
      process.env.SWITCH_AUTH_BASE_URL = "https://switch.example.com";
      process.env.SWITCH_CMS_BACKEND_MODE = "live";

      const service = await import(
        `../src/modules/governance/service.ts?test=${Date.now()}-launch-governance-recording`
      );

      await service.recordLaunchGovernanceReview({
        reviewId: "privacy-retention-review",
        status: "ready",
        owner: "Release owner",
        note: "Privacy review completed against the release candidate runtime.",
        environment: "staging-eu",
        recordedAt: "2026-06-16T09:30:00.000Z",
      });

      await service.recordLaunchGovernanceEvidence({
        evidenceId: "evidence-final-live-proof",
        status: "recorded",
        owner: "Launch manager",
        summary: "Signed-in route pass was completed in the target environment.",
        environment: "staging-eu",
        recordedAt: "2026-06-16T10:15:00.000Z",
      });

      await service.recordLaunchGovernanceSignOff({
        checkId: "signoff-safeguarding-support",
        status: "ready",
        owner: "Student support lead",
        note: "Support wording and urgent-help signposting were approved for launch.",
        environment: "staging-eu",
        recordedAt: "2026-06-16T11:00:00.000Z",
      });

      await service.recordLaunchGovernanceEnvironmentCheck({
        checkId: "environment-auth-base-url",
        status: "ready",
        owner: "Platform lead",
        detail: "Redirect callback address was verified against the deployed auth environment.",
        environment: "staging-eu",
        recordedAt: "2026-06-16T11:15:00.000Z",
      });

      await service.recordLaunchGovernanceSmokeCheck({
        checkId: "smoke-account-admin",
        status: "ready",
        owner: "Release manager",
        note: "Signed-in account and admin route pass completed in the target environment.",
        environment: "staging-eu",
        recordedAt: "2026-06-16T11:30:00.000Z",
      });

      const overview = await service.getLaunchGovernanceOverview();

      const review = overview.reviews.find((item) => item.reviewId === "privacy-retention-review");
      assert.equal(review?.status, "ready");
      assert.equal(review?.owner, "Release owner");
      assert.equal(review?.environment, "staging-eu");
      assert.equal(review?.source, "manual");
      assert.equal(review?.completedAt, "2026-06-16");

      const evidence = overview.evidenceRecords.find((item) => item.evidenceId === "evidence-final-live-proof");
      assert.equal(evidence?.status, "recorded");
      assert.equal(evidence?.owner, "Launch manager");
      assert.equal(evidence?.environment, "staging-eu");
      assert.equal(evidence?.source, "manual");
      assert.match(evidence?.summary ?? "", /route pass/i);

      const signOff = overview.signOffChecks.find((item) => item.checkId === "signoff-safeguarding-support");
      assert.equal(signOff?.status, "ready");
      assert.equal(signOff?.owner, "Student support lead");
      assert.equal(signOff?.environment, "staging-eu");
      assert.equal(signOff?.source, "manual");
      assert.equal(signOff?.recordedAt, "2026-06-16T11:00:00.000Z");

      const environmentCheck = overview.environmentChecks.find((item) => item.checkId === "environment-auth-base-url");
      assert.equal(environmentCheck?.status, "ready");
      assert.equal(environmentCheck?.owner, "Platform lead");
      assert.equal(environmentCheck?.environment, "staging-eu");
      assert.equal(environmentCheck?.source, "manual");
      assert.match(environmentCheck?.detail ?? "", /redirect callback/i);

      const smokeCheck = overview.smokeChecks.find((item) => item.checkId === "smoke-account-admin");
      assert.equal(smokeCheck?.status, "ready");
      assert.equal(smokeCheck?.owner, "Release manager");
      assert.equal(smokeCheck?.environment, "staging-eu");
      assert.equal(smokeCheck?.source, "manual");
      assert.match(smokeCheck?.note ?? "", /admin route pass/i);

      await assert.rejects(
        service.recordLaunchGovernanceEvidence({
          evidenceId: "evidence-auth-runtime",
          status: "recorded",
          owner: "Platform lead",
          summary: "",
          environment: "staging-eu",
        }),
        /summary is required/i,
      );

      await assert.rejects(
        service.recordLaunchGovernanceReview({
          reviewId: "unknown-review",
          status: "ready",
          owner: "Release owner",
          note: "Should not persist.",
          environment: "staging-eu",
        }),
        /unknown launch governance review target/i,
      );

      await assert.rejects(
        service.recordLaunchGovernanceSignOff({
          checkId: "unknown-signoff",
          status: "ready",
          owner: "Release owner",
          note: "Should not persist.",
          environment: "staging-eu",
        }),
        /unknown launch governance sign-off target/i,
      );

      await assert.rejects(
        service.recordLaunchGovernanceEvidence({
          evidenceId: "unknown-evidence",
          status: "recorded",
          owner: "Release owner",
          summary: "Should not persist.",
          environment: "staging-eu",
        }),
        /unknown launch governance evidence target/i,
      );

      await assert.rejects(
        service.recordLaunchGovernanceEnvironmentCheck({
          checkId: "unknown-environment",
          status: "ready",
          owner: "Platform lead",
          detail: "Should not persist.",
          environment: "staging-eu",
        }),
        /unknown launch governance environment target/i,
      );

      await assert.rejects(
        service.recordLaunchGovernanceSmokeCheck({
          checkId: "unknown-smoke",
          status: "ready",
          owner: "Release manager",
          note: "Should not persist.",
          environment: "staging-eu",
        }),
        /unknown launch governance smoke target/i,
      );
    } finally {
      restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
      restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
      restoreEnv("SWITCH_AUTH_MODE", previousAuthMode);
      restoreEnv("SWITCH_AUTH_SECRET", previousAuthSecret);
      restoreEnv("SWITCH_AUTH_BASE_URL", previousAuthBaseUrl);
      restoreEnv("SWITCH_CMS_BACKEND_MODE", previousCmsMode);
    }
  });
});

test("manual persistence-ready records do not mask a runtime persistence mismatch", async () => {
  await withTempDir(async (tempDir) => {
    const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
    const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
    const previousVercel = process.env.VERCEL;
    const previousAuthMode = process.env.SWITCH_AUTH_MODE;
    const previousAuthSecret = process.env.SWITCH_AUTH_SECRET;
    const previousAuthBaseUrl = process.env.SWITCH_AUTH_BASE_URL;
    const previousCmsMode = process.env.SWITCH_CMS_BACKEND_MODE;

    try {
      process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
      process.env.SWITCH_DATA_DIRECTORY = tempDir;
      process.env.VERCEL = "1";
      process.env.SWITCH_AUTH_MODE = "oidc";
      process.env.SWITCH_AUTH_SECRET = "governance-test-secret";
      process.env.SWITCH_AUTH_BASE_URL = "https://switch.example.com";
      process.env.SWITCH_CMS_BACKEND_MODE = "live";

      const service = await import(
        `../src/modules/governance/service.ts?test=${Date.now()}-launch-governance-mismatch`
      );

      await service.recordLaunchGovernanceEnvironmentCheck({
        checkId: "environment-persistence-path",
        status: "ready",
        owner: "Platform lead",
        detail: "The release checklist says persistence was verified.",
        environment: "production-eu",
        recordedAt: "2026-06-21T14:00:00.000Z",
      });

      await service.recordLaunchGovernanceEvidence({
        evidenceId: "evidence-persistence-sqlite",
        status: "recorded",
        owner: "Student data lead",
        summary: "The release checklist says the shared sqlite store was proven.",
        environment: "production-eu",
        recordedAt: "2026-06-21T14:05:00.000Z",
      });

      const overview = await service.getLaunchGovernanceOverview();
      const persistenceCheck = overview.environmentChecks.find(
        (item) => item.checkId === "environment-persistence-path",
      );
      const persistenceEvidence = overview.evidenceRecords.find(
        (item) => item.evidenceId === "evidence-persistence-sqlite",
      );

      assert.equal(persistenceCheck?.status, "watch");
      assert.equal(persistenceCheck?.source, "manual");
      assert.match(persistenceCheck?.detail ?? "", /runtime mismatch/i);
      assert.match(persistenceCheck?.detail ?? "", /ephemeral|provisional|default local path/i);

      assert.equal(persistenceEvidence?.status, "still-needed");
      assert.equal(persistenceEvidence?.source, "manual");
      assert.match(persistenceEvidence?.summary ?? "", /runtime mismatch/i);
    } finally {
      restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
      restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
      restoreEnv("VERCEL", previousVercel);
      restoreEnv("SWITCH_AUTH_MODE", previousAuthMode);
      restoreEnv("SWITCH_AUTH_SECRET", previousAuthSecret);
      restoreEnv("SWITCH_AUTH_BASE_URL", previousAuthBaseUrl);
      restoreEnv("SWITCH_CMS_BACKEND_MODE", previousCmsMode);
    }
  });
});
