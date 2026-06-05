import type {
  ExamBoard,
  ExamTier,
  ExamWithAccessArrangements,
  QualificationType,
} from "@/modules/access-arrangements";

export type ExamQuestionType = "multiple-choice" | "short-answer";

export type ExamQuestionStatus = "not-started" | "in-progress" | "answered";

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

export interface ExamSession {
  examSessionId: string;
  examId: string;
  userId: string;
  startedAt: string;
  lastSavedAt: string;
  durationMinutes: number;
  timeRemainingMinutes: number;
  accessArrangements?: ExamWithAccessArrangements;
  questionResponses: ExamQuestionResponse[];
}
