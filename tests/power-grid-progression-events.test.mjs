import test from "node:test";
import assert from "node:assert/strict";

test("quiz submissions append a progression event without changing the quiz result contract", async () => {
  const { readProgressionEvents } = await import(
    "../src/lib/persistence/progression-event-store.ts"
  );

  const userId = `phase4-quiz-user-${Date.now()}`;

  const { submitQuizAnswer } = await import("../src/modules/quiz/service.ts");
  const result = await submitQuizAnswer("maths-algebra", {
    userId,
    selectedOptionId: "b",
  });

  const events = (await readProgressionEvents()).filter((event) => event.userId === userId);
  const quizEvent = events.find((event) => event.type === "quiz.completed");

  assert.equal(result.topicId, "maths-algebra");
  assert.ok(quizEvent, "Expected quiz.completed progression event for submitted answer.");
  assert.equal(quizEvent.userId, userId);
  assert.equal(quizEvent?.type, "quiz.completed");
  assert.equal(quizEvent?.subjectId, "gcse-maths");
  assert.equal(quizEvent?.topicId, "maths-algebra");
});

test("saving and submitting an exam appends progression events", async () => {
  const { readProgressionEvents } = await import(
    "../src/lib/persistence/progression-event-store.ts"
  );
  const userId = `phase4-exam-user-${Date.now()}`;

  const { getMockExamSession, saveMockExamSession, submitMockExamSession } = await import(
    "../src/modules/exam-engine/service.ts"
  );

  const session = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
  });

  await saveMockExamSession("aqa-maths-higher-paper-1", {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[0]?.questionId ?? "",
    questionResponses: session.questionResponses,
    timeRemainingMinutes: session.timeRemainingMinutes - 1,
    userId,
  });

  await submitMockExamSession("aqa-maths-higher-paper-1", {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[0]?.questionId ?? "",
    questionResponses: session.questionResponses,
    timeRemainingMinutes: session.timeRemainingMinutes - 2,
    userId,
  });

  const events = (await readProgressionEvents()).filter((event) => event.userId === userId);

  assert.ok(events.some((event) => event.type === "exam.progress"));
  assert.ok(events.some((event) => event.type === "exam.submitted"));
});

test("saving and submitting a timed assessment appends progression events", async () => {
  const { readProgressionEvents } = await import(
    "../src/lib/persistence/progression-event-store.ts"
  );
  const userId = `phase4-assessment-user-${Date.now()}`;

  const {
    getMockTimedAssessmentAttemptSeed,
    saveMockTimedAssessmentAttempt,
    submitMockTimedAssessmentAttempt,
  } = await import("../src/modules/timed-assessment/service.ts");

  const seed = await getMockTimedAssessmentAttemptSeed("aqa-maths-algebra-checkpoint", {
    userId,
    selectedDurationMinutes: 45,
  });

  await saveMockTimedAssessmentAttempt("aqa-maths-algebra-checkpoint", {
    attemptId: seed.attempt.attemptId,
    currentQuestionId: seed.questions[0]?.questionId,
    selectedDurationMinutes: seed.attempt.selectedDurationMinutes,
    selectedAnswerIds: seed.selectedAnswerIds,
    writtenAnswers: seed.writtenAnswers,
    notes: seed.notes,
    bookmarkedQuestionIds: seed.bookmarkedQuestionIds,
    timeRemainingMinutes: seed.attempt.timeRemainingMinutes - 1,
    userId,
  });

  await submitMockTimedAssessmentAttempt("aqa-maths-algebra-checkpoint", {
    attemptId: seed.attempt.attemptId,
    currentQuestionId: seed.questions[0]?.questionId,
    selectedDurationMinutes: seed.attempt.selectedDurationMinutes,
    selectedAnswerIds: seed.selectedAnswerIds,
    writtenAnswers: seed.writtenAnswers,
    notes: seed.notes,
    bookmarkedQuestionIds: seed.bookmarkedQuestionIds,
    timeRemainingMinutes: seed.attempt.timeRemainingMinutes - 2,
    userId,
  });

  const events = (await readProgressionEvents()).filter((event) => event.userId === userId);

  assert.ok(events.some((event) => event.type === "assessment.progress"));
  assert.ok(events.some((event) => event.type === "assessment.submitted"));
});
