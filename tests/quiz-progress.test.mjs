import test from "node:test";
import assert from "node:assert/strict";

test("submitQuizAnswer returns right or wrong feedback with explanation and running totals", async () => {
  /** @type {import("../src/modules/quiz/types.ts").QuizProgressRecord[]} */
  const records = [];
  /** @type {import("../src/modules/quiz/types.ts").QuizProgressRepository} */
  const repository = {
    async getByTopicId(userId, topicId) {
      return records.find((record) => record.userId === userId && record.topicId === topicId) ?? null;
    },
    async listByUserId(userId) {
      return records.filter((record) => record.userId === userId);
    },
    async save(record) {
      const index = records.findIndex(
        (existing) => existing.userId === record.userId && existing.topicId === record.topicId,
      );

      if (index >= 0) {
        records.splice(index, 1, record);
      } else {
        records.push(record);
      }

      return record;
    },
  };

  const { submitQuizAnswer } = await import("../src/modules/quiz/service.ts");

  const wrong = await submitQuizAnswer(
    "maths-algebra",
    {
      userId: "quiz-user",
      selectedOptionId: "a",
    },
    repository,
  );

  assert.equal(wrong.isCorrect, false);
  assert.equal(wrong.correctOptionId, "b");
  assert.match(wrong.explanation, /expand/i);
  assert.equal(wrong.attemptsCount, 1);
  assert.equal(wrong.correctCount, 0);
  assert.equal(wrong.incorrectCount, 1);
  assert.equal(wrong.accuracyPercentage, 0);

  const right = await submitQuizAnswer(
    "maths-algebra",
    {
      userId: "quiz-user",
      selectedOptionId: "b",
    },
    repository,
  );

  assert.equal(right.isCorrect, true);
  assert.equal(right.attemptsCount, 2);
  assert.equal(right.correctCount, 1);
  assert.equal(right.incorrectCount, 1);
  assert.equal(right.accuracyPercentage, 50);
});
