import type {
  SaveExamProgressInput,
  SaveTimedAssessmentProgressInput,
  SavedProgressEntityType,
  SavedProgressRecord,
  SavedProgressRepository,
  SavedProgressStatus,
} from "./types";

const inMemorySavedProgress = new Map<string, SavedProgressRecord>();

const defaultRepository: SavedProgressRepository = {
  async getByEntityId(userId, entityType, entityId) {
    return inMemorySavedProgress.get(buildRepositoryKey(userId, entityType, entityId)) ?? null;
  },
  async listByUserId(userId) {
    return [...inMemorySavedProgress.values()]
      .filter((record) => record.userId === userId)
      .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
  },
  async save(record) {
    inMemorySavedProgress.set(
      buildRepositoryKey(record.userId, record.entityType, record.entityId),
      record,
    );

    return record;
  },
};

export async function saveExamProgress(
  input: SaveExamProgressInput,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord> {
  const flaggedQuestionIds = input.questionResponses
    .filter((response) => response.flagged)
    .map((response) => response.questionId);

  return repository.save({
    progressId: input.progressId ?? `saved-${input.examSessionId}`,
    userId: input.userId,
    entityId: input.examSessionId,
    entityType: "exam-session",
    status: input.status ?? "in-progress",
    lastActivityAt: new Date().toISOString(),
    accessArrangementSnapshot: input.accessArrangementSnapshot,
    examProgress: {
      currentQuestionId: input.currentQuestionId,
      questionSet: input.questionSet,
      questionResponses: input.questionResponses,
      flaggedQuestionIds,
      timeRemainingMinutes: input.timeRemainingMinutes,
    },
  });
}

export async function saveTimedAssessmentProgress(
  input: SaveTimedAssessmentProgressInput,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord> {
  return repository.save({
    progressId: input.progressId ?? `saved-${input.assessmentAttemptId}`,
    userId: input.userId,
    entityId: input.assessmentAttemptId,
    entityType: "timed-assessment-attempt",
    status: input.status ?? "in-progress",
    lastActivityAt: new Date().toISOString(),
    accessArrangementSnapshot: input.accessArrangementSnapshot,
    timedAssessmentProgress: {
      currentQuestionId: input.currentQuestionId,
      selectedDurationMinutes: input.selectedDurationMinutes,
      questionSet: input.questionSet,
      selectedAnswerIds: input.selectedAnswerIds,
      writtenAnswers: input.writtenAnswers,
      notes: input.notes,
      bookmarkedQuestionIds: input.bookmarkedQuestionIds,
      timeRemainingMinutes: input.timeRemainingMinutes,
    },
  });
}

export async function getSavedProgress(
  userId: string,
  entityType: SavedProgressEntityType,
  entityId: string,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord | null> {
  return repository.getByEntityId(userId, entityType, entityId);
}

export async function markSavedProgressStatus(
  userId: string,
  entityType: SavedProgressEntityType,
  entityId: string,
  status: SavedProgressStatus,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord | null> {
  const existing = await repository.getByEntityId(userId, entityType, entityId);

  if (!existing) {
    return null;
  }

  return repository.save({
    ...existing,
    status,
    lastActivityAt: new Date().toISOString(),
  });
}

export async function listSavedProgressByUser(
  userId: string,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord[]> {
  return repository.listByUserId(userId);
}

function buildRepositoryKey(
  userId: string,
  entityType: SavedProgressEntityType,
  entityId: string,
): string {
  return `${userId}:${entityType}:${entityId}`;
}
