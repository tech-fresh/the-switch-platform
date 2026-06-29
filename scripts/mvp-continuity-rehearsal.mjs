import { assertAllowedMvpClickTarget } from "./canonical-mvp-routes.mjs";
import { ensureWalkthroughStudentOnboardingComplete, jsonHeaders } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const EXAM_ID = "aqa-maths-higher-paper-1";

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
  SWITCH_AUTH_SECRET: "mvp-continuity-rehearsal",
});

function studentHeaders(cookie) {
  return jsonHeaders({ cookie });
}

function continuityFromDashboard(payload) {
  const dashboard = payload.dashboard;

  return {
    status: dashboard.continuityStatus,
    href: dashboard.continuityHref,
    actionLabel: dashboard.continuityActionLabel,
    description: dashboard.continuityDescription,
  };
}

function continuityFromResults(payload) {
  return {
    status: payload.results.continuityStatus,
    href: payload.results.continuityHref,
    actionLabel: payload.results.continuityActionLabel,
    description: payload.results.continuityDescription,
  };
}

function continuityFromSavedProgress(payload) {
  const continuity = payload.overview.continuity;

  return {
    status: continuity.status,
    href: continuity.primaryAction.href,
    actionLabel: continuity.primaryAction.actionLabel,
    description: continuity.primaryAction.description,
  };
}

function assertContinuityAligned(label, left, right) {
  assert(left.status === right.status, `${label}: continuity status should match (${left.status} vs ${right.status}).`);
  assert(left.href === right.href, `${label}: continuity href should match (${left.href} vs ${right.href}).`);
  assert(
    left.actionLabel === right.actionLabel,
    `${label}: continuity action label should match.`,
  );
}

try {
  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  const headers = studentHeaders(studentCookie);

  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, { cookie: studentCookie });

  const [dashboardApi, resultsApi, savedProgressApi] = await Promise.all([
    fetchJson(`${server.baseUrl}/api/dashboard/home`, { headers }),
    fetchJson(`${server.baseUrl}/api/results/overview`, { headers }),
    fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers }),
  ]);

  assert(dashboardApi.response.ok, "Expected dashboard home API to return 200.");
  assert(resultsApi.response.ok, "Expected results overview API to return 200.");
  assert(savedProgressApi.response.ok, "Expected saved-progress overview API to return 200.");

  const dashboardContinuity = continuityFromDashboard(dashboardApi.json);
  const resultsContinuity = continuityFromResults(resultsApi.json);
  const savedProgressContinuity = continuityFromSavedProgress(savedProgressApi.json);

  assertContinuityAligned("dashboard vs saved-progress", dashboardContinuity, savedProgressContinuity);
  assertContinuityAligned("results vs saved-progress", resultsContinuity, savedProgressContinuity);
  assertAllowedMvpClickTarget(dashboardContinuity.href, "dashboard continuity href");

  const sessions = savedProgressApi.json?.overview?.sessions ?? [];
  assert(sessions.length > 0, "Expected saved-progress sessions for continuity rehearsal.");

  for (const session of sessions) {
    assertAllowedMvpClickTarget(session.href, `saved-progress session "${session.title}"`);

    const page = await fetchText(`${server.baseUrl}${session.href}`, {
      headers: { cookie: studentCookie },
    });
    assert(page.response.ok, `Expected continuity href ${session.href} to return 200.`);

    if (session.status === "submitted") {
      assert(session.href === "/results", `Submitted session "${session.title}" should route to /results.`);
    }
  }

  const [dashboardPage, savedProgressPage, resultsPage] = await Promise.all([
    fetchText(`${server.baseUrl}/dashboard`, { headers: { cookie: studentCookie } }),
    fetchText(`${server.baseUrl}/saved-progress`, { headers: { cookie: studentCookie } }),
    fetchText(`${server.baseUrl}/results`, { headers: { cookie: studentCookie } }),
  ]);

  for (const [label, page] of [
    ["dashboard", dashboardPage],
    ["saved-progress", savedProgressPage],
    ["results", resultsPage],
  ]) {
    assert(page.response.ok, `Expected /${label} route to return 200.`);
    assert(
      page.body.includes(dashboardContinuity.actionLabel) ||
        page.body.includes("Continuity") ||
        page.body.includes("Resume") ||
        page.body.includes("saved"),
      `Expected /${label} to surface continuity guidance.`,
    );
  }

  const examSessionResponse = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, { headers });
  assert(examSessionResponse.response.ok, "Expected exam session API to return 200.");

  let examSession = examSessionResponse.json?.session;
  assert(examSession?.examSessionId, "Expected exam session payload.");

  if (examSession.status === "submitted") {
    const freshExamSessionResponse = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
      method: "PUT",
      headers,
    });
    assert(freshExamSessionResponse.response.ok, "Expected fresh exam session API to return 200.");
    examSession = freshExamSessionResponse.json?.session;
    assert(examSession?.examSessionId, "Expected fresh exam session payload.");
    assert(examSession.status !== "submitted", "Expected fresh exam session to be active.");
  }

  const answeredResponses = examSession.questionResponses.map((response, index) =>
    index === 0
      ? { ...response, status: "answered", selectedOptionId: response.selectedOptionId ?? "a" }
      : response,
  );

  const examSave = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      examSessionId: examSession.examSessionId,
      currentQuestionId: examSession.questions[0].questionId,
      questionResponses: answeredResponses,
      timeRemainingMinutes: 42,
    }),
  });
  assert(examSave.response.ok, "Expected exam autosave during continuity rehearsal.");

  const savedProgressAfterSave = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const activeExamSession = savedProgressAfterSave.json?.overview?.sessions?.find(
    (entry) => entry.entityType === "exam-session" && entry.entityId === examSession.examSessionId,
  );
  assert(activeExamSession?.status !== "submitted", "Expected active exam session before submit.");
  assert(/^\/exams\?/.test(activeExamSession.href), "Expected active exam continuity href to resume through /exams.");
  assert(
    savedProgressAfterSave.json?.overview?.continuity?.status === "resume-active-session",
    "Expected continuity to prioritize an active resume path after autosave.",
  );

  const examSubmit = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      examSessionId: examSession.examSessionId,
      currentQuestionId: examSession.questions[0].questionId,
      questionResponses: answeredResponses,
      timeRemainingMinutes: 40,
    }),
  });
  assert(examSubmit.response.ok, "Expected exam submit during continuity rehearsal.");
  assert(examSubmit.json?.status === "submitted", "Expected submitted exam session.");

  const savedProgressAfterSubmit = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const submittedExamSession = savedProgressAfterSubmit.json?.overview?.sessions?.find(
    (entry) => entry.entityId === examSession.examSessionId,
  );
  assert(submittedExamSession?.status === "submitted", "Expected submitted exam in saved progress.");
  assert(submittedExamSession?.href === "/results", "Submitted exam continuity should route to /results.");

  const staleAutosave = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      examSessionId: examSession.examSessionId,
      currentQuestionId: examSession.questions[0].questionId,
      questionResponses: answeredResponses.map((response, index) =>
        index === 1 ? { ...response, selectedOptionId: "c" } : response,
      ),
      timeRemainingMinutes: 35,
    }),
  });
  assert(staleAutosave.response.ok, "Expected stale autosave attempt to stay non-fatal.");

  const savedProgressAfterStaleSave = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const lockedSubmittedSession = savedProgressAfterStaleSave.json?.overview?.sessions?.find(
    (entry) => entry.entityId === examSession.examSessionId,
  );
  assert(
    lockedSubmittedSession?.status === "submitted",
    "Submitted continuity should stay locked after a stale autosave attempt.",
  );
  assert(lockedSubmittedSession?.href === "/results", "Submitted continuity href should remain /results.");

  const resultsAfterSubmit = await fetchJson(`${server.baseUrl}/api/results/overview`, { headers });
  const submittedResult = resultsAfterSubmit.json?.results?.examResults?.find((result) =>
    result.resultId.includes(examSession.examSessionId),
  );
  assert(submittedResult?.status === "submitted", "Expected submitted exam result summary.");
  assert(submittedResult?.href === "/results", "Submitted result card should route to /results.");

  const alignedDashboard = await fetchJson(`${server.baseUrl}/api/dashboard/home`, { headers });
  const alignedSavedProgress = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  assertContinuityAligned(
    "dashboard vs saved-progress after submit",
    continuityFromDashboard(alignedDashboard.json),
    continuityFromSavedProgress(alignedSavedProgress.json),
  );

  console.log(
    "MVP continuity rehearsal passed: dashboard, saved-progress, and results continuity aligned; resume and review hrefs stayed valid; submitted sessions locked to /results.",
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
