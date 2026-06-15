export type ResultTrend = "improving" | "stable" | "needs-attention";
export type MarkingConfidence = "high" | "medium" | "low";

export interface ResultQuestionReviewItem {
  questionId: string;
  label: string;
  topic: string;
  selectedAnswerLabel: string;
  correctAnswerLabel: string;
  outcome: "correct" | "incorrect" | "unanswered";
  flagged: boolean;
  hasWorkingNotes: boolean;
}

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
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalCount: number;
  flaggedCount: number;
  reviewLabel: string;
  trend: ResultTrend;
  markingConfidence: MarkingConfidence;
  strengths: string[];
  reviewPriorities: string[];
  markingNotes: string[];
  questionReview: ResultQuestionReviewItem[];
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
  continuityStatus: "resume-active-session" | "review-submitted-session" | "start-first-session";
  continuityTitle: string;
  continuityDescription: string;
  continuityHref: string;
  continuityActionLabel: string;
}
