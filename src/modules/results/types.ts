export type ResultTrend = "improving" | "stable" | "needs-attention";

export interface SessionResultSummary {
  resultId: string;
  kind: "exam" | "assessment";
  title: string;
  subtitle: string;
  scorePercentage: number;
  answeredCount: number;
  totalCount: number;
  flaggedCount: number;
  trend: ResultTrend;
  strengths: string[];
  nextStep: string;
}

export interface ResultsOverview {
  overallScorePercentage: number;
  overallTrend: ResultTrend;
  completedCount: number;
  averageExamScore: number;
  averageAssessmentScore: number;
  examResults: SessionResultSummary[];
  assessmentResults: SessionResultSummary[];
  strongestArea: string;
  nextPriority: string;
}
