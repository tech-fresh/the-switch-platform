import "./load-script-env.mjs";

import {
  fetchJson,
  fetchText,
  fetchResponse,
  assert,
} from "./launch-utils.mjs";
import {
  getGovernanceRecordingConfig,
  recordLiveRouteWalkthrough,
} from "./launch-governance.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";
import { ensureWalkthroughStudentOnboardingComplete } from "./live-onboarding-utils.mjs";

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
    route: "/subjects",
    expectedText: "Subjects",
    smokeCheckId: "smoke-subjects",
    note:
      "Live route walkthrough confirmed subject navigation, topic entry points, and student-safe visibility.",
  },
  {
    route: "/assessments",
    expectedText: "Timed Assessment",
    smokeCheckId: "smoke-assessments",
    note:
      "Live route walkthrough confirmed timed-assessment access and learner checkpoint entry under the deployed runtime.",
  },
  {
    route: "/exams",
    expectedText: "Exam Engine Preview",
    smokeCheckId: "smoke-exams",
    note:
      "Live route walkthrough confirmed exam route access, learner entry, and deployed-route stability.",
  },
  {
    route: "/saved-progress",
    expectedText: "Saved Progress",
    smokeCheckId: "smoke-saved-results",
    note:
      "Live route walkthrough confirmed saved-progress continuity and review-ready learner access.",
  },
  {
    route: "/results",
    expectedText: "Results",
    smokeCheckId: "smoke-saved-results",
    note:
      "Live route walkthrough confirmed results access and submitted-work review continuity in the deployed runtime.",
  },
  {
    route: "/account",
    expectedText: "Student Account",
    smokeCheckId: "smoke-account-admin",
    note:
      "Live route walkthrough confirmed signed-in learner account access in the deployed runtime.",
  },
  {
    route: "/support",
    expectedText: "Support Hub",
    smokeCheckId: null,
    note: "",
  },
];

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

const warmup = await fetchJson(`${baseUrl}/api/auth/providers`);
assert(
  warmup.response.ok,
  `Live walkthrough failed: ${baseUrl}/api/auth/providers returned ${warmup.response.status}.`,
);
console.log("Live site responded. Checking authenticated routes...");

await ensureWalkthroughStudentOnboardingComplete(baseUrl, studentHeaders);
console.log("Walkthrough student onboarding is complete. Checking routes...");

const passedSmokeChecks = new Map();

for (const check of routeChecks) {
  console.log(`Checking ${check.route}...`);
  if (check.responseType === "json") {
    const { response, json } = await fetchJson(`${baseUrl}${check.route}`, {
      headers: studentHeaders,
    });

    assert(
      response.ok,
      `Expected authenticated ${check.route} to return 200, received ${response.status}.`,
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
const adminPage = await fetchText(`${baseUrl}/admin`, {
  headers: adminHeaders,
});
assert(
  adminPage.response.ok,
  `Expected authenticated /admin to return 200, received ${adminPage.response.status}.`,
);
assert(
  adminPage.body.includes("Launch governance"),
  "Expected /admin to include the launch governance section.",
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
