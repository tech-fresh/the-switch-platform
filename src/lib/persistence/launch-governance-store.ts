import type { StoredGovernanceRecord } from "@/modules/governance/types";

import { createJsonFileCollectionStore } from "./json-file-store.ts";
import { createMemoryCollectionStore } from "./memory-store.ts";
import { getPersistenceRuntimeConfig } from "./runtime.ts";
import { createSqliteCollectionStore } from "./sqlite-store.ts";

function getStore() {
  const runtimeConfig = getPersistenceRuntimeConfig();

  return runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<StoredGovernanceRecord>("launch-governance.records")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<StoredGovernanceRecord>({
          collectionKey: "launch-governance.records",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<StoredGovernanceRecord>({
          filename: "launch-governance.json",
          collectionKey: "records",
          directory: runtimeConfig.dataDirectory,
        });
}

export async function readLaunchGovernanceRecords(): Promise<StoredGovernanceRecord[]> {
  return getStore().read();
}

export async function writeLaunchGovernanceRecords(
  records: StoredGovernanceRecord[],
): Promise<void> {
  return getStore().write(records);
}
