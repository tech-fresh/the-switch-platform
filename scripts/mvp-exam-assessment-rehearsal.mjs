import { ensureWalkthroughStudentOnboardingComplete, jsonHeaders } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const EXAM_ID = "aqa-maths-higher-paper-1";
const ASSESSMENT_ID = "edexcel-english-writing-craft-checkpoint";
const ASSESSMENT_DURATION = 30;

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "preview-cookie",
  SWITCH_AUTH_SECRET: "mvp-exam-assessment-rehearsal",
});

function studentHeaders(cookie) {
  return jsonHeaders({ cookie });
}

try {
  const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/dashboard");
  const headers = studentHeaders(studentCookie);

  await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, { cookie: studentCookie });

  const examLobby = await fetchText(`${server.baseUrl}/exams`, { headers: { cookie: studentCookie } });
  assert(examLobby.response.ok, `Expected /exams lobby to return 200, received ${examLobby.response.status}.`);
  assert(
    examLobby.body.includes("Full papers") || examLobby.body.includes("Exam Engine"),
    "Expected /exams lobby to render exam lobby copy.",
  );

  const focusedExam = await fetchText(
    `${server.baseUrl}/exams?examId=${EXAM_ID}&questionId=q1-v1`,
    { headers: { cookie: studentCookie } },
  );
  assert(focusedExam.response.ok, `Expected focused exam route to return 200, received ${focusedExam.response.status}.`);
  assert(
    focusedExam.body.includes("Question navigator") ||
      focusedExam.body.includes("Resume full paper practice") ||
      focusedExam.body.includes("Exam focus mode"),
    "Expected focused exam route to render exam-session controls.",
  );

  const examSessionResponse = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, { headers });
  assert(examSessionResponse.response.ok, `Expected exam session API to return 200, received ${examSessionResponse.response.status}.`);

  const examSession = examSessionResponse.json?.session;
  assert(examSession?.examSessionId, "Expected exam session payload.");

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
  assert(examSave.response.ok, `Expected exam autosave to return 200, received ${examSave.response.status}.`);

  const savedProgressAfterSave = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  assert(savedProgressAfterSave.response.ok, "Expected saved-progress overview after exam save.");
  const examSavedSession = savedProgressAfterSave.json?.overview?.sessions?.find(
    (entry) => entry.entityType === "exam-session" && entry.entityId === examSession.examSessionId,
  );
  assert(examSavedSession?.href, "Expected saved exam session to expose a resume href.");

  const examResumePage = await fetchText(`${server.baseUrl}${examSavedSession.href}`, {
    headers: { cookie: studentCookie },
  });
  assert(examResumePage.response.ok, `Expected exam resume href ${examSavedSession.href} to return 200.`);

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
  assert(examSubmit.response.ok, `Expected exam submit to return 200, received ${examSubmit.response.status}.`);
  assert(examSubmit.json?.status === "submitted", "Expected exam submit status to be submitted.");

  const savedProgressAfterExamSubmit = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const submittedExamSession = savedProgressAfterExamSubmit.json?.overview?.sessions?.find(
    (entry) => entry.entityId === examSession.examSessionId,
  );
  assert(
    submittedExamSession?.status === "submitted",
    "Expected submitted exam in saved progress.",
  );

  const resultsAfterExam = await fetchJson(`${server.baseUrl}/api/results/overview`, { headers });
  assert(resultsAfterExam.response.ok, "Expected results overview after exam submit.");

  const assessmentLobby = await fetchText(`${server.baseUrl}/assessments`, { headers: { cookie: studentCookie } });
  assert(assessmentLobby.response.ok, `Expected /assessments to return 200, received ${assessmentLobby.response.status}.`);
  assert(
    assessmentLobby.body.includes("Timed checkpoint") || assessmentLobby.body.includes("Timed assessment"),
    "Expected assessments lobby copy.",
  );

  const focusedAssessment = await fetchText(
    `${server.baseUrl}/assessments?assessmentId=${ASSESSMENT_ID}&durationMinutes=${ASSESSMENT_DURATION}&questionId=q4`,
    { headers: { cookie: studentCookie } },
  );
  assert(
    focusedAssessment.response.ok,
    `Expected focused assessment route to return 200, received ${focusedAssessment.response.status}.`,
  );
  assert(
    focusedAssessment.body.includes("Checkpoint") ||
      focusedAssessment.body.includes("Question navigator") ||
      focusedAssessment.body.includes("Timed assessment"),
    "Expected focused assessment route to render practice controls.",
  );

  const assessmentSeedResponse = await fetchJson(
    `${server.baseUrl}/api/assessments/seed/${ASSESSMENT_ID}?durationMinutes=${ASSESSMENT_DURATION}`,
    { headers },
  );
  assert(assessmentSeedResponse.response.ok, `Expected assessment seed API to return 200, received ${assessmentSeedResponse.response.status}.`);

  const assessmentSeed = assessmentSeedResponse.json?.seed;
  assert(assessmentSeed?.attempt?.attemptId, "Expected assessment seed payload.");

  const assessmentSave = await fetchJson(`${server.baseUrl}/api/assessments/seed/${ASSESSMENT_ID}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      attemptId: assessmentSeed.attempt.attemptId,
      currentQuestionId: assessmentSeed.currentQuestionId,
      selectedDurationMinutes: ASSESSMENT_DURATION,
      selectedAnswerIds: assessmentSeed.selectedAnswerIds,
      writtenAnswers: assessmentSeed.writtenAnswers,
      notes: assessmentSeed.notes,
      bookmarkedQuestionIds: assessmentSeed.bookmarkedQuestionIds,
      timeRemainingMinutes: 28,
    }),
  });
  assert(assessmentSave.response.ok, `Expected assessment autosave to return 200, received ${assessmentSave.response.status}.`);

  const savedProgressAfterAssessmentSave = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const assessmentSavedSession = savedProgressAfterAssessmentSave.json?.overview?.sessions?.find(
    (entry) =>
      entry.entityType === "timed-assessment-attempt" && entry.entityId === assessmentSeed.attempt.attemptId,
  );
  assert(assessmentSavedSession?.href, "Expected saved assessment session to expose a resume href.");

  const assessmentResumePage = await fetchText(`${server.baseUrl}${assessmentSavedSession.href}`, {
    headers: { cookie: studentCookie },
  });
  assert(
    assessmentResumePage.response.ok,
    `Expected assessment resume href ${assessmentSavedSession.href} to return 200.`,
  );

  const assessmentSubmit = await fetchJson(`${server.baseUrl}/api/assessments/seed/${ASSESSMENT_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      attemptId: assessmentSeed.attempt.attemptId,
      currentQuestionId: assessmentSeed.currentQuestionId,
      selectedDurationMinutes: ASSESSMENT_DURATION,
      selectedAnswerIds: assessmentSeed.selectedAnswerIds,
      writtenAnswers: assessmentSeed.writtenAnswers,
      notes: assessmentSeed.notes,
      bookmarkedQuestionIds: assessmentSeed.bookmarkedQuestionIds,
      timeRemainingMinutes: 25,
    }),
  });
  assert(
    assessmentSubmit.response.ok,
    `Expected assessment submit to return 200, received ${assessmentSubmit.response.status}.`,
  );
  assert(
    assessmentSubmit.json?.status === "submitted",
    "Expected assessment submit status to be submitted.",
  );

  const savedProgressAfterAssessmentSubmit = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, { headers });
  const submittedAssessmentSession = savedProgressAfterAssessmentSubmit.json?.overview?.sessions?.find(
    (entry) => entry.entityId === assessmentSeed.attempt.attemptId,
  );
  assert(
    submittedAssessmentSession?.status === "submitted",
    "Expected submitted assessment in saved progress.",
  );

  const resultsAfterAssessment = await fetchJson(`${server.baseUrl}/api/results/overview`, { headers });
  assert(resultsAfterAssessment.response.ok, "Expected results overview after assessment submit.");

  const invalidExamRecovery = await fetchText(
    `${server.baseUrl}/exams?examId=not-a-real-paper&questionId=q1-v1`,
    { headers: { cookie: studentCookie } },
  );
  assert(invalidExamRecovery.response.ok, "Expected invalid exam recovery page to return 200.");
  assert(
    invalidExamRecovery.body.includes("Exam recovery") || invalidExamRecovery.body.includes("incomplete"),
    "Expected invalid exam route to show recovery guidance.",
  );

  const invalidAssessmentRecovery = await fetchText(
    `${server.baseUrl}/assessments?assessmentId=not-a-real-checkpoint`,
    { headers: { cookie: studentCookie } },
  );
  assert(invalidAssessmentRecovery.response.ok, "Expected invalid assessment recovery page to return 200.");
  assert(
    invalidAssessmentRecovery.body.includes("Timed practice recovery") ||
      invalidAssessmentRecovery.body.includes("unavailable"),
    "Expected invalid assessment route to show recovery guidance.",
  );

  console.log(
    "MVP exam and assessment rehearsal passed: lobby, focus entry, autosave, resume links, submit, and recovery copy all behaved correctly.",
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
