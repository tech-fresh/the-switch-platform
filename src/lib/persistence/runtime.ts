import { tmpdir } from "node:os";
import path from "node:path";

export type PersistenceDriver = "local-json" | "sqlite" | "memory";
export type PersistenceStorageBackend = "filesystem";

export interface PersistenceRuntimeConfig {
  driver: PersistenceDriver;
  storageBackend: PersistenceStorageBackend;
  dataDirectory: string;
  backupDirectory: string | null;
  primaryStorePath: string;
  backupStorePath: string | null;
  isPrototypePersistence: boolean;
  usesDefaultDataDirectory: boolean;
  isServerlessRuntime: boolean;
  isEphemeralStorage: boolean;
}

const DEFAULT_DATA_DIRECTORY_NAME = ".codex-data";
const SQLITE_DATABASE_FILENAME = "switch-live.sqlite";
const LOCAL_FLY_VOLUME_FALLBACK_DIRECTORY = path.join(
  process.cwd(),
  DEFAULT_DATA_DIRECTORY_NAME,
  "fly-volume-fallback",
);

let memoryDriverWarningShown = false;

export function getPersistenceRuntimeConfig(): PersistenceRuntimeConfig {
  const requestedDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const configuredDataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim();
  const isServerlessRuntime = detectServerlessFilesystemRuntime();
  const usesLocalFlyVolumeFallback = shouldUseLocalFlyVolumeFallback(configuredDataDirectory);
  const driver =
    requestedDriver === "memory"
      ? "memory"
      : requestedDriver === "sqlite"
        ? "sqlite"
        : "local-json";
  const storageBackend: PersistenceStorageBackend = "filesystem";
  const usesDefaultDataDirectory = !configuredDataDirectory;
  const dataDirectory = usesLocalFlyVolumeFallback
    ? LOCAL_FLY_VOLUME_FALLBACK_DIRECTORY
    : configuredDataDirectory
      ? path.resolve(configuredDataDirectory)
      : getDefaultDataDirectory(isServerlessRuntime);
  const backupDirectory = driver === "memory" ? null : path.join(dataDirectory, "backups");
  const primaryStorePath =
    driver === "sqlite"
      ? path.join(dataDirectory, SQLITE_DATABASE_FILENAME)
      : dataDirectory;
  const backupStorePath =
    driver === "sqlite" && backupDirectory
      ? path.join(backupDirectory, SQLITE_DATABASE_FILENAME)
      : backupDirectory;
  const tempDirectoryRoot = path.resolve(tmpdir());
  const isEphemeralStorage =
    driver !== "memory" &&
    isServerlessRuntime &&
    (path.resolve(dataDirectory) === tempDirectoryRoot ||
      path.resolve(dataDirectory).startsWith(`${tempDirectoryRoot}${path.sep}`));

  if (driver === "memory" && !memoryDriverWarningShown) {
    memoryDriverWarningShown = true;
    console.warn(
      "[switch:persistence] Using in-memory persistence driver. Data will reset when the process restarts.",
    );
  }

  return {
    driver,
    storageBackend,
    dataDirectory,
    backupDirectory,
    primaryStorePath,
    backupStorePath,
    isPrototypePersistence:
      driver === "memory" ||
      driver === "local-json" ||
      !configuredDataDirectory ||
      usesLocalFlyVolumeFallback,
    usesDefaultDataDirectory,
    isServerlessRuntime,
    isEphemeralStorage,
  };
}

function getDefaultDataDirectory(isServerlessRuntime: boolean): string {
  if (isServerlessRuntime) {
    return path.join(tmpdir(), DEFAULT_DATA_DIRECTORY_NAME);
  }

  return path.join(process.cwd(), DEFAULT_DATA_DIRECTORY_NAME);
}

function detectServerlessFilesystemRuntime(): boolean {
  return Boolean(
    process.env.VERCEL?.trim() ||
      process.env.AWS_LAMBDA_FUNCTION_VERSION?.trim() ||
      process.env.LAMBDA_TASK_ROOT?.trim(),
  );
}

function shouldUseLocalFlyVolumeFallback(configuredDataDirectory: string | undefined): boolean {
  if (!configuredDataDirectory) {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.FLY_APP_NAME?.trim() || process.env.FLY_MACHINE_ID?.trim()) {
    return false;
  }

  return path.resolve(configuredDataDirectory) === "/data";
}
