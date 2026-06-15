import type {
  ExamSupportGuide,
  SupportHubData,
  SupportResource,
  SupportRouteGuidance,
  SupportSafetyReview,
  UrgentHelpOption,
} from "./types";

export type SupportContractRoute =
  | "GET /support/hub"
  | "GET /support/resources"
  | "GET /support/exam-guides"
  | "GET /support/urgent-help";

export interface GetSupportHubResponse {
  support: SupportHubData;
}

export interface GetSupportResourcesResponse {
  resources: SupportResource[];
}

export interface GetExamSupportGuidesResponse {
  guides: ExamSupportGuide[];
}

export interface GetUrgentHelpResponse {
  urgentHelp: UrgentHelpOption[];
}

export interface GetSupportSafetyReviewResponse {
  safetyReview: SupportSafetyReview;
  routeGuidance: SupportRouteGuidance[];
}
