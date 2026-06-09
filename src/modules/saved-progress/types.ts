import type { SavedProgressAccessArrangementSnapshot } from "@/modules/access-arrangements";
import type { ExamQuestion, ExamQuestionResponse } from "@/modules/exam-engine/types";
import type { TimedAssessmentQuestion } from "@/modules/timed-assessment/types";

export type SavedProgressEntityType = "exam-session" | "timed-assessment-attempt";

export type SavedProgressStatus = "in-progress" | "paused" | "submitted";

export type SavedProgressRecoveryState = "resume-ready" | "review-ready";

export interface SavedExamProgressPayload {
  currentQuestionId: string;
  questionSet: ExamQuestion[];
  questionResponses: ExamQuestionResponse[];
  flaggedQuestionIds: string[];
  timeRemainingMinutes: number;
}

export interface SavedTimedAssessmentProgressPayload {
  currentQuestionId?: string;
  selectedDurationMinutes: number;
  questionSet: TimedAssessmentQuestion[];
  selectedAnswerIds: string[];
  writtenAnswers: Record<string, string>;
  notes: Record<string, string>;
  bookmarkedQuestionIds: string[];
  timeRemainingMinutes: number;
}

export interface SavedProgressRecord {
  progressId: string;
  userId: string;
  entityId: string;
  entityType: SavedProgressEntityType;
  status: SavedProgressStatus;
  lastActivityAt: string;
  accessArrangementSnapshot?: SavedProgressAccessArrangementSnapshot;
  examProgress?: SavedExamProgressPayload;
  timedAssessmentProgress?: SavedTimedAssessmentProgressPayload;
}

export interface SavedProgressRepository {
  getByEntityId(
    userId: string,
    entityType: SavedProgressEntityType,
    entityId: string,
  ): Promise<SavedProgressRecord | null>;
  listByUserId(userId: string): Promise<SavedProgressRecord[]>;
  save(record: SavedProgressRecord): Promise<SavedProgressRecord>;
}

export interface SaveExamProgressInput {
  progressId?: string;
  userId: string;
  examSessionId: string;
  currentQuestionId: string;
  questionSet: ExamQuestion[];
  questionResponses: ExamQuestionResponse[];
  timeRemainingMinutes: number;
  accessArrangementSnapshot?: SavedProgressAccessArrangementSnapshot;
  status?: SavedProgressStatus;
}

export interface SaveTimedAssessmentProgressInput {
  progressId?: string;
  userId: string;
  assessmentAttemptId: string;
  currentQuestionId?: string;
  selectedDurationMinutes: number;
  questionSet: TimedAssessmentQuestion[];
  selectedAnswerIds: string[];
  writtenAnswers: Record<string, string>;
  notes: Record<string, string>;
  bookmarkedQuestionIds: string[];
  timeRemainingMinutes: number;
  accessArrangementSnapshot?: SavedProgressAccessArrangementSnapshot;
  status?: SavedProgressStatus;
}

export interface SavedProgressSessionSummary {
  progressId: string;
  entityId: string;
  entityType: SavedProgressEntityType;
  title: string;
  subtitle: string;
  href: string;
  actionLabel: string;
  status: SavedProgressStatus;
  recoveryState: SavedProgressRecoveryState;
  lastActivityAt: string;
  completionPercentage: number;
  currentQuestionLabel: string;
  timeRemainingLabel: string;
  supportSummary: string;
  reviewSummary: string;
}

export interface SavedProgressOverview {
  sessionCount: number;
  activeCount: number;
  submittedCount: number;
  recoveryReadyCount: number;
  reviewReadyCount: number;
  accessSnapshotCount: number;
  latestActivityAt?: string;
  recommendedAction: string;
  recommendedActionHref: string;
  resumeSessionHref?: string;
  reviewSessionHref?: string;
  latestSessionHref?: string;
  sessions: SavedProgressSessionSummary[];
}
