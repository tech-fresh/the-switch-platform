import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "./types";

export type TimedAssessmentContractRoute =
  | "GET /assessments/definitions"
  | "GET /assessments/seed/:assessmentId"
  | "POST /assessments/seed/:assessmentId";

export interface GetTimedAssessmentsResponse {
  assessments: TimedAssessmentDefinition[];
}

export interface GetTimedAssessmentSeedResponse {
  seed: TimedAssessmentAttemptSeed;
}

export interface SubmitTimedAssessmentResponse {
  attemptId: string;
  status: "submitted";
}
