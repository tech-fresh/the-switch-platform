import path from "node:path";

export type PersistenceDriver = "local-json" | "sqlite" | "memory";

export interface PersistenceRuntimeConfig {
  driver: PersistenceDriver;
  dataDirectory: string;
  backupDirectory: string | null;
  primaryStorePath: string;
  backupStorePath: string | null;
  isPrototypePersistence: boolean;
}

const DEFAULT_DATA_DIRECTORY_NAME = ".codex-data";
const SQLITE_DATABASE_FILENAME = "switch-live.sqlite";

let memoryDriverWarningShown = false;

export function getPersistenceRuntimeConfig(): PersistenceRuntimeConfig {
  const requestedDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const configuredDataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim();
  const driver =
    requestedDriver === "memory"
      ? "memory"
      : requestedDriver === "sqlite"
        ? "sqlite"
        : "local-json";
  const dataDirectory = configuredDataDirectory
    ? path.resolve(configuredDataDirectory)
    : path.join(process.cwd(), DEFAULT_DATA_DIRECTORY_NAME);
  const backupDirectory =
    driver === "memory" ? null : path.join(dataDirectory, "backups");
  const primaryStorePath =
    driver === "sqlite"
      ? path.join(dataDirectory, SQLITE_DATABASE_FILENAME)
      : dataDirectory;
  const backupStorePath =
    driver === "sqlite" && backupDirectory
      ? path.join(backupDirectory, SQLITE_DATABASE_FILENAME)
      : backupDirectory;

  if (driver === "memory" && !memoryDriverWarningShown) {
    memoryDriverWarningShown = true;
    console.warn(
      "[switch:persistence] Using in-memory persistence driver. Data will reset when the process restarts.",
    );
  }

  return {
    driver,
    dataDirectory,
    backupDirectory,
    primaryStorePath,
    backupStorePath,
    isPrototypePersistence:
      driver === "memory" || driver === "local-json" || !configuredDataDirectory,
  };
}
