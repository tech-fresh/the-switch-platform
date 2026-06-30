import { assertAllowedMvpClickTarget } from "./canonical-mvp-routes.mjs";
import { ensureWalkthroughStudentOnboardingComplete } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const SUPPORT_SIGNED_OUT_MARKER =
  "Trusted support links for young people, including exam stress help and urgent support routes.";

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
  SWITCH_AUTH_SECRET: "mvp-support-recovery-rehearsal",
});

function assertPageIncludesRecoveryActions(body, context) {
  const recoveryHrefs = [...body.matchAll(/href="(\/[^"#?]+)"/g)].map((match) => match[1]);
  const actionable = recoveryHrefs.filter((href) =>
    ["/exams", "/assessments", "/saved-progress", "/dashboard", "/support", "/accessibility", "/results"].includes(
      href,
    ),
  );

  assert(actionable.length > 0, `Expected ${context} to expose at least one recovery action link.`);
  assert(
    actionable.some((href) => href === "/exams" || href === "/assessments" || href === "/dashboard"),
    `Expected ${context} to offer a primary study recovery action.`,
  );

  for (const href of actionable) {
    assertAllowedMvpClickTarget(href, `${context} recovery action`);
  }
}

try {
  const supportPage = await fetchText(`${server.baseUrl}/support`);
  assert(supportPage.response.ok, `Expected /support to return 200, received ${supportPage.response.status}.`);
  assert(
    supportPage.body.includes(SUPPORT_SIGNED_OUT_MARKER),
    "Expected /support to include the canonical public support marker.",
  );
  assert(
    supportPage.body.includes("Need support right now?") || supportPage.body.includes("Urgent help"),
    "Expected /support to signpost urgent help.",
  );
  assert(
    supportPage.body.includes("Route guidance") || supportPage.body.includes("How support should appear"),
    "Expected /support to explain route guidance.",
  );
  assert(
    !supportPage.body.includes('aria-label="Student navigation"'),
    "Expected /support to stay on the public marketing surface.",
  );

  const supportApi = await fetchJson(`${server.baseUrl}/api/support/hub`);
  assert(supportApi.response.ok, "Expected support hub API to return 200.");
  assert(supportApi.json?.support?.urgentHelp?.length > 0, "Expected support hub API to expose urgent help options.");
  assert(
    supportApi.json?.support?.routeGuidance?.some((entry) => entry.routeId === "/accessibility"),
    "Expected support hub API to include accessibility route guidance.",
  );

  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  const headers = { cookie: studentCookie };

  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, headers);

  const [dashboardPage, accountPage, accessibilityPage, recommendationsPage] = await Promise.all([
    fetchText(`${server.baseUrl}/dashboard`, { headers }),
    fetchText(`${server.baseUrl}/account`, { headers }),
    fetchText(`${server.baseUrl}/accessibility`, { headers }),
    fetchText(`${server.baseUrl}/recommendations`, { headers }),
  ]);

  for (const [label, page] of [
    ["dashboard", dashboardPage],
    ["account", accountPage],
    ["accessibility", accessibilityPage],
    ["recommendations", recommendationsPage],
  ]) {
    assert(page.response.ok, `Expected signed-in ${label} to return 200.`);
    assert(
      page.body.includes('aria-label="Student navigation"'),
      `Expected signed-in ${label} to render inside the student shell.`,
    );
  }

  assert(
    dashboardPage.body.includes('href="/support"') && dashboardPage.body.includes('href="/accessibility"'),
    "Expected dashboard route cards to signpost support and accessibility.",
  );
  assert(
    accountPage.body.includes('href="/accessibility"') && accountPage.body.includes('href="/support"'),
    "Expected account quick links to signpost accessibility and support.",
  );
  assert(
    accessibilityPage.body.includes("Open support hub") || accessibilityPage.body.includes('href="/support"'),
    "Expected accessibility route to signpost the support hub.",
  );
  assert(
    recommendationsPage.body.includes("Open support hub") || recommendationsPage.body.includes('href="/support"'),
    "Expected recommendations route to signpost the support hub.",
  );

  const accountApi = await fetchJson(`${server.baseUrl}/api/account/overview`, { headers });
  assert(accountApi.response.ok, "Expected account overview API to return 200.");

  for (const link of accountApi.json?.account?.quickLinks ?? []) {
    assertAllowedMvpClickTarget(link.href, `account quick link "${link.label}"`);
  }

  const accessibilityApi = await fetchJson(`${server.baseUrl}/api/accessibility/snapshot`, { headers });
  assert(accessibilityApi.response.ok, "Expected accessibility snapshot API to return 200.");
  assert(
    accessibilityApi.json?.snapshot?.settings,
    "Expected accessibility snapshot API to expose student settings.",
  );

  const invalidExamRecovery = await fetchText(
    `${server.baseUrl}/exams?examId=not-a-real-paper&questionId=q1-v1`,
    { headers },
  );
  assert(invalidExamRecovery.response.ok, "Expected invalid exam route to return 200.");
  assert(
    invalidExamRecovery.body.includes("Exam recovery") ||
      invalidExamRecovery.body.includes("incomplete") ||
      invalidExamRecovery.body.includes("Question navigator") ||
      invalidExamRecovery.body.includes("Exam focus mode"),
    "Expected invalid exam route to show recovery guidance or a safe exam fallback.",
  );
  if (/recovery|incomplete/i.test(invalidExamRecovery.body)) {
    assertPageIncludesRecoveryActions(invalidExamRecovery.body, "invalid exam recovery");
  }

  const invalidAssessmentRecovery = await fetchText(
    `${server.baseUrl}/assessments?assessmentId=not-a-real-checkpoint`,
    { headers },
  );
  assert(invalidAssessmentRecovery.response.ok, "Expected invalid assessment recovery page to return 200.");
  assert(
    invalidAssessmentRecovery.body.includes("Timed practice recovery") ||
      invalidAssessmentRecovery.body.includes("unavailable"),
    "Expected invalid assessment route to show recovery guidance.",
  );
  assertPageIncludesRecoveryActions(invalidAssessmentRecovery.body, "invalid assessment recovery");

  const savedProgressApi = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  assert(savedProgressApi.response.ok, "Expected saved-progress overview API to return 200.");

  const resultsApi = await fetchJson(`${server.baseUrl}/api/results/overview`, { headers });
  assert(resultsApi.response.ok, "Expected results overview API to return 200.");

  if (resultsApi.json?.results?.continuityStatus === "start-first-session") {
    const resultsPage = await fetchText(`${server.baseUrl}/results`, { headers });
    assert(
      resultsPage.body.includes("Results continuity") || resultsPage.body.includes("No submitted results yet"),
      "Expected empty results continuity to show recovery guidance.",
    );
    assertPageIncludesRecoveryActions(resultsPage.body, "empty results continuity");
  }

  if ((savedProgressApi.json?.overview?.sessionCount ?? 0) === 0) {
    const savedProgressPage = await fetchText(`${server.baseUrl}/saved-progress`, { headers });
    assert(
      savedProgressPage.body.includes("Saved progress recovery") ||
        savedProgressPage.body.includes("No saved sessions yet"),
      "Expected empty saved-progress route to show recovery guidance.",
    );
    assertPageIncludesRecoveryActions(savedProgressPage.body, "empty saved progress");
  }

  console.log(
    "MVP support and recovery rehearsal passed: public support hub, accessibility signposting, account/dashboard links, and recovery fallbacks all behaved correctly.",
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
