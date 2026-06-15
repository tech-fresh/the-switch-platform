import type { ExamQuestion, ExamQuestionResponse } from "@/modules/exam-engine/types";
import type { TimedAssessmentQuestion } from "@/modules/timed-assessment/types";
import type {
  SaveExamProgressInput,
  SaveTimedAssessmentProgressInput,
  SavedProgressRecord,
  SavedProgressStatus,
} from "./types";

export function canTransitionSavedProgressStatus(
  currentStatus: SavedProgressStatus,
  nextStatus: SavedProgressStatus,
): boolean {
  if (currentStatus === nextStatus) {
    return true;
  }

  if (currentStatus === "submitted") {
    return nextStatus === "submitted";
  }

  if (currentStatus === "paused") {
    return nextStatus === "in-progress" || nextStatus === "paused";
  }

  return nextStatus === "paused" || nextStatus === "in-progress" || nextStatus === "submitted";
}

export function getNextSavedProgressStatus(
  existingStatus?: SavedProgressStatus,
  incomingStatus?: SavedProgressStatus,
): SavedProgressStatus {
  if (existingStatus === "submitted") {
    return "submitted";
  }

  return incomingStatus ?? existingStatus ?? "in-progress";
}

export function buildNormalizedExamResponses(
  questionSet: ExamQuestion[],
  incomingResponses: ExamQuestionResponse[],
  existingResponses?: ExamQuestionResponse[],
): ExamQuestionResponse[] {
  const incomingByQuestionId = new Map(
    incomingResponses.map((response) => [response.questionId, response] as const),
  );
  const existingByQuestionId = new Map(
    (existingResponses ?? []).map((response) => [response.questionId, response] as const),
  );

  return questionSet.map((question) => {
    const source =
      incomingByQuestionId.get(question.questionId) ?? existingByQuestionId.get(question.questionId);

    if (!source) {
      return {
        questionId: question.questionId,
        status: "not-started",
        flagged: false,
      };
    }

    return {
      questionId: question.questionId,
      status: source.selectedOptionId ? "answered" : source.status,
      selectedOptionId: source.selectedOptionId,
      workingNotes: source.workingNotes,
      flagged: source.flagged,
    };
  });
}

export function getSafeCurrentQuestionId(
  incomingQuestionId: string | undefined,
  questionSet: ExamQuestion[],
  questionResponses: ExamQuestionResponse[],
  existingQuestionId?: string,
): string {
  const validQuestionIds = new Set(questionSet.map((question) => question.questionId));

  if (incomingQuestionId && validQuestionIds.has(incomingQuestionId)) {
    return incomingQuestionId;
  }

  if (existingQuestionId && validQuestionIds.has(existingQuestionId)) {
    return existingQuestionId;
  }

  const firstIncompleteResponse = questionResponses.find(
    (response) => response.status !== "answered" || response.flagged,
  );

  return firstIncompleteResponse?.questionId ?? questionSet[0]?.questionId ?? "";
}

export function getSafeOptionalCurrentQuestionId(
  incomingQuestionId: string | undefined,
  questionSet: TimedAssessmentQuestion[],
  existingQuestionId?: string,
): string | undefined {
  const validQuestionIds = new Set(questionSet.map((question) => question.questionId));

  if (incomingQuestionId && validQuestionIds.has(incomingQuestionId)) {
    return incomingQuestionId;
  }

  if (existingQuestionId && validQuestionIds.has(existingQuestionId)) {
    return existingQuestionId;
  }

  return questionSet[0]?.questionId;
}

export function filterRecordByQuestionIds(
  value: Record<string, string>,
  validQuestionIds: Set<string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).filter(([questionId]) => validQuestionIds.has(questionId)),
  );
}

export function unique<TValue>(values: TValue[]): TValue[] {
  return [...new Set(values)];
}

export function buildExamSavedProgressRecord(options: {
  input: SaveExamProgressInput;
  existing?: SavedProgressRecord | null;
  now?: string;
}): SavedProgressRecord {
  const { input, existing } = options;
  const questionSet = input.questionSet.length > 0 ? input.questionSet : existing?.examProgress?.questionSet ?? [];
  const questionResponses = buildNormalizedExamResponses(
    questionSet,
    input.questionResponses,
    existing?.examProgress?.questionResponses,
  );
  const flaggedQuestionIds = unique(
    questionResponses.filter((response) => response.flagged).map((response) => response.questionId),
  );
  const currentQuestionId = getSafeCurrentQuestionId(
    input.currentQuestionId,
    questionSet,
    questionResponses,
    existing?.examProgress?.currentQuestionId,
  );

  return {
    progressId: input.progressId ?? existing?.progressId ?? `saved-${input.examSessionId}`,
    userId: input.userId,
    entityId: input.examSessionId,
    entityType: "exam-session",
    status: getNextSavedProgressStatus(existing?.status, input.status),
    lastActivityAt: options.now ?? new Date().toISOString(),
    accessArrangementSnapshot: input.accessArrangementSnapshot ?? existing?.accessArrangementSnapshot,
    examProgress: {
      currentQuestionId,
      questionSet,
      questionResponses,
      flaggedQuestionIds,
      timeRemainingMinutes: Math.max(0, input.timeRemainingMinutes),
    },
  };
}

export function buildTimedAssessmentSavedProgressRecord(options: {
  input: SaveTimedAssessmentProgressInput;
  existing?: SavedProgressRecord | null;
  now?: string;
}): SavedProgressRecord {
  const { input, existing } = options;
  const questionSet =
    input.questionSet.length > 0 ? input.questionSet : existing?.timedAssessmentProgress?.questionSet ?? [];
  const validQuestionIds = new Set(questionSet.map((question) => question.questionId));
  const selectedAnswerIds = unique(
    input.selectedAnswerIds.filter((answerId) => validQuestionIds.has(answerId.split(":")[0] ?? "")),
  );
  const bookmarkedQuestionIds = unique(
    input.bookmarkedQuestionIds.filter((questionId) => validQuestionIds.has(questionId)),
  );
  const currentQuestionId = getSafeOptionalCurrentQuestionId(
    input.currentQuestionId,
    questionSet,
    existing?.timedAssessmentProgress?.currentQuestionId,
  );

  return {
    progressId: input.progressId ?? existing?.progressId ?? `saved-${input.assessmentAttemptId}`,
    userId: input.userId,
    entityId: input.assessmentAttemptId,
    entityType: "timed-assessment-attempt",
    status: getNextSavedProgressStatus(existing?.status, input.status),
    lastActivityAt: options.now ?? new Date().toISOString(),
    accessArrangementSnapshot: input.accessArrangementSnapshot ?? existing?.accessArrangementSnapshot,
    timedAssessmentProgress: {
      currentQuestionId,
      selectedDurationMinutes: Math.max(0, input.selectedDurationMinutes),
      questionSet,
      selectedAnswerIds,
      writtenAnswers: filterRecordByQuestionIds(input.writtenAnswers, validQuestionIds),
      notes: filterRecordByQuestionIds(input.notes, validQuestionIds),
      bookmarkedQuestionIds,
      timeRemainingMinutes: Math.max(0, input.timeRemainingMinutes),
    },
  };
}

export function applySavedProgressStatusUpdate(options: {
  existing: SavedProgressRecord;
  nextStatus: SavedProgressStatus;
  now?: string;
}): SavedProgressRecord {
  return {
    ...options.existing,
    status: options.nextStatus,
    lastActivityAt: options.now ?? new Date().toISOString(),
  };
}
