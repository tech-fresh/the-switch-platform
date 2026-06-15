import type { Recommendation, RecommendationsPageData } from "./types";

export type RecommendationsContractRoute =
  | "GET /recommendations"
  | "GET /recommendations/page";

export interface GetStudentRecommendationsResponse {
  recommendations: Recommendation[];
}

export interface GetRecommendationsPageResponse {
  recommendationsPage: RecommendationsPageData;
}
