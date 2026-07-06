import test from "node:test";
import assert from "node:assert/strict";

test("quiz totals feed into Power Grid readiness, XP, and voltage even without saved sessions", async () => {
  /** @type {import("../src/modules/saved-progress/types.ts").SavedProgressRepository} */
  const savedProgressRepository = {
    async getByEntityId() {
      return null;
    },
    async listByUserId() {
      return [];
    },
    async save(record) {
      return record;
    },
  };

  /** @type {import("../src/modules/quiz/types.ts").QuizProgressRepository} */
  const quizProgressRepository = {
    async getByTopicId(userId, topicId) {
      return (
        quizRecords.find((record) => record.userId === userId && record.topicId === topicId) ?? null
      );
    },
    async listByUserId(userId) {
      return quizRecords.filter((record) => record.userId === userId);
    },
    async save(record) {
      return record;
    },
  };

  const quizRecords = [
    {
      userId: "grid-user",
      topicId: "maths-algebra",
      questionId: "quiz-maths-algebra-1",
      selectedOptionId: "b",
      isCorrect: true,
      attemptsCount: 2,
      correctCount: 1,
      incorrectCount: 1,
      lastAnsweredAt: "2026-07-01T12:00:00.000Z",
    },
    {
      userId: "grid-user",
      topicId: "english-language-analysis",
      questionId: "quiz-english-language-analysis-1",
      selectedOptionId: "b",
      isCorrect: true,
      attemptsCount: 1,
      correctCount: 1,
      incorrectCount: 0,
      lastAnsweredAt: "2026-07-01T12:05:00.000Z",
    },
  ];

  const { getMockPowerGridSummary } = await import("../src/modules/power-grid/service.ts");

  const summary = await getMockPowerGridSummary({
    userId: "grid-user",
    savedProgressRepository,
    quizProgressRepository,
  });

  assert.equal(summary.quizAttemptCount, 3);
  assert.equal(summary.quizCorrectCount, 2);
  assert.equal(summary.quizAccuracyPercentage, 67);
  assert.ok(summary.xpTotal > 0);
  assert.ok(summary.voltagePointsTotal > 0);

  const maths = summary.subjectProgress.find((subject) => subject.subjectId === "gcse-maths");
  assert.ok(maths);
  assert.equal(maths.quizAttemptCount, 2);
  assert.equal(maths.quizCorrectCount, 1);
  assert.equal(maths.quizAccuracyPercentage, 50);
  assert.ok(maths.xpEarned > 0);
  assert.ok(maths.voltagePoints > 0);
});
