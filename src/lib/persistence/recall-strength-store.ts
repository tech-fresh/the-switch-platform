import type { RecallStrengthTopicRecord } from "@/modules/recall-strength/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<RecallStrengthTopicRecord>("recall-strength.records")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<RecallStrengthTopicRecord>({
          collectionKey: "recall-strength.records",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<RecallStrengthTopicRecord>({
          filename: "recall-strength.json",
          collectionKey: "records",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readRecallStrengthRecords(): Promise<RecallStrengthTopicRecord[]> {
  return store.read();
}

export async function writeRecallStrengthRecords(records: RecallStrengthTopicRecord[]): Promise<void> {
  return store.write(records);
}
