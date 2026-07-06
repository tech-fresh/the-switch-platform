import {
  readLearningLoopSessions,
  writeLearningLoopSessions,
} from "@/lib/persistence/learning-loop-store";

import type { LearningLoopSession, LearningLoopStage } from "./types";
import { getLearningLoopStageLabel } from "./vocabulary";

export { getLearningLoopStageLabel } from "./vocabulary";

const STAGE_ORDER: LearningLoopStage[] = [
  "learn",
  "question",
  "feedback",
  "progress",
  "next",
  "complete",
];

export async function getLearningLoopSession(
  userId: string,
  topicId: string,
): Promise<LearningLoopSession> {
  const existing = (await readLearningLoopSessions()).find(
    (session) => session.userId === userId && session.topicId === topicId,
  );

  if (existing) {
    return existing;
  }

  return {
    userId,
    topicId,
    subjectId: "",
    stage: "learn",
    updatedAt: new Date().toISOString(),
  };
}

export async function advanceLearningLoopStage(
  userId: string,
  topicId: string,
  subjectId: string,
): Promise<LearningLoopSession> {
  const current = await getLearningLoopSession(userId, topicId);
  const index = STAGE_ORDER.indexOf(current.stage);
  const nextStage = STAGE_ORDER[Math.min(index + 1, STAGE_ORDER.length - 1)];

  return saveLearningLoopSession(userId, topicId, subjectId, nextStage);
}

export async function saveLearningLoopSession(
  userId: string,
  topicId: string,
  subjectId: string,
  stage: LearningLoopStage,
): Promise<LearningLoopSession> {
  const updated: LearningLoopSession = {
    userId,
    topicId,
    subjectId,
    stage,
    updatedAt: new Date().toISOString(),
  };
  const records = (await readLearningLoopSessions()).filter(
    (session) => !(session.userId === userId && session.topicId === topicId),
  );

  await writeLearningLoopSessions([...records, updated]);

  return updated;
}

/** After a quiz attempt, ensure the loop is at least at feedback. */
export async function syncLearningLoopAfterQuiz(
  userId: string,
  topicId: string,
  subjectId: string,
): Promise<LearningLoopSession> {
  const current = await getLearningLoopSession(userId, topicId);
  const feedbackIndex = STAGE_ORDER.indexOf("feedback");
  const currentIndex = STAGE_ORDER.indexOf(current.stage);

  if (currentIndex >= feedbackIndex) {
    return current;
  }

  return saveLearningLoopSession(userId, topicId, subjectId, "feedback");
}
