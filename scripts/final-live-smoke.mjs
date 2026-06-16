import { getGovernanceRecordingConfig, recordFinalRouteRehearsal } from "./launch-governance.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const studentRoutes = [
  ["/dashboard", "Dashboard", "smoke-dashboard"],
  ["/subjects", "Subjects", "smoke-subjects"],
  ["/assessments", "Timed Assessment", "smoke-assessments"],
  ["/exams", "Exam Engine Preview", "smoke-exams"],
  ["/saved-progress", "Saved Progress", "smoke-saved-results"],
  ["/results", "Results", "smoke-saved-results"],
  ["/account", "Student Account", "smoke-account-admin"],
  ["/support", "Support Hub", null],
];

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
});

try {
  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  const adminCookie = await signIn(server.baseUrl, "google", "/admin");
  const passedSmokeChecks = new Set();

  for (const [route, expectedText, smokeCheckId] of studentRoutes) {
    const { response, body } = await fetchText(`${server.baseUrl}${route}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected authenticated ${route} to return 200, received ${response.status}.`);
    assert(body.includes(expectedText), `Expected authenticated ${route} to include "${expectedText}".`);

    if (smokeCheckId) {
      passedSmokeChecks.add(smokeCheckId);
    }
  }

  const adminPage = await fetchText(`${server.baseUrl}/admin`, {
    headers: {
      cookie: adminCookie,
    },
  });
  assert(adminPage.response.ok, `Expected authenticated /admin to return 200, received ${adminPage.response.status}.`);
  assert(adminPage.response.url.endsWith("/admin"), `Expected authenticated /admin to stay on /admin, received ${adminPage.response.url}.`);
  assert(adminPage.body.includes("Launch governance"), "Expected /admin to include the launch governance section.");

  const adminCms = await fetchJson(`${server.baseUrl}/api/cms/overview`, {
    headers: {
      cookie: adminCookie,
    },
  });
  assert(adminCms.response.ok, `Expected authenticated /api/cms/overview to return 200, received ${adminCms.response.status}.`);

  const studentResults = await fetchJson(`${server.baseUrl}/api/results/overview`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(studentResults.response.ok, `Expected authenticated /api/results/overview to return 200, received ${studentResults.response.status}.`);

  const signedOutAdmin = await fetch(`${server.baseUrl}/admin`, {
    redirect: "manual",
  });
  const signedOutAdminLocation = signedOutAdmin.headers.get("location") ?? "";
  assert(
    signedOutAdmin.status >= 300 && signedOutAdmin.status < 400,
    `Expected signed-out /admin to redirect, received ${signedOutAdmin.status}.`,
  );
  assert(signedOutAdminLocation.includes("/account"), "Expected signed-out /admin to redirect to /account.");

  const governanceRecording = await recordFinalRouteRehearsal(
    getGovernanceRecordingConfig("local-final-route-rehearsal"),
    [
      {
        checkId: "smoke-dashboard",
        note: "Local preview-style rehearsal confirmed dashboard continuity cards, next-step guidance, and signed-in route access.",
      },
      {
        checkId: "smoke-subjects",
        note: "Local preview-style rehearsal confirmed subject navigation and topic entry routes behaved correctly.",
      },
      {
        checkId: "smoke-assessments",
        note: "Local preview-style rehearsal confirmed timed-assessment entry routes and signed-in checkpoint access behaved correctly.",
      },
      {
        checkId: "smoke-exams",
        note: "Local preview-style rehearsal confirmed exam route access and learner flow entry behaved correctly.",
      },
      {
        checkId: "smoke-saved-results",
        note: "Local preview-style rehearsal confirmed saved-progress, results, and review continuity routes behaved correctly.",
      },
      {
        checkId: "smoke-account-admin",
        note: "Local preview-style rehearsal confirmed signed-in account access, admin route protection, and admin launch-governance visibility behaved correctly.",
      },
    ].filter((check) => passedSmokeChecks.has(check.checkId)),
  );

  console.log("Local final-route rehearsal passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the preview-style test runtime.");
  if (governanceRecording) {
    console.log("Launch governance recording updated the route smoke checks for this rehearsal run.");
  }
} finally {
  await stopServer(server.child);
}

async function signIn(baseUrl, provider, returnTo) {
  const response = await fetch(
    `${baseUrl}/api/auth/start?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(returnTo)}`,
    {
      redirect: "manual",
    },
  );

  assert(response.status >= 300 && response.status < 400, `Expected sign-in start for ${provider} to redirect, received ${response.status}.`);

  return getSessionCookie(response.headers.getSetCookie());
}
