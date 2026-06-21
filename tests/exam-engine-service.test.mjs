import test from "node:test";
import assert from "node:assert/strict";

function createInMemorySavedProgressRepository() {
  /** @type {import("../src/modules/saved-progress/types.ts").SavedProgressRecord[]} */
  const records = [];

  return {
    async getByEntityId(userId, entityType, entityId) {
      return (
        records.find(
          (record) =>
            record.userId === userId &&
            record.entityType === entityType &&
            record.entityId === entityId,
        ) ?? null
      );
    },
    async listByUserId(userId) {
      return records
        .filter((record) => record.userId === userId)
        .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
    },
    async save(record) {
      const index = records.findIndex(
        (existing) =>
          existing.userId === record.userId &&
          existing.entityType === record.entityType &&
          existing.entityId === record.entityId,
      );

      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }

      return record;
    },
  };
}

test("getMockExamPapers returns seeded papers with question lists", async () => {
  const { getMockExamPapers } = await import("../src/modules/exam-engine/service.ts");

  const papers = getMockExamPapers();

  assert.ok(papers.length >= 6);
  assert.ok(papers.some((paper) => paper.examId === "aqa-maths-higher-paper-1"));
  assert.ok(papers.every((paper) => paper.questions.length > 0));
  assert.equal(papers[0]?.questions[0]?.type, "multiple-choice");
});

test("getMockExamSession creates the first attempt and persists a saved snapshot", async () => {
  const { getMockExamSession } = await import("../src/modules/exam-engine/service.ts");
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-first-attempt";

  const session = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  assert.equal(session.attemptNumber, 1);
  assert.equal(session.status, "in-progress");
  assert.equal(session.examSessionId, "aqa-maths-higher-paper-1-session-001");
  assert.equal(session.questions.length, session.questionResponses.length);
  assert.equal(session.generationSummary.strategy, "topic-repeat-question-rotate");

  const saved = await repository.getByEntityId(userId, "exam-session", session.examSessionId);
  assert.ok(saved);
  assert.equal(saved.status, "in-progress");
  assert.deepEqual(
    saved.examProgress?.questionSet?.map((question) => question.questionId),
    session.questions.map((question) => question.questionId),
  );
});

test("getMockExamSession restores the exact saved question set on resume", async () => {
  const { getMockExamSession } = await import("../src/modules/exam-engine/service.ts");
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-resume";

  const firstLoad = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });
  const originalQuestionIds = firstLoad.questions.map((question) => question.questionId);

  const resumed = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  assert.equal(resumed.examSessionId, firstLoad.examSessionId);
  assert.deepEqual(
    resumed.questions.map((question) => question.questionId),
    originalQuestionIds,
  );
});

test("startFreshAttempt rotates question variants away from the latest attempt", async () => {
  const { getMockExamSession } = await import("../src/modules/exam-engine/service.ts");
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-variant-rotate";

  const firstAttempt = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });
  const firstKeys = firstAttempt.questions.map(
    (question) => question.sourceQuestionKey ?? question.questionId,
  );

  await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    startFreshAttempt: true,
    savedProgressRepository: repository,
  });

  const secondAttempt = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  assert.equal(secondAttempt.attemptNumber, 2);
  assert.equal(secondAttempt.examSessionId, "aqa-maths-higher-paper-1-session-002");

  const secondKeys = secondAttempt.questions.map(
    (question) => question.sourceQuestionKey ?? question.questionId,
  );

  assert.notDeepEqual(secondKeys, firstKeys);
  assert.ok(
    secondKeys.some((key) => !firstKeys.includes(key)),
    "expected at least one rotated variant",
  );
});

test("saveMockExamSession updates time remaining and keeps the active session id", async () => {
  const { getMockExamSession, saveMockExamSession } = await import(
    "../src/modules/exam-engine/service.ts"
  );
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-save";

  const session = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  const saved = await saveMockExamSession("aqa-maths-higher-paper-1", {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[1].questionId,
    questionResponses: session.questionResponses.map((response, index) =>
      index === 0
        ? { ...response, status: "answered", selectedOptionId: "a" }
        : response,
    ),
    timeRemainingMinutes: 42,
    userId,
    savedProgressRepository: repository,
  });

  assert.equal(saved.timeRemainingMinutes, 42);
  assert.equal(saved.questionResponses[0]?.status, "answered");
  assert.equal(saved.examSessionId, session.examSessionId);
});

test("saveMockExamSession rejects a mismatched session id", async () => {
  const { getMockExamSession, saveMockExamSession } = await import(
    "../src/modules/exam-engine/service.ts"
  );
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-mismatch";

  const session = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  await assert.rejects(
    () =>
      saveMockExamSession("aqa-maths-higher-paper-1", {
        examSessionId: "wrong-session-id",
        currentQuestionId: session.questions[0].questionId,
        questionResponses: session.questionResponses,
        timeRemainingMinutes: 30,
        userId,
        savedProgressRepository: repository,
      }),
    /Exam session mismatch while saving progress/,
  );
});

test("submitMockExamSession marks the attempt submitted and keeps the final snapshot", async () => {
  const { getMockExamSession, submitMockExamSession } = await import(
    "../src/modules/exam-engine/service.ts"
  );
  const repository = createInMemorySavedProgressRepository();
  const userId = "exam-test-submit";

  const session = await getMockExamSession("aqa-maths-higher-paper-1", {
    userId,
    savedProgressRepository: repository,
  });

  const submitted = await submitMockExamSession("aqa-maths-higher-paper-1", {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[0].questionId,
    questionResponses: session.questionResponses.map((response, index) =>
      index === 0
        ? { ...response, status: "answered", selectedOptionId: response.selectedOptionId ?? "a" }
        : response,
    ),
    timeRemainingMinutes: 25,
    userId,
    savedProgressRepository: repository,
  });

  assert.equal(submitted.status, "submitted");

  const saved = await repository.getByEntityId(userId, "exam-session", session.examSessionId);
  assert.equal(saved?.status, "submitted");
  assert.equal(saved?.examProgress?.timeRemainingMinutes, 25);
});

test("getMockExamSession rejects unknown exam ids", async () => {
  const { getMockExamSession } = await import("../src/modules/exam-engine/service.ts");

  await assert.rejects(
    () => getMockExamSession("missing-exam-id"),
    /Unknown mock exam paper: missing-exam-id/,
  );
});
