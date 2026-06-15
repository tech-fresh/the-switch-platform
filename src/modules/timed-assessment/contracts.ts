import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "./types";

export type TimedAssessmentContractRoute =
  | "GET /assessments/definitions"
  | "GET /assessments/seed/:assessmentId"
  | "PATCH /assessments/seed/:assessmentId"
  | "POST /assessments/seed/:assessmentId";

export interface GetTimedAssessmentsResponse {
  assessments: TimedAssessmentDefinition[];
}

export interface GetTimedAssessmentSeedResponse {
  seed: TimedAssessmentAttemptSeed;
}

export interface SaveTimedAssessmentAttemptRequest {
  attemptId: string;
  currentQuestionId?: string;
  selectedDurationMinutes: number;
  selectedAnswerIds: string[];
  writtenAnswers: Record<string, string>;
  notes: Record<string, string>;
  bookmarkedQuestionIds: string[];
  timeRemainingMinutes: number;
}

export interface SaveTimedAssessmentAttemptResponse {
  seed: TimedAssessmentAttemptSeed;
}

export type SubmitTimedAssessmentRequest = SaveTimedAssessmentAttemptRequest;

export interface SubmitTimedAssessmentResponse {
  attemptId: string;
  status: "submitted";
}
