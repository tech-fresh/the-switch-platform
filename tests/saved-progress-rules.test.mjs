import test from "node:test";
import assert from "node:assert/strict";

test("saved-progress status transitions protect submitted records from rollback", async () => {
  const {
    canTransitionSavedProgressStatus,
    getNextSavedProgressStatus,
  } = await import("../src/modules/saved-progress/rules.ts");

  assert.equal(canTransitionSavedProgressStatus("in-progress", "paused"), true);
  assert.equal(canTransitionSavedProgressStatus("paused", "submitted"), false);
  assert.equal(canTransitionSavedProgressStatus("submitted", "paused"), false);
  assert.equal(getNextSavedProgressStatus("submitted", "in-progress"), "submitted");
  assert.equal(getNextSavedProgressStatus(undefined, undefined), "in-progress");
});

test("exam normalization preserves valid responses and picks the next safe question", async () => {
  const {
    buildNormalizedExamResponses,
    getSafeCurrentQuestionId,
  } = await import("../src/modules/saved-progress/rules.ts");

  const questionSet = [{ questionId: "q1" }, { questionId: "q2" }, { questionId: "q3" }];
  const normalized = buildNormalizedExamResponses(
    questionSet,
    [{ questionId: "q2", status: "not-started", selectedOptionId: "b", flagged: true }],
    [{ questionId: "q1", status: "answered", selectedOptionId: "a", flagged: false }],
  );

  assert.deepEqual(
    normalized.map((response) => ({
      questionId: response.questionId,
      status: response.status,
      selectedOptionId: response.selectedOptionId,
      flagged: response.flagged,
    })),
    [
      { questionId: "q1", status: "answered", selectedOptionId: "a", flagged: false },
      { questionId: "q2", status: "answered", selectedOptionId: "b", flagged: true },
      { questionId: "q3", status: "not-started", selectedOptionId: undefined, flagged: false },
    ],
  );

  assert.equal(getSafeCurrentQuestionId("missing", questionSet, normalized), "q2");
});

test("timed-assessment normalization removes stale answers and falls back to a valid question", async () => {
  const {
    filterRecordByQuestionIds,
    getSafeOptionalCurrentQuestionId,
    unique,
  } = await import("../src/modules/saved-progress/rules.ts");

  const questionSet = [{ questionId: "q1" }, { questionId: "q2" }];
  const validQuestionIds = new Set(questionSet.map((question) => question.questionId));

  assert.deepEqual(
    filterRecordByQuestionIds({ q1: "kept", q3: "drop" }, validQuestionIds),
    { q1: "kept" },
  );
  assert.deepEqual(unique(["q1", "q2", "q1"]), ["q1", "q2"]);
  assert.equal(getSafeOptionalCurrentQuestionId("missing", questionSet, "q2"), "q2");
});
