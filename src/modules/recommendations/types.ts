export type RecommendationCategory =
  | "revise-next"
  | "timed-practice"
  | "exam-readiness"
  | "access-support"
  | "resume-saved"
  | "review-results";

export interface Recommendation {
  recommendationId: string;
  userId: string;
  category: RecommendationCategory;
  eyebrow?: string;
  title: string;
  description: string;
  supportSummary?: string;
  supportPreferenceChips?: string[];
  actionLabel: string;
  href: string;
  priority: "high" | "medium" | "low";
}

export interface RecommendationInsight {
  label: string;
  value: string;
  detail: string;
  supportSummary?: string;
}

export interface RecommendationsPageData {
  title: string;
  description: string;
  nextBestAction: string;
  routeSummary: string;
  insights: RecommendationInsight[];
  recommendations: Recommendation[];
}
