import type { Recommendation, RecommendationsPageData } from "./types";

export type RecommendationsContractRoute =
  | "GET /recommendations"
  | "GET /recommendations/ranked"
  | "GET /recommendations/page";

export interface GetStudentRecommendationsResponse {
  recommendations: Recommendation[];
}

export interface GetRankedRecommendationsResponse {
  recommendations: Recommendation[];
  topPick: Recommendation | null;
}

export interface GetRecommendationsPageResponse {
  recommendationsPage: RecommendationsPageData;
}
