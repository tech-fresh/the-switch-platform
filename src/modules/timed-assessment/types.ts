import type {
  AssessmentWithAccessArrangements,
  ExamBoard,
  ExamTier,
  QualificationType,
} from "@/modules/access-arrangements";

export type TimedAssessmentStatus = "not-started" | "in-progress" | "paused" | "submitted";

export interface TimedAssessmentDefinition {
  assessmentId: string;
  title: string;
  subject: string;
  qualificationType: QualificationType;
  examBoard: ExamBoard;
  tier?: ExamTier;
  officialDurationMinutes: number;
  questionCount: number;
}

export type TimedAssessmentQuestionType = "multiple-choice";

export interface TimedAssessmentQuestionOption {
  optionId: string;
  label: string;
  text: string;
}

export interface TimedAssessmentQuestion {
  questionId: string;
  number: number;
  topic: string;
  prompt: string;
  type: TimedAssessmentQuestionType;
  options: TimedAssessmentQuestionOption[];
  correctOptionId: string;
  guidance?: string;
}

export interface TimedAssessmentAttempt {
  attemptId: string;
  assessmentId: string;
  userId: string;
  selectedDurationMinutes: number;
  adjustedDurationMinutes: number;
  timeRemainingMinutes: number;
  status: TimedAssessmentStatus;
  startedAt: string;
  lastSavedAt: string;
  accessArrangements?: AssessmentWithAccessArrangements;
}

export interface CreateTimedAssessmentAttemptInput {
  assessment: TimedAssessmentDefinition;
  userId: string;
  selectedDurationMinutes: number;
}

export interface TimedAssessmentAttemptSeed {
  attempt: TimedAssessmentAttempt;
  questions: TimedAssessmentQuestion[];
  selectedAnswerIds: string[];
  writtenAnswers: Record<string, string>;
  notes: Record<string, string>;
  bookmarkedQuestionIds: string[];
  currentQuestionId?: string;
}
