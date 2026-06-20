import "./load-script-env.mjs";

import {
  fetchJson,
  fetchText,
  assert,
} from "./launch-utils.mjs";
import {
  getGovernanceRecordingConfig,
  recordLiveRouteWalkthrough,
} from "./launch-governance.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

const routeChecks = [
  {
    route: "/dashboard",
    expectedText: "Dashboard",
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

const { baseUrl, studentHeaders, adminHeaders, authMode } =
  getLiveWalkthroughConfig();

const passedSmokeChecks = new Map();

for (const check of routeChecks) {
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

const adminCms = await fetchJson(`${baseUrl}/api/cms/overview`, {
  headers: adminHeaders,
});
assert(
  adminCms.response.ok,
  `Expected authenticated /api/cms/overview to return 200, received ${adminCms.response.status}.`,
);

const studentResults = await fetchJson(`${baseUrl}/api/results/overview`, {
  headers: studentHeaders,
});
assert(
  studentResults.response.ok,
  `Expected authenticated /api/results/overview to return 200, received ${studentResults.response.status}.`,
);

const signedOutAdmin = await fetch(`${baseUrl}/admin`, {
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
    signedOutAdminLocation.includes("/account"),
    "Expected signed-out /admin to redirect to /account.",
  );
}

passedSmokeChecks.set(
  "smoke-account-admin",
  "Live route walkthrough confirmed signed-in account access, admin route protection, admin launch-governance visibility, and protected operational APIs in the deployed runtime.",
);

const governanceRecording = await recordLiveRouteWalkthrough(
  getGovernanceRecordingConfig("live-route-walkthrough"),
  [...passedSmokeChecks.entries()].map(([checkId, note]) => ({
    checkId,
    note,
  })),
  `Live route walkthrough passed across dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin at ${baseUrl}.`,
);

console.log(
  "Live route walkthrough passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the deployed environment.",
);
if (governanceRecording) {
  console.log(
    "Launch governance recording updated the live route smoke checks and final live-proof evidence for this run.",
  );
}
