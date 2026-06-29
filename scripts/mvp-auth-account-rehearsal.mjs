import { assertAllowedMvpClickTarget } from "./canonical-mvp-routes.mjs";
import { ensureWalkthroughStudentOnboardingComplete } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const STUDENT_SIGN_IN = {
  provider: "email-magic-link",
  returnTo: "/account",
};
const ADMIN_SIGN_IN = {
  provider: "google",
  returnTo: "/admin",
};

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
  SWITCH_AUTH_SECRET: "mvp-auth-account-rehearsal",
});

try {
  const signedOutAccount = await fetchText(`${server.baseUrl}/account`);
  assert(signedOutAccount.response.ok, "Expected signed-out /account to return 200.");
  assert(
    signedOutAccount.body.includes("Signed out") || signedOutAccount.body.includes("Log in"),
    "Expected signed-out /account to explain the signed-out state.",
  );
  assert(
    !signedOutAccount.body.includes('aria-label="Student navigation"'),
    "Expected signed-out /account to stay outside the student shell.",
  );

  const signedOutAdmin = await fetch(`${server.baseUrl}/admin`, { redirect: "manual" });
  const signedOutAdminLocation = signedOutAdmin.headers.get("location") ?? "";
  assert(
    signedOutAdmin.status >= 300 && signedOutAdmin.status < 400,
    `Expected signed-out /admin to redirect, received ${signedOutAdmin.status}.`,
  );
  assert(
    signedOutAdminLocation.includes("/login"),
    "Expected signed-out /admin to redirect to /login.",
  );

  const studentCookie = await signIn(
    server.baseUrl,
    STUDENT_SIGN_IN.provider,
    STUDENT_SIGN_IN.returnTo,
  );
  const studentHeaders = { cookie: studentCookie };
  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, studentHeaders);

  const studentAccountApi = await fetchJson(`${server.baseUrl}/api/account/overview`, {
    headers: studentHeaders,
  });
  assert(studentAccountApi.response.ok, "Expected student account overview API to return 200.");
  assert(
    studentAccountApi.json?.account?.isAuthenticated === true,
    "Expected student account overview to report an authenticated session.",
  );
  assert(
    studentAccountApi.json?.account?.session?.user?.roles?.includes("student") === true,
    "Expected student rehearsal sign-in to include the student role.",
  );

  const studentAccountPage = await fetchText(`${server.baseUrl}/account`, { headers: studentHeaders });
  assert(studentAccountPage.response.ok, "Expected signed-in /account to return 200.");
  assert(
    studentAccountPage.body.includes("Your signed-in identity and study shortcuts"),
    "Expected signed-in student account copy.",
  );
  assert(
    studentAccountPage.body.includes('aria-label="Student navigation"'),
    "Expected signed-in /account to render inside the student shell.",
  );
  assert(
    !studentAccountPage.body.includes("Open admin dashboard"),
    "Expected student account page to hide admin entry.",
  );

  for (const link of studentAccountApi.json?.account?.quickLinks ?? []) {
    assertAllowedMvpClickTarget(link.href, `student account quick link "${link.label}"`);
  }

  const studentAdminAttempt = await fetch(`${server.baseUrl}/admin`, {
    redirect: "manual",
    headers: studentHeaders,
  });
  const studentAdminLocation = studentAdminAttempt.headers.get("location") ?? "";
  assert(
    studentAdminAttempt.status >= 300 && studentAdminAttempt.status < 400,
    `Expected student /admin access to redirect, received ${studentAdminAttempt.status}.`,
  );
  assert(
    studentAdminLocation.includes("/login"),
    "Expected non-allowlisted student /admin access to redirect to /login.",
  );

  const adminCookie = await signIn(server.baseUrl, ADMIN_SIGN_IN.provider, ADMIN_SIGN_IN.returnTo);
  const adminHeaders = { cookie: adminCookie };
  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, adminHeaders);

  const adminAccountApi = await fetchJson(`${server.baseUrl}/api/account/overview`, {
    headers: adminHeaders,
  });
  assert(adminAccountApi.response.ok, "Expected admin account overview API to return 200.");
  assert(
    adminAccountApi.json?.account?.session?.user?.roles?.includes("admin") === true,
    "Expected admin rehearsal sign-in to include the admin role.",
  );

  const adminAccountPage = await fetchText(`${server.baseUrl}/account`, { headers: adminHeaders });
  assert(
    adminAccountPage.body.includes("Open admin dashboard"),
    "Expected admin-capable account page to expose admin entry.",
  );

  const adminPage = await fetchText(`${server.baseUrl}/admin`, { headers: adminHeaders });
  assert(adminPage.response.ok, `Expected authenticated /admin to return 200, received ${adminPage.response.status}.`);
  assert(adminPage.response.url.endsWith("/admin"), "Expected authenticated /admin to stay on /admin.");
  assert(
    adminPage.body.includes("Launch governance") || adminPage.body.includes("admin"),
    "Expected /admin to render admin surface copy.",
  );

  const signOutResponse = await fetchJson(`${server.baseUrl}/api/auth/session`, {
    method: "DELETE",
    headers: {
      origin: server.baseUrl,
      cookie: studentCookie,
    },
  });
  assert(signOutResponse.response.ok, `Expected sign-out to return 200, received ${signOutResponse.response.status}.`);
  assert(
    signOutResponse.json?.session?.status === "signed-out",
    "Expected sign-out response to report a signed-out session.",
  );
  assert(
    (signOutResponse.response.headers.get("set-cookie") ?? "").includes("switch_auth_session="),
    "Expected sign-out to clear the auth session cookie.",
  );

  const signedOutDashboard = await fetch(`${server.baseUrl}/dashboard`, { redirect: "manual" });
  const signedOutDashboardLocation = signedOutDashboard.headers.get("location") ?? "";
  assert(
    signedOutDashboard.status >= 300 && signedOutDashboard.status < 400,
    `Expected signed-out /dashboard to redirect, received ${signedOutDashboard.status}.`,
  );
  assert(
    signedOutDashboardLocation.includes("/login"),
    "Expected signed-out /dashboard to redirect to /login.",
  );

  const signedOutResultsApi = await fetchJson(`${server.baseUrl}/api/results/overview`, {});
  assert(
    signedOutResultsApi.response.status === 401,
    `Expected signed-out /api/results/overview to return 401, received ${signedOutResultsApi.response.status}.`,
  );

  console.log(
    "MVP auth and account rehearsal passed: signed-out account, student sign-in, admin sign-in, admin protection, and sign-out lockout all behaved correctly.",
  );
} finally {
  await stopServer(server.child);
}

async function signIn(baseUrl, provider, returnTo) {
  const response = await fetch(
    `${baseUrl}/api/auth/start?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(returnTo)}`,
    { redirect: "manual" },
  );

  assert(response.status >= 300 && response.status < 400, `Expected sign-in start for ${provider} to redirect.`);

  return getSessionCookie(response.headers.getSetCookie());
}
