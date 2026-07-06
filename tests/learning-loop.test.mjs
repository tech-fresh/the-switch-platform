import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  advanceLearningLoopStage,
  getLearningLoopSession,
  syncLearningLoopAfterQuiz,
} from "../src/modules/learning-loop/service.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("learning loop starts at learn stage", async () => {
  const { writeLearningLoopSessions } = await import("../src/lib/persistence/learning-loop-store.ts");
  await writeLearningLoopSessions([]);

  const session = await getLearningLoopSession("learner-loop-test", "topic-alpha");

  assert.equal(session.stage, "learn");
  assert.equal(session.topicId, "topic-alpha");
});

test("learning loop advances through stages", async () => {
  const { writeLearningLoopSessions } = await import("../src/lib/persistence/learning-loop-store.ts");
  await writeLearningLoopSessions([]);

  const userId = `learner-loop-advance-${Date.now()}`;
  const topicId = `topic-${Date.now()}`;

  const first = await advanceLearningLoopStage(userId, topicId, "gcse-maths");
  assert.equal(first.stage, "question");

  const second = await advanceLearningLoopStage(userId, topicId, "gcse-maths");
  assert.equal(second.stage, "feedback");

  const reloaded = await getLearningLoopSession(userId, topicId);
  assert.equal(reloaded.stage, "feedback");
});

test("syncLearningLoopAfterQuiz moves loop to feedback after quiz", async () => {
  const { writeLearningLoopSessions } = await import("../src/lib/persistence/learning-loop-store.ts");
  await writeLearningLoopSessions([]);

  const userId = `learner-loop-quiz-${Date.now()}`;
  const topicId = "maths-algebra";

  const synced = await syncLearningLoopAfterQuiz(userId, topicId, "gcse-maths");
  assert.equal(synced.stage, "feedback");

  const again = await syncLearningLoopAfterQuiz(userId, topicId, "gcse-maths");
  assert.equal(again.stage, "feedback");
});

test("learning loop API, quiz hook, and subject UI are wired", () => {
  const apiSource = readRepoFile("src/app/api/learning-loop/[topicId]/route.ts");
  const quizServiceSource = readRepoFile("src/modules/quiz/service.ts");
  const subjectExperienceSource = readRepoFile("src/app/subjects/subject-experience.tsx");
  const stepRailSource = readRepoFile("src/components/learning-loop/learning-loop-step-rail.tsx");

  assert.match(apiSource, /getLearningLoopSession/);
  assert.match(apiSource, /advanceLearningLoopStage/);
  assert.match(quizServiceSource, /syncLearningLoopAfterQuiz/);
  assert.match(subjectExperienceSource, /LearningLoopStepRail/);
  assert.match(subjectExperienceSource, /\/api\/learning-loop\//);
  assert.match(subjectExperienceSource, /\/api\/journey\/next-action/);
  assert.match(stepRailSource, /Learning loop progress/);
});
