import type { QuizProgressRecord } from "@/modules/quiz/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<QuizProgressRecord>("quiz-progress.records")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<QuizProgressRecord>({
          collectionKey: "quiz-progress.records",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<QuizProgressRecord>({
          filename: "quiz-progress.json",
          collectionKey: "records",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readQuizProgressRecords(): Promise<QuizProgressRecord[]> {
  return store.read();
}

export async function writeQuizProgressRecords(records: QuizProgressRecord[]): Promise<void> {
  return store.write(records);
}
