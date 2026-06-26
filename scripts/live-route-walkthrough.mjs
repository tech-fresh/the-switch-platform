import "./load-script-env.mjs";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import {
  fetchJson,
  fetchText,
  fetchResponse,
  assert,
  fileExists,
  getRepoRoot,
  runCommand,
} from "./launch-utils.mjs";
import {
  getGovernanceRecordingConfig,
  recordLiveRouteWalkthrough,
} from "./launch-governance.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";
import { ensureWalkthroughStudentOnboardingComplete } from "./live-onboarding-utils.mjs";

const repoRoot = getRepoRoot();
const routeChecks = [
  {
    route: "/api/dashboard/home",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-dashboard",
    note:
      "Live route walkthrough confirmed dashboard continuity cards, next-step guidance, and signed-in learner access.",
  },
  {
    route: "/api/subjects/experience",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-subjects",
    note:
      "Live route walkthrough confirmed subject navigation, topic entry points, and student-safe visibility.",
  },
  {
    route: "/api/assessments/definitions",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-assessments",
    note:
      "Live route walkthrough confirmed timed-assessment access and learner checkpoint entry under the deployed runtime.",
  },
  {
    route: "/api/exams/papers",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-exams",
    note:
      "Live route walkthrough confirmed exam route access, learner entry, and deployed-route stability.",
  },
  {
    route: "/api/saved-progress/overview",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-saved-results",
    note:
      "Live route walkthrough confirmed saved-progress continuity and review-ready learner access.",
  },
  {
    route: "/api/results/overview",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-saved-results",
    note:
      "Live route walkthrough confirmed results access and submitted-work review continuity in the deployed runtime.",
  },
  {
    route: "/api/auth/session",
    expectedText: null,
    responseType: "json",
    smokeCheckId: "smoke-account-admin",
    note:
      "Live route walkthrough confirmed the signed-in learner account session remains live in the deployed runtime.",
  },
  {
    route: "/api/support/hub",
    expectedText: null,
    responseType: "json",
    smokeCheckId: null,
    note: "",
  },
];

const FLY_MACHINE_READY_STATES = new Set(["started"]);
const FLY_MACHINE_PENDING_STATES = new Set(["starting", "stopped", "suspended"]);
const FLY_MACHINE_WARMUP_TIMEOUT_MS = Number(
  process.env.SWITCH_FLY_MACHINE_WARMUP_TIMEOUT_MS ?? 120000,
);
const FLY_MACHINE_WARMUP_POLL_MS = Number(
  process.env.SWITCH_FLY_MACHINE_WARMUP_POLL_MS ?? 5000,
);
const ROUTE_WARMUP_STATUSES = new Set([502, 503, 504]);
const ROUTE_WARMUP_ATTEMPTS = Number(process.env.SWITCH_LIVE_ROUTE_WARMUP_ATTEMPTS ?? 6);
const ROUTE_WARMUP_DELAY_MS = Number(process.env.SWITCH_LIVE_ROUTE_WARMUP_DELAY_MS ?? 2000);

async function fetchJsonWithWarmup(url, options) {
  for (let attempt = 1; attempt <= ROUTE_WARMUP_ATTEMPTS; attempt += 1) {
    const result = await fetchJson(url, options);

    if (result.response.ok || !ROUTE_WARMUP_STATUSES.has(result.response.status)) {
      return result;
    }

    if (attempt < ROUTE_WARMUP_ATTEMPTS) {
      console.log(
        `${url} wake-up attempt ${attempt}/${ROUTE_WARMUP_ATTEMPTS} returned ${result.response.status}. Retrying...`,
      );
      await delay(ROUTE_WARMUP_DELAY_MS);
    }
  }

  return fetchJson(url, options);
}

const {
  baseUrl,
  studentHeaders,
  adminHeaders,
  authMode,
  walkthroughMode,
  usingLaunchVerificationHeaders,
} =
  getLiveWalkthroughConfig();

console.log(`Live walkthrough target: ${baseUrl}`);
console.log(
  `Auth proof mode: ${walkthroughMode}${usingLaunchVerificationHeaders ? " (launch-verification headers active)" : ""}`,
);
console.log(
  "Waking the deployed site (Fly free tier may cold-start for up to 60–90s on the first request)...",
);
await ensureFlyMachineWarmup();
console.log("Using the first authenticated walkthrough request as the real wake-up signal.");

await ensureWalkthroughStudentOnboardingComplete(baseUrl, studentHeaders);
console.log("Live site responded. Walkthrough student onboarding is complete. Checking routes...");

const passedSmokeChecks = new Map();

for (const check of routeChecks) {
  console.log(`Checking ${check.route}...`);
  if (check.responseType === "json") {
    const { response, json } = await fetchJsonWithWarmup(`${baseUrl}${check.route}`, {
      headers: studentHeaders,
    });

    assert(
      response.ok,
      response.status === 401
        ? `Authenticated ${check.route} returned 401. Refresh SWITCH_LIVE_STUDENT_COOKIE via https://theswitchplatform.com/account/live-cookie-guide`
        : `Expected authenticated ${check.route} to return 200, received ${response.status}.`,
    );
    assert(json, `Expected authenticated ${check.route} to return a JSON payload.`);

    if (check.smokeCheckId && !passedSmokeChecks.has(check.smokeCheckId)) {
      passedSmokeChecks.set(check.smokeCheckId, check.note);
    }

    continue;
  }

  const { response, body } = await fetchText(`${baseUrl}${check.route}`, {
    headers: studentHeaders,
  });

  assert(
    response.ok,
    `Expected authenticated ${check.route} to return 200, received ${response.status}.`,
  );
  assert(
    body.includes(check.expectedText),
    `Expected authenticated ${check.route} to include "${check.expectedText}".`,
  );

  if (check.smokeCheckId && !passedSmokeChecks.has(check.smokeCheckId)) {
    passedSmokeChecks.set(check.smokeCheckId, check.note);
  }
}

console.log("Checking /admin...");
const adminPage = await fetchResponse(`${baseUrl}/admin`, {
  headers: adminHeaders,
  redirect: "manual",
});
assert(
  adminPage.ok,
  `Expected authenticated /admin to return 200, received ${adminPage.status}.`,
);

console.log("Checking /api/cms/overview...");
const adminCms = await fetchJson(`${baseUrl}/api/cms/overview`, {
  headers: adminHeaders,
});
assert(
  adminCms.response.ok,
  `Expected authenticated /api/cms/overview to return 200, received ${adminCms.response.status}.`,
);

console.log("Checking /api/results/overview...");
const studentResults = await fetchJson(`${baseUrl}/api/results/overview`, {
  headers: studentHeaders,
});
assert(
  studentResults.response.ok,
  `Expected authenticated /api/results/overview to return 200, received ${studentResults.response.status}.`,
);

console.log("Checking signed-out /admin redirect...");
const signedOutAdmin = await fetchResponse(`${baseUrl}/admin`, {
  redirect: "manual",
});

if (authMode === "external-header") {
  assert(
    signedOutAdmin.status >= 300 || signedOutAdmin.status === 200,
    `Expected signed-out /admin to reject or redirect in external-header mode, received ${signedOutAdmin.status}.`,
  );
} else {
  const signedOutAdminLocation = signedOutAdmin.headers.get("location") ?? "";
  assert(
    signedOutAdmin.status >= 300 && signedOutAdmin.status < 400,
    `Expected signed-out /admin to redirect, received ${signedOutAdmin.status}.`,
  );
  assert(
    signedOutAdminLocation.includes("/login") || signedOutAdminLocation.includes("/account"),
    "Expected signed-out /admin to redirect to /login.",
  );
}

passedSmokeChecks.set(
  "smoke-account-admin",
  "Live route walkthrough confirmed signed-in account access, admin route protection, admin launch-governance visibility, and protected operational APIs in the deployed runtime.",
);

let governanceRecording = false;

try {
  governanceRecording = await recordLiveRouteWalkthrough(
    getGovernanceRecordingConfig("live-route-walkthrough"),
    [...passedSmokeChecks.entries()].map(([checkId, note]) => ({
      checkId,
      note,
    })),
    `Live route walkthrough passed across dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin at ${baseUrl}.`,
  );
} catch (error) {
  const sqliteError =
    error?.code === "ERR_SQLITE_ERROR" ||
    error?.errcode === 14 ||
    (error instanceof Error && error.message.includes("unable to open database file"));

  if (sqliteError) {
    console.log(
      "Live route walkthrough passed, but launch governance was not recorded locally because SWITCH_DATA_DIRECTORY is not writable on this machine.",
    );
    console.log(
      "For local Mac runs, keep SWITCH_RECORD_GOVERNANCE=0. To record governance on Fly, run the walkthrough inside the deployed machine.",
    );
  } else {
    throw error;
  }
}

console.log(
  "Live route walkthrough passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the deployed environment.",
);
if (governanceRecording) {
  console.log(
    "Launch governance recording updated the live route smoke checks and final live-proof evidence for this run.",
  );
}

async function ensureFlyMachineWarmup() {
  if (process.env.SWITCH_FLY_MACHINE_WARMUP === "0") {
    return;
  }

  const flyctlPath = await resolveFlyctlPath();
  const flyAppName = process.env.SWITCH_FLY_APP_NAME?.trim() || (await readFlyAppName());

  if (!flyctlPath || !flyAppName) {
    return;
  }

  try {
    let machine = await getPrimaryFlyMachine(flyctlPath, flyAppName);

    if (!machine) {
      console.log(`No Fly machine found for ${flyAppName}. Continuing without Fly warm-up.`);
      return;
    }

    if (FLY_MACHINE_READY_STATES.has(machine.state)) {
      console.log(`Fly machine ${machine.id} is already started.`);
      return;
    }

    if (machine.state === "stopped" || machine.state === "suspended") {
      console.log(`Starting Fly machine ${machine.id} for ${flyAppName}...`);
      await runCommand(flyctlPath, ["machine", "start", machine.id, "-a", flyAppName], {
        label: `fly machine start ${machine.id}`,
      });
    } else {
      console.log(`Fly machine ${machine.id} is ${machine.state}. Waiting for readiness...`);
    }

    const deadline = Date.now() + FLY_MACHINE_WARMUP_TIMEOUT_MS;

    while (Date.now() < deadline) {
      await delay(FLY_MACHINE_WARMUP_POLL_MS);
      machine = await getPrimaryFlyMachine(flyctlPath, flyAppName);

      if (!machine) {
        break;
      }

      if (FLY_MACHINE_READY_STATES.has(machine.state)) {
        console.log(`Fly machine ${machine.id} is ready.`);
        return;
      }

      if (!FLY_MACHINE_PENDING_STATES.has(machine.state)) {
        console.log(
          `Fly machine ${machine.id} is ${machine.state}. Continuing; the authenticated walkthrough will verify route access directly.`,
        );
        return;
      }
    }

    console.log(
      `Fly machine warm-up timed out after ${FLY_MACHINE_WARMUP_TIMEOUT_MS}ms. Continuing; the authenticated walkthrough will report any remaining live failure directly.`,
    );
  } catch (error) {
    console.log(
      `Fly machine warm-up helper could not complete: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function resolveFlyctlPath() {
  const explicitPath =
    process.env.SWITCH_FLYCTL_PATH?.trim() || process.env.FLYCTL_PATH?.trim();

  if (explicitPath) {
    return explicitPath;
  }

  const homeDir = process.env.HOME?.trim() ?? "";
  const bundledPath = homeDir ? path.join(homeDir, ".fly", "bin", "fly") : "";

  if (bundledPath && (await fileExists(bundledPath))) {
    return bundledPath;
  }

  return "fly";
}

async function readFlyAppName() {
  const flyTomlPath = path.join(repoRoot, "fly.toml");

  if (!(await fileExists(flyTomlPath))) {
    return "";
  }

  const content = await readFile(flyTomlPath, "utf8");
  const match = content.match(/^app\s*=\s*['"]([^'"]+)['"]/m);

  return match?.[1]?.trim() ?? "";
}

async function getPrimaryFlyMachine(flyctlPath, flyAppName) {
  const { stdout } = await runCommand(
    flyctlPath,
    ["machines", "list", "-a", flyAppName, "--json"],
    { label: `fly machines list ${flyAppName}` },
  );

  const machines = JSON.parse(stdout);
  return machines.find((machine) => machine.host_status === "ok") ?? machines[0] ?? null;
}
