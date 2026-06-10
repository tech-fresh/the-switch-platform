import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SavedProgressRecord } from "@/modules/saved-progress/types";

const storeDirectory = path.join(process.cwd(), ".codex-data");
const storePath = path.join(storeDirectory, "saved-progress.json");
const tempStorePath = path.join(storeDirectory, "saved-progress.tmp.json");

let writeChain = Promise.resolve();

interface SavedProgressStorePayload {
  records: SavedProgressRecord[];
}

export async function readSavedProgressRecords(): Promise<SavedProgressRecord[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    const payload = JSON.parse(raw) as SavedProgressStorePayload;

    return Array.isArray(payload.records) ? payload.records : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeSavedProgressRecords(records: SavedProgressRecord[]): Promise<void> {
  writeChain = writeChain.then(async () => {
    await mkdir(storeDirectory, { recursive: true });
    await writeFile(
      tempStorePath,
      JSON.stringify({ records } satisfies SavedProgressStorePayload, null, 2),
      "utf8",
    );
    await rename(tempStorePath, storePath);
  });

  return writeChain;
}
