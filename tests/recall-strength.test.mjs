import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("recordReview updates recall strength snapshot and progression trail", async () => {
  const { writeRecallStrengthRecords } = await import(
    "../src/lib/persistence/recall-strength-store.ts"
  );
  const { readProgressionEvents } = await import(
    "../src/lib/persistence/progression-event-store.ts"
  );
  const { recordReview, getRecallStrengthSnapshot } = await import(
    "../src/modules/recall-strength/service.ts"
  );

  const userId = `recall-user-${Date.now()}`;

  const snapshot = await recordReview(userId, {
    topicId: "maths-algebra",
    subjectId: "gcse-maths",
    outcome: "correct",
  });

  assert.equal(snapshot.userId, userId);
  assert.equal(snapshot.dueCount, 0);
  assert.equal(snapshot.topics.length, 1);
  assert.equal(snapshot.topics[0]?.strength, 52);
  assert.equal(snapshot.topics[0]?.reviewCount, 1);

  const refreshed = await getRecallStrengthSnapshot(userId);
  assert.equal(refreshed.weakestTopic?.topicId, "maths-algebra");

  const events = await readProgressionEvents();
  assert.ok(
    events.some(
      (event) =>
        event.userId === userId &&
        event.type === "recall-strength.reviewed" &&
        event.topicId === "maths-algebra"
    )
  );
});

test("quiz submissions update recall strength for the topic", async () => {
  const { readRecallStrengthRecords } = await import(
    "../src/lib/persistence/recall-strength-store.ts"
  );

  const userId = `quiz-recall-user-${Date.now()}`;
  const { submitQuizAnswer } = await import("../src/modules/quiz/service.ts");
  await submitQuizAnswer("maths-algebra", {
    userId,
    selectedOptionId: "b",
  });

  const records = await readRecallStrengthRecords();
  const record = records.find(
    (entry) => entry.userId === userId && entry.topicId === "maths-algebra"
  );

  assert.ok(record);
  assert.equal(record?.subjectId, "gcse-maths");
  assert.equal(record?.reviewCount, 1);
});

test("recall strength routes and ranking hooks are wired", () => {
  const snapshotRouteSource = readRepoFile("src/app/api/recall-strength/snapshot/route.ts");
  const reviewRouteSource = readRepoFile("src/app/api/recall-strength/review/route.ts");
  const recommendationsServiceSource = readRepoFile("src/modules/recommendations/service.ts");
  const journeyServiceSource = readRepoFile("src/modules/journey/service.ts");

  assert.match(snapshotRouteSource, /getRecallStrengthSnapshot/);
  assert.match(reviewRouteSource, /recordReview/);
  assert.match(recommendationsServiceSource, /recallStrengthDue/);
  assert.match(journeyServiceSource, /recallDueHref/);
});
