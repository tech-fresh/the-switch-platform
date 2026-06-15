import path from "node:path";

export type PersistenceDriver = "local-json" | "memory";

export interface PersistenceRuntimeConfig {
  driver: PersistenceDriver;
  dataDirectory: string;
  backupDirectory: string | null;
  isPrototypePersistence: boolean;
}

const DEFAULT_DATA_DIRECTORY_NAME = ".codex-data";

let memoryDriverWarningShown = false;

export function getPersistenceRuntimeConfig(): PersistenceRuntimeConfig {
  const requestedDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const driver = requestedDriver === "memory" ? "memory" : "local-json";
  const dataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim()
    ? path.resolve(process.env.SWITCH_DATA_DIRECTORY)
    : path.join(process.cwd(), DEFAULT_DATA_DIRECTORY_NAME);
  const backupDirectory =
    driver === "memory" ? null : path.join(dataDirectory, "backups");

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
    isPrototypePersistence: driver === "local-json",
  };
}
