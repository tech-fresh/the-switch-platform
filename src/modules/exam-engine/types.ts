import type {
  ExamBoard,
  ExamTier,
  ExamWithAccessArrangements,
  QualificationType,
} from "@/modules/access-arrangements";

export type ExamQuestionType = "multiple-choice" | "short-answer";

export type ExamQuestionStatus = "not-started" | "in-progress" | "answered";

export type ExamSessionStatus = "in-progress" | "submitted";

export interface ExamQuestionOption {
  optionId: string;
  label: string;
  text: string;
}

export interface ExamQuestion {
  questionId: string;
  number: number;
  topic: string;
  prompt: string;
  marks: number;
  type: ExamQuestionType;
  options?: ExamQuestionOption[];
  guidance?: string;
  correctOptionId?: string;
  sourceQuestionKey?: string;
}

export interface ExamPaper {
  examId: string;
  title: string;
  subject: string;
  board: ExamBoard;
  qualificationType: QualificationType;
  tier: ExamTier;
  paperName: string;
  year: number;
  durationMinutes: number;
  totalMarks: number;
  skillsFocus: string[];
  questions: ExamQuestion[];
}

export interface ExamQuestionResponse {
  questionId: string;
  status: ExamQuestionStatus;
  selectedOptionId?: string;
  workingNotes?: string;
  flagged: boolean;
}

export interface ExamSessionGenerationSummary {
  strategy: "topic-repeat-question-rotate";
  reusedQuestionCount: number;
  repeatedTopicCount: number;
  questionSourceKeys: string[];
}

export interface ExamSession {
  examSessionId: string;
  examId: string;
  userId: string;
  attemptNumber: number;
  status: ExamSessionStatus;
  startedAt: string;
  lastSavedAt: string;
  durationMinutes: number;
  timeRemainingMinutes: number;
  accessArrangements?: ExamWithAccessArrangements;
  questions: ExamQuestion[];
  questionResponses: ExamQuestionResponse[];
  generationSummary: ExamSessionGenerationSummary;
}
