import { getPersistenceRecoveryStatus } from "@/lib/persistence/recovery";
import type { PersistedAuthSessionRecord } from "@/lib/persistence/auth-session-store";
import { readPersistedAuthSessions, writePersistedAuthSessions } from "@/lib/persistence/auth-session-store";
import { readCmsWorkflowRecords, writeCmsWorkflowRecords } from "@/lib/persistence/cms-workflow-store";
import {
  readLaunchGovernanceRecords,
  writeLaunchGovernanceRecords,
} from "@/lib/persistence/launch-governance-store";
import { readAccessProfiles, writeAccessProfiles } from "@/lib/persistence/access-profile-store";
import { getPersistenceRuntimeConfig } from "@/lib/persistence/runtime";
import { readSavedProgressRecords, writeSavedProgressRecords } from "@/lib/persistence/saved-progress-store";
import type { StudentAccessProfile, StudentAccessProfileRepository } from "@/modules/access-arrangements/types";
import type { CmsEditorialWorkflowRecord } from "@/modules/cms/types";
import type { StoredGovernanceRecord } from "@/modules/governance/types";
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

export interface LaunchGovernanceRepository {
  listRecords(): Promise<StoredGovernanceRecord[]>;
  replaceRecords(records: StoredGovernanceRecord[]): Promise<void>;
}

export interface PersistenceRuntimeSummary {
  driver: ReturnType<typeof getPersistenceRuntimeConfig>["driver"];
  dataDirectory: string;
  backupDirectory: string | null;
  primaryStorePath: string;
  backupStorePath: string | null;
  isPrototypePersistence: boolean;
  usesDefaultDataDirectory: boolean;
  isServerlessRuntime: boolean;
  isEphemeralStorage: boolean;
  recoveryReady: boolean;
  recoveryCheckedAt: string | null;
  recoveryIssueCount: number;
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

const defaultLaunchGovernanceRepository: LaunchGovernanceRepository = {
  async listRecords() {
    return readLaunchGovernanceRecords();
  },
  async replaceRecords(records) {
    await writeLaunchGovernanceRecords(records);
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

export function getDefaultLaunchGovernanceRepository(): LaunchGovernanceRepository {
  return defaultLaunchGovernanceRepository;
}

export async function getPersistenceRuntimeSummary(): Promise<PersistenceRuntimeSummary> {
  const config = getPersistenceRuntimeConfig();
  const recovery = await getPersistenceRecoveryStatus(config);

  return {
    driver: config.driver,
    dataDirectory: config.dataDirectory,
    backupDirectory: config.backupDirectory,
    primaryStorePath: config.primaryStorePath,
    backupStorePath: config.backupStorePath,
    isPrototypePersistence: config.driver === "memory" ? false : config.isPrototypePersistence || !recovery.isReady,
    usesDefaultDataDirectory: config.usesDefaultDataDirectory,
    isServerlessRuntime: config.isServerlessRuntime,
    isEphemeralStorage: config.isEphemeralStorage,
    recoveryReady: recovery.isReady,
    recoveryCheckedAt: recovery.checkedAt,
    recoveryIssueCount: recovery.issueCount,
  };
}

function buildSavedProgressRepositoryKey(
  userId: string,
  entityType: SavedProgressEntityType,
  entityId: string,
): string {
  return userId + ":" + entityType + ":" + entityId;
}
