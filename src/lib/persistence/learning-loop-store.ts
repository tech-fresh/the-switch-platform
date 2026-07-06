import type { LearningLoopSession } from "@/modules/learning-loop/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<LearningLoopSession>("learning-loop.sessions")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<LearningLoopSession>({
          collectionKey: "learning-loop.sessions",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<LearningLoopSession>({
          filename: "learning-loop.json",
          collectionKey: "sessions",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readLearningLoopSessions(): Promise<LearningLoopSession[]> {
  return store.read();
}

export async function writeLearningLoopSessions(sessions: LearningLoopSession[]): Promise<void> {
  return store.write(sessions);
}
