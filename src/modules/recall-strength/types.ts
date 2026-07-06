export interface RecallStrengthTopicRecord {
  userId: string;
  topicId: string;
  subjectId: string;
  strength: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  reviewCount: number;
  updatedAt: string;
}

export interface RecallStrengthSnapshot {
  userId: string;
  generatedAt: string;
  dueCount: number;
  topics: RecallStrengthTopicRecord[];
  weakestTopic?: RecallStrengthTopicRecord;
  nextDueTopic?: RecallStrengthTopicRecord;
}

export type RecallReviewOutcome = "correct" | "partial" | "incorrect";
