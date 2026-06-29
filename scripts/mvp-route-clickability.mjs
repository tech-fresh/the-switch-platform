import {
  assertAllowedMvpClickTarget,
  assertSignedOutRouteBehavior,
  CANONICAL_MVP_ROUTES,
  STUDENT_SHELL_ROUTE_PATHS,
} from "./canonical-mvp-routes.mjs";
import { ensureWalkthroughStudentOnboardingComplete } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
  SWITCH_AUTH_SECRET: "mvp-route-clickability-secret",
});

function collectUniqueHrefs(entries, label) {
  const hrefs = new Set();

  for (const href of entries) {
    assertAllowedMvpClickTarget(href, label);
    hrefs.add(href);
  }

  return [...hrefs];
}

try {
  for (const route of CANONICAL_MVP_ROUTES) {
    await assertSignedOutRouteBehavior(server.baseUrl, route);
  }

  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, {
    cookie: studentCookie,
  });

  for (const path of STUDENT_SHELL_ROUTE_PATHS) {
    const route = CANONICAL_MVP_ROUTES.find((entry) => entry.path === path);
    const { response, body } = await fetchText(`${server.baseUrl}${path}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected signed-in ${path} to return 200, received ${response.status}.`);

    if (route?.signedInMarker) {
      assert(
        body.includes(route.signedInMarker),
        `Expected signed-in ${path} to include shell marker "${route.signedInMarker}".`,
      );
    }
  }

  const dashboard = await fetchJson(`${server.baseUrl}/api/dashboard/home`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(dashboard.response.ok, `Expected /api/dashboard/home to return 200, received ${dashboard.response.status}.`);

  const dashboardData = dashboard.json?.dashboard;
  assert(dashboardData, "Expected /api/dashboard/home to include dashboard payload.");

  const dashboardHrefs = collectUniqueHrefs(
    [
      ...dashboardData.routeCards.map((card) => card.href),
      dashboardData.continuityHref,
      ...dashboardData.focusCards.map((card) => card.subjectId ? `/subjects?subjectId=${encodeURIComponent(card.subjectId)}` : "/subjects"),
      ...dashboardData.examSessions.map((session) => session.href),
      ...dashboardData.assessmentSessions.map((session) => session.href),
    ],
    "dashboard home API",
  );

  for (const href of dashboardHrefs) {
    const { response } = await fetchText(`${server.baseUrl}${href}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected dashboard-linked ${href} to return 200, received ${response.status}.`);
  }

  const account = await fetchJson(`${server.baseUrl}/api/account/overview`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(account.response.ok, `Expected /api/account/overview to return 200, received ${account.response.status}.`);

  const quickLinkHrefs = collectUniqueHrefs(
    account.json?.account?.quickLinks?.map((link) => link.href) ?? [],
    "account quick links",
  );

  for (const href of quickLinkHrefs) {
    const { response, body } = await fetchText(`${server.baseUrl}${href}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected account quick link ${href} to return 200, received ${response.status}.`);
    assert(
      body.includes("aria-label=\"Student navigation\"") || href === "/admin",
      `Expected account quick link ${href} to render a student shell or admin surface.`,
    );
  }

  const savedProgress = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, {
    headers: {
      cookie: studentCookie,
    },
  });
  assert(
    savedProgress.response.ok,
    `Expected /api/saved-progress/overview to return 200, received ${savedProgress.response.status}.`,
  );

  const savedOverview = savedProgress.json?.overview;
  assert(savedOverview, "Expected /api/saved-progress/overview to include overview payload.");

  const resumeHrefs = collectUniqueHrefs(
    [
      savedOverview.continuity.primaryAction.href,
      ...savedOverview.sessions.map((session) => session.href),
    ],
    "saved progress resume links",
  );

  for (const href of resumeHrefs) {
    const { response } = await fetchText(`${server.baseUrl}${href}`, {
      headers: {
        cookie: studentCookie,
      },
    });

    assert(response.ok, `Expected saved-progress resume link ${href} to return 200, received ${response.status}.`);
  }

  const signedOutAccount = await fetchText(`${server.baseUrl}/account`);
  assert(signedOutAccount.response.ok, "Expected signed-out /account to return 200.");
  assert(
    signedOutAccount.body.includes("Log in") || signedOutAccount.body.includes("Sign in"),
    "Expected signed-out /account to offer a sign-in next action.",
  );

  const adminResponse = await fetch(`${server.baseUrl}/admin`, {
    redirect: "manual",
  });
  const adminLocation = adminResponse.headers.get("location") ?? "";

  assert(
    adminResponse.status >= 300 && adminResponse.status < 400,
    `Expected signed-out /admin to redirect, received ${adminResponse.status}.`,
  );
  assert(
    adminLocation.includes("/login") || adminLocation.includes("/account"),
    "Expected signed-out /admin to redirect to a safe auth route.",
  );

  console.log(
    "MVP route clickability passed: canonical routes, dashboard shortcuts, account quick links, and saved-progress resume links all resolve cleanly.",
  );
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
