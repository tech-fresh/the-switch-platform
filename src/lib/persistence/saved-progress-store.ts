import type { SavedProgressRecord } from "@/modules/saved-progress/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<SavedProgressRecord>("saved-progress.records")
    : createJsonFileCollectionStore<SavedProgressRecord>({
        filename: "saved-progress.json",
        collectionKey: "records",
        directory: runtimeConfig.dataDirectory,
      });

export async function readSavedProgressRecords(): Promise<SavedProgressRecord[]> {
  return store.read();
}

export async function writeSavedProgressRecords(records: SavedProgressRecord[]): Promise<void> {
  return store.write(records);
}
