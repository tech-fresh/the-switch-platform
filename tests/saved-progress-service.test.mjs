import test from "node:test";
import assert from "node:assert/strict";

test("saveExamProgress keeps continuity data normalized across repeated writes", async () => {
  const {
    buildExamSavedProgressRecord,
  } = await import("../src/modules/saved-progress/rules.ts");
  const questionSet = [{ questionId: "q1" }, { questionId: "q2" }];

  const initial = buildExamSavedProgressRecord({
    input: {
      userId: "learner-1",
      examSessionId: "exam-1",
      currentQuestionId: "q2",
      questionSet,
      questionResponses: [
        { questionId: "q1", status: "answered", selectedOptionId: "a", flagged: false },
        { questionId: "q2", status: "not-started", flagged: true },
      ],
      timeRemainingMinutes: 18,
      status: "in-progress",
    },
    now: "2026-06-14T10:00:00.000Z",
  });

  const updated = buildExamSavedProgressRecord({
    input: {
      userId: "learner-1",
      examSessionId: "exam-1",
      currentQuestionId: "missing",
      questionSet: [],
      questionResponses: [],
      timeRemainingMinutes: -5,
      status: "paused",
    },
    existing: initial,
    now: "2026-06-14T10:05:00.000Z",
  });

  assert.equal(updated.status, "paused");
  assert.equal(updated.examProgress.currentQuestionId, "q2");
  assert.equal(updated.examProgress.timeRemainingMinutes, 0);
  assert.deepEqual(updated.examProgress.flaggedQuestionIds, ["q2"]);
  assert.equal(updated.examProgress.questionResponses.length, 2);
  assert.equal(updated.examProgress.questionResponses[0]?.selectedOptionId, "a");
});

test("saveTimedAssessmentProgress filters stale question data and submitted state stays locked", async () => {
  const {
    applySavedProgressStatusUpdate,
    buildTimedAssessmentSavedProgressRecord,
  } = await import("../src/modules/saved-progress/rules.ts");
  const { canTransitionSavedProgressStatus } = await import("../src/modules/saved-progress/rules.ts");
  const questionSet = [{ questionId: "q1" }, { questionId: "q2" }];

  const saved = buildTimedAssessmentSavedProgressRecord({
    input: {
      userId: "learner-2",
      assessmentAttemptId: "attempt-1",
      currentQuestionId: "missing",
      selectedDurationMinutes: -10,
      questionSet,
      selectedAnswerIds: ["q1:a", "q1:a", "q3:z"],
      writtenAnswers: { q1: "kept", q3: "drop" },
      notes: { q2: "keep note", q9: "drop note" },
      bookmarkedQuestionIds: ["q2", "q2", "q7"],
      timeRemainingMinutes: -1,
      status: "submitted",
    },
    now: "2026-06-14T11:00:00.000Z",
  });

  assert.equal(saved.timedAssessmentProgress.currentQuestionId, "q1");
  assert.equal(saved.timedAssessmentProgress.selectedDurationMinutes, 0);
  assert.equal(saved.timedAssessmentProgress.timeRemainingMinutes, 0);
  assert.deepEqual(saved.timedAssessmentProgress.selectedAnswerIds, ["q1:a"]);
  assert.deepEqual(saved.timedAssessmentProgress.bookmarkedQuestionIds, ["q2"]);
  assert.deepEqual(saved.timedAssessmentProgress.writtenAnswers, { q1: "kept" });
  assert.deepEqual(saved.timedAssessmentProgress.notes, { q2: "keep note" });

  assert.equal(canTransitionSavedProgressStatus("submitted", "paused"), false);
  const afterStatusRefresh = applySavedProgressStatusUpdate({
    existing: saved,
    nextStatus: "submitted",
    now: "2026-06-14T11:05:00.000Z",
  });
  assert.equal(afterStatusRefresh.status, "submitted");
  assert.equal(afterStatusRefresh.lastActivityAt, "2026-06-14T11:05:00.000Z");
});
