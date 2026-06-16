import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
});

try {
  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/account");
  const adminCookie = await signIn(server.baseUrl, "google", "/admin");

  const studentAccount = await fetchJson(`${server.baseUrl}/api/account/overview`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(studentAccount.response.ok, `Expected student account overview to return 200, received ${studentAccount.response.status}.`);
  assert(studentAccount.json?.account?.isAuthenticated === true, "Expected student account overview to report an authenticated session.");

  const studentResults = await fetchJson(`${server.baseUrl}/api/results/overview`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(studentResults.response.ok, `Expected authenticated /api/results/overview to return 200, received ${studentResults.response.status}.`);

  const adminAccount = await fetchJson(`${server.baseUrl}/api/account/overview`, {
    headers: {
      cookie: adminCookie,
    },
  });
  assert(adminAccount.response.ok, `Expected admin account overview to return 200, received ${adminAccount.response.status}.`);
  assert(
    adminAccount.json?.account?.session?.user?.roles?.includes("admin") === true,
    "Expected the admin session to include the admin role.",
  );

  const accountPage = await fetchText(`${server.baseUrl}/account`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(accountPage.body.includes("Signed-in student identity"), "Expected signed-in account page copy to render for the student session.");

  for (const route of ["/dashboard", "/assessments", "/exams", "/saved-progress", "/results"]) {
    const page = await fetchText(`${server.baseUrl}${route}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(page.response.ok, `Expected authenticated ${route} to return 200, received ${page.response.status}.`);
  }

  const adminPage = await fetchText(`${server.baseUrl}/admin`, {
    headers: {
      cookie: adminCookie,
    },
  });
  assert(adminPage.response.ok, `Expected authenticated /admin to return 200, received ${adminPage.response.status}.`);
  assert(adminPage.response.url.endsWith("/admin"), `Expected authenticated /admin to stay on /admin, received ${adminPage.response.url}.`);

  const cmsOverview = await fetchJson(`${server.baseUrl}/api/cms/overview`, {
    headers: {
      cookie: adminCookie,
    },
  });
  assert(cmsOverview.response.ok, `Expected authenticated /api/cms/overview to return 200, received ${cmsOverview.response.status}.`);
  assert(cmsOverview.json?.overview, "Expected authenticated CMS overview response to include overview data.");

  const signOutResponse = await fetchJson(`${server.baseUrl}/api/auth/session`, {
    method: "DELETE",
    headers: {
      origin: server.baseUrl,
      cookie: studentCookie,
    },
  });
  assert(signOutResponse.response.ok, `Expected sign-out to return 200, received ${signOutResponse.response.status}.`);
  assert(signOutResponse.json?.session?.status === "signed-out", "Expected sign-out response to report a signed-out session.");
  assert(
    (signOutResponse.response.headers.get("set-cookie") ?? "").includes("switch_auth_session="),
    "Expected sign-out to clear the auth session cookie.",
  );

  const signedOutResults = await fetchJson(`${server.baseUrl}/api/results/overview`, {
  });
  assert(signedOutResults.response.status === 401, `Expected signed-out /api/results/overview to return 401, received ${signedOutResults.response.status}.`);

  console.log("Local end-to-end rehearsal passed: student continuity, admin access, protected APIs, and sign-out all behaved correctly in the preview-style test runtime.");
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

  const cookies = response.headers.getSetCookie();

  return getSessionCookie(cookies);
}
