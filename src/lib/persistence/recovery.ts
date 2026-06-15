import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PersistenceRuntimeConfig } from "./runtime.ts";
import { getPersistenceRuntimeConfig } from "./runtime.ts";

interface RecoveryTrackedFile {
  filename: string;
  collectionKey: string;
  label: string;
}

export interface PersistenceRecoveryFileStatus {
  filename: string;
  label: string;
  activePath: string;
  backupPath: string;
  recordCount: number;
  activeExists: boolean;
  backupExists: boolean;
  matchesBackup: boolean;
  restoreCheckPassed: boolean;
  issue:
    | "invalid-active"
    | "invalid-backup"
    | "missing-backup"
    | "orphaned-backup"
    | "backup-drift"
    | null;
}

export interface PersistenceRecoveryStatus {
  checkedAt: string;
  dataDirectory: string;
  backupDirectory: string | null;
  isReady: boolean;
  issueCount: number;
  files: PersistenceRecoveryFileStatus[];
}

const TRACKED_FILES: RecoveryTrackedFile[] = [
  {
    filename: "saved-progress.json",
    collectionKey: "records",
    label: "Saved progress",
  },
  {
    filename: "access-profiles.json",
    collectionKey: "profiles",
    label: "Access profiles",
  },
  {
    filename: "auth-sessions.json",
    collectionKey: "sessions",
    label: "Auth sessions",
  },
];

export async function getPersistenceRecoveryStatus(
  config: PersistenceRuntimeConfig = getPersistenceRuntimeConfig(),
): Promise<PersistenceRecoveryStatus> {
  const checkedAt = new Date().toISOString();

  if (config.driver === "memory" || !config.backupDirectory) {
    return {
      checkedAt,
      dataDirectory: config.dataDirectory,
      backupDirectory: config.backupDirectory,
      isReady: false,
      issueCount: 1,
      files: [],
    };
  }

  const files = await Promise.all(
    TRACKED_FILES.map((trackedFile) =>
      inspectTrackedFile(config.dataDirectory, config.backupDirectory as string, trackedFile),
    ),
  );
  const issueCount = files.filter((file) => file.issue !== null).length;

  return {
    checkedAt,
    dataDirectory: config.dataDirectory,
    backupDirectory: config.backupDirectory,
    isReady: issueCount === 0,
    issueCount,
    files,
  };
}

async function inspectTrackedFile(
  dataDirectory: string,
  backupDirectory: string,
  trackedFile: RecoveryTrackedFile,
): Promise<PersistenceRecoveryFileStatus> {
  const activePath = path.join(dataDirectory, trackedFile.filename);
  const backupPath = path.join(backupDirectory, trackedFile.filename);
  const [active, backup] = await Promise.all([
    readCollectionFile(activePath, trackedFile.collectionKey),
    readCollectionFile(backupPath, trackedFile.collectionKey),
  ]);

  if (active.invalid) {
    return buildRecoveryFileStatus({
      trackedFile,
      activePath,
      backupPath,
      recordCount: 0,
      activeExists: active.exists,
      backupExists: backup.exists,
      matchesBackup: false,
      restoreCheckPassed: false,
      issue: "invalid-active",
    });
  }

  if (backup.invalid) {
    return buildRecoveryFileStatus({
      trackedFile,
      activePath,
      backupPath,
      recordCount: active.records.length,
      activeExists: active.exists,
      backupExists: backup.exists,
      matchesBackup: false,
      restoreCheckPassed: false,
      issue: "invalid-backup",
    });
  }

  if (active.exists && !backup.exists) {
    return buildRecoveryFileStatus({
      trackedFile,
      activePath,
      backupPath,
      recordCount: active.records.length,
      activeExists: true,
      backupExists: false,
      matchesBackup: false,
      restoreCheckPassed: false,
      issue: "missing-backup",
    });
  }

  if (!active.exists && backup.exists) {
    return buildRecoveryFileStatus({
      trackedFile,
      activePath,
      backupPath,
      recordCount: backup.records.length,
      activeExists: false,
      backupExists: true,
      matchesBackup: false,
      restoreCheckPassed: false,
      issue: "orphaned-backup",
    });
  }

  if (!active.exists && !backup.exists) {
    return buildRecoveryFileStatus({
      trackedFile,
      activePath,
      backupPath,
      recordCount: 0,
      activeExists: false,
      backupExists: false,
      matchesBackup: true,
      restoreCheckPassed: true,
      issue: null,
    });
  }

  const activeSnapshot = JSON.stringify(active.records);
  const backupSnapshot = JSON.stringify(backup.records);
  const matchesBackup = activeSnapshot === backupSnapshot;

  return buildRecoveryFileStatus({
    trackedFile,
    activePath,
    backupPath,
    recordCount: active.records.length,
    activeExists: true,
    backupExists: true,
    matchesBackup,
    restoreCheckPassed: backup.records.length >= 0,
    issue: matchesBackup ? null : "backup-drift",
  });
}

function buildRecoveryFileStatus(
  input: Omit<PersistenceRecoveryFileStatus, "filename" | "label"> & {
    trackedFile: RecoveryTrackedFile;
  },
): PersistenceRecoveryFileStatus {
  return {
    filename: input.trackedFile.filename,
    label: input.trackedFile.label,
    activePath: input.activePath,
    backupPath: input.backupPath,
    recordCount: input.recordCount,
    activeExists: input.activeExists,
    backupExists: input.backupExists,
    matchesBackup: input.matchesBackup,
    restoreCheckPassed: input.restoreCheckPassed,
    issue: input.issue,
  };
}

async function readCollectionFile(
  filePath: string,
  collectionKey: string,
): Promise<{ exists: boolean; invalid: boolean; records: unknown[] }> {
  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as Record<string, unknown>;
    const records = payload[collectionKey];

    if (!Array.isArray(records)) {
      return {
        exists: true,
        invalid: true,
        records: [],
      };
    }

    return {
      exists: true,
      invalid: false,
      records,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        exists: false,
        invalid: false,
        records: [],
      };
    }

    return {
      exists: true,
      invalid: true,
      records: [],
    };
  }
}
