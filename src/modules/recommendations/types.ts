export type RecommendationCategory =
  | "revise-next"
  | "timed-practice"
  | "exam-readiness"
  | "access-support";

export interface Recommendation {
  recommendationId: string;
  userId: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  priority: "high" | "medium" | "low";
}
