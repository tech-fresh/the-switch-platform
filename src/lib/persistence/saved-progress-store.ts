import type { SavedProgressRecord } from "@/modules/saved-progress/types";

import { createJsonFileCollectionStore } from "./json-file-store";

const store = createJsonFileCollectionStore<SavedProgressRecord>({
  filename: "saved-progress.json",
  collectionKey: "records",
});

export async function readSavedProgressRecords(): Promise<SavedProgressRecord[]> {
  return store.read();
}

export async function writeSavedProgressRecords(records: SavedProgressRecord[]): Promise<void> {
  return store.write(records);
}
