import type { RecallReviewOutcome, RecallStrengthSnapshot } from "./types";

export interface RecallStrengthSnapshotApiResponse {
  snapshot: RecallStrengthSnapshot;
}

export interface RecallStrengthReviewRequest {
  topicId: string;
  subjectId: string;
  outcome: RecallReviewOutcome;
}

export interface RecallStrengthReviewApiResponse {
  snapshot: RecallStrengthSnapshot;
}
