import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

export interface PersistedDashboardUiPreferencesRecord {
  userId: string;
  plannerPromptDismissed: boolean;
  updatedAt: string;
}

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<PersistedDashboardUiPreferencesRecord>(
        "dashboard-ui-preferences.records",
      )
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<PersistedDashboardUiPreferencesRecord>({
          collectionKey: "dashboard-ui-preferences.records",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<PersistedDashboardUiPreferencesRecord>({
          filename: "dashboard-ui-preferences.json",
          collectionKey: "records",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readDashboardUiPreferencesRecords(): Promise<
  PersistedDashboardUiPreferencesRecord[]
> {
  return store.read();
}

export async function writeDashboardUiPreferencesRecords(
  records: PersistedDashboardUiPreferencesRecord[],
): Promise<void> {
  return store.write(records);
}
