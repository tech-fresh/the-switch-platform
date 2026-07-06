import type { ProgressionEvent } from "@/modules/power-grid/progression-events";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<ProgressionEvent>("progression-events.records")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<ProgressionEvent>({
          collectionKey: "progression-events.records",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<ProgressionEvent>({
          filename: "progression-events.json",
          collectionKey: "records",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readProgressionEvents(): Promise<ProgressionEvent[]> {
  return store.read();
}

export async function writeProgressionEvents(records: ProgressionEvent[]): Promise<void> {
  return store.write(records);
}

export async function appendProgressionEvent(event: ProgressionEvent): Promise<void> {
  const records = await readProgressionEvents();
  await writeProgressionEvents([...records, event]);
}
