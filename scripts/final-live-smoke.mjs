import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const studentRoutes = [
  ["/dashboard", "Dashboard"],
  ["/subjects", "Subjects"],
  ["/assessments", "Timed Assessment"],
  ["/exams", "Exam Engine Preview"],
  ["/saved-progress", "Saved Progress"],
  ["/results", "Results"],
  ["/account", "Student Account"],
  ["/support", "Support Hub"],
];

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
});

try {
  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  const adminCookie = await signIn(server.baseUrl, "google", "/admin");

  for (const [route, expectedText] of studentRoutes) {
    const { response, body } = await fetchText(`${server.baseUrl}${route}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected authenticated ${route} to return 200, received ${response.status}.`);
    assert(body.includes(expectedText), `Expected authenticated ${route} to include "${expectedText}".`);
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

  console.log("Final live smoke pass passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly.");
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
