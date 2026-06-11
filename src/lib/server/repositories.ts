import type { PersistedAuthSessionRecord } from "@/lib/persistence/auth-session-store";
import { readPersistedAuthSessions, writePersistedAuthSessions } from "@/lib/persistence/auth-session-store";
import { readCmsWorkflowRecords, writeCmsWorkflowRecords } from "@/lib/persistence/cms-workflow-store";
import { readAccessProfiles, writeAccessProfiles } from "@/lib/persistence/access-profile-store";
import { readSavedProgressRecords, writeSavedProgressRecords } from "@/lib/persistence/saved-progress-store";
import type { StudentAccessProfile, StudentAccessProfileRepository } from "@/modules/access-arrangements/types";
import type { CmsEditorialWorkflowRecord } from "@/modules/cms/types";
import type {
  SavedProgressEntityType,
  SavedProgressRecord,
  SavedProgressRepository,
} from "@/modules/saved-progress/types";

export interface AuthSessionRepository {
  listSessions(): Promise<PersistedAuthSessionRecord[]>;
  replaceSessions(sessions: PersistedAuthSessionRecord[]): Promise<void>;
}

export interface CmsWorkflowRepository {
  listRecords(): Promise<CmsEditorialWorkflowRecord[]>;
  replaceRecords(records: CmsEditorialWorkflowRecord[]): Promise<void>;
}

const defaultSavedProgressRepository: SavedProgressRepository = {
  async getByEntityId(userId, entityType, entityId) {
    const records = await readSavedProgressRecords();

    return (
      records.find(
        (record) =>
          record.userId === userId &&
          record.entityType === entityType &&
          record.entityId === entityId,
      ) ?? null
    );
  },
  async listByUserId(userId) {
    const records = await readSavedProgressRecords();

    return records
      .filter((record) => record.userId === userId)
      .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
  },
  async save(record) {
    const repositoryKey = buildSavedProgressRepositoryKey(
      record.userId,
      record.entityType,
      record.entityId,
    );
    const records = await readSavedProgressRecords();
    const nextRecords = records
      .filter(
        (existingRecord) =>
          buildSavedProgressRepositoryKey(
            existingRecord.userId,
            existingRecord.entityType,
            existingRecord.entityId,
          ) !== repositoryKey,
      )
      .concat(record)
      .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));

    await writeSavedProgressRecords(nextRecords);

    return record;
  },
};

const defaultStudentAccessProfileRepository: StudentAccessProfileRepository = {
  async getByUserId(userId) {
    const profiles = await readAccessProfiles();
    return profiles.find((profile) => profile.userId === userId) ?? null;
  },
  async save(profile: StudentAccessProfile) {
    const profiles = await readAccessProfiles();
    const nextProfiles = profiles
      .filter((existingProfile) => existingProfile.userId !== profile.userId)
      .concat(profile)
      .sort((left, right) => left.userId.localeCompare(right.userId));

    await writeAccessProfiles(nextProfiles);

    return profile;
  },
};

const defaultAuthSessionRepository: AuthSessionRepository = {
  async listSessions() {
    return readPersistedAuthSessions();
  },
  async replaceSessions(sessions) {
    await writePersistedAuthSessions(sessions);
  },
};

const defaultCmsWorkflowRepository: CmsWorkflowRepository = {
  async listRecords() {
    return readCmsWorkflowRecords();
  },
  async replaceRecords(records) {
    await writeCmsWorkflowRecords(records);
  },
};

export function getDefaultSavedProgressRepository(): SavedProgressRepository {
  return defaultSavedProgressRepository;
}

export function getDefaultStudentAccessProfileRepository(): StudentAccessProfileRepository {
  return defaultStudentAccessProfileRepository;
}

export function getDefaultAuthSessionRepository(): AuthSessionRepository {
  return defaultAuthSessionRepository;
}

export function getDefaultCmsWorkflowRepository(): CmsWorkflowRepository {
  return defaultCmsWorkflowRepository;
}

function buildSavedProgressRepositoryKey(
  userId: string,
  entityType: SavedProgressEntityType,
  entityId: string,
): string {
  return userId + ":" + entityType + ":" + entityId;
}
