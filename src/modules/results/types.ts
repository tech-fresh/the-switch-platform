export type ResultTrend = "improving" | "stable" | "needs-attention";

export interface SessionResultSummary {
  resultId: string;
  kind: "exam" | "assessment";
  title: string;
  subtitle: string;
  status: "submitted" | "in-progress";
  href: string;
  actionLabel: string;
  scorePercentage: number;
  answeredCount: number;
  totalCount: number;
  flaggedCount: number;
  reviewLabel: string;
  trend: ResultTrend;
  strengths: string[];
  supportSummary: string;
  supportPreferenceChips: string[];
  nextStep: string;
}

export interface ResultsOverview {
  overallScorePercentage: number;
  overallTrend: ResultTrend;
  completedCount: number;
  submittedCount: number;
  readyForReviewCount: number;
  averageExamScore: number;
  averageAssessmentScore: number;
  examResults: SessionResultSummary[];
  assessmentResults: SessionResultSummary[];
  strongestArea: string;
  nextPriority: string;
}
