import { getDefaultSavedProgressRepository } from "@/lib/server/repositories";

import type {
  SaveExamProgressInput,
  SaveTimedAssessmentProgressInput,
  SavedProgressEntityType,
  SavedProgressRecord,
  SavedProgressRepository,
  SavedProgressStatus,
} from "./types";
import {
  applySavedProgressStatusUpdate,
  buildExamSavedProgressRecord,
  buildTimedAssessmentSavedProgressRecord,
  canTransitionSavedProgressStatus as canTransitionSavedProgressStatusRule,
} from "./rules";

const defaultRepository = getDefaultSavedProgressRepository();

export async function saveExamProgress(
  input: SaveExamProgressInput,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord> {
  const existing = await repository.getByEntityId(input.userId, "exam-session", input.examSessionId);

  return repository.save(
    buildExamSavedProgressRecord({
      input,
      existing,
    }),
  );
}

export async function saveTimedAssessmentProgress(
  input: SaveTimedAssessmentProgressInput,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord> {
  const existing = await repository.getByEntityId(
    input.userId,
    "timed-assessment-attempt",
    input.assessmentAttemptId,
  );

  return repository.save(
    buildTimedAssessmentSavedProgressRecord({
      input,
      existing,
    }),
  );
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

  if (!canTransitionSavedProgressStatus(existing.status, status)) {
    return existing;
  }

  return repository.save(
    applySavedProgressStatusUpdate({
      existing,
      nextStatus: status,
    }),
  );
}

export async function listSavedProgressByUser(
  userId: string,
  repository: SavedProgressRepository = defaultRepository,
): Promise<SavedProgressRecord[]> {
  return repository.listByUserId(userId);
}

export function canTransitionSavedProgressStatus(
  currentStatus: SavedProgressStatus,
  nextStatus: SavedProgressStatus,
): boolean {
  return canTransitionSavedProgressStatusRule(currentStatus, nextStatus);
}
