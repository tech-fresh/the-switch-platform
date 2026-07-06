import { appendProgressionEvent } from "@/lib/persistence/progression-event-store";
import {
  readRecallStrengthRecords,
  writeRecallStrengthRecords,
} from "@/lib/persistence/recall-strength-store";
import { createProgressionEvent } from "@/modules/power-grid/progression-events";

import { computeNextReviewAt, computeNextStrength, isTopicDue } from "./decay";
import type {
  RecallReviewOutcome,
  RecallStrengthSnapshot,
  RecallStrengthTopicRecord,
} from "./types";

export async function getRecallStrengthSnapshot(userId: string): Promise<RecallStrengthSnapshot> {
  const topics = (await readRecallStrengthRecords()).filter((record) => record.userId === userId);
  const dueTopics = topics.filter((topic) => isTopicDue(topic.nextReviewAt));
  const weakestTopic = [...topics].sort((left, right) => left.strength - right.strength)[0];
  const nextDueTopic = dueTopics.sort((left, right) => {
    const leftTime = left.nextReviewAt ? new Date(left.nextReviewAt).getTime() : 0;
    const rightTime = right.nextReviewAt ? new Date(right.nextReviewAt).getTime() : 0;
    return leftTime - rightTime;
  })[0];

  return {
    userId,
    generatedAt: new Date().toISOString(),
    dueCount: dueTopics.length,
    topics,
    weakestTopic,
    nextDueTopic,
  };
}

export async function recordReview(
  userId: string,
  input: { topicId: string; subjectId: string; outcome: RecallReviewOutcome },
): Promise<RecallStrengthSnapshot> {
  const records = await readRecallStrengthRecords();
  const now = new Date().toISOString();
  const existing = records.find(
    (record) => record.userId === userId && record.topicId === input.topicId,
  );
  const strength = computeNextStrength(existing?.strength ?? 40, input.outcome);
  const updated: RecallStrengthTopicRecord = {
    userId,
    topicId: input.topicId,
    subjectId: input.subjectId,
    strength,
    lastReviewedAt: now,
    nextReviewAt: computeNextReviewAt(strength, now),
    reviewCount: (existing?.reviewCount ?? 0) + 1,
    updatedAt: now,
  };
  const nextRecords = [
    ...records.filter(
      (record) => !(record.userId === userId && record.topicId === input.topicId),
    ),
    updated,
  ];

  await writeRecallStrengthRecords(nextRecords);
  await appendProgressionEvent(
    createProgressionEvent({
      userId,
      type: "recall-strength.reviewed",
      subjectId: input.subjectId,
      topicId: input.topicId,
      occurredAt: now,
    }),
  );

  return getRecallStrengthSnapshot(userId);
}
