import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CmsEditorialWorkflowRecord } from "@/modules/cms/types";

const storeDirectory = path.join(process.cwd(), ".codex-data");
const storePath = path.join(storeDirectory, "cms-workflow.json");
const tempStorePath = path.join(storeDirectory, "cms-workflow.tmp.json");

let writeChain = Promise.resolve();

interface CmsWorkflowStorePayload {
  records: CmsEditorialWorkflowRecord[];
}

export async function readCmsWorkflowRecords(): Promise<CmsEditorialWorkflowRecord[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    const payload = JSON.parse(raw) as CmsWorkflowStorePayload;

    return Array.isArray(payload.records) ? payload.records : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeCmsWorkflowRecords(
  records: CmsEditorialWorkflowRecord[],
): Promise<void> {
  writeChain = writeChain.then(async () => {
    await mkdir(storeDirectory, { recursive: true });
    await writeFile(
      tempStorePath,
      JSON.stringify({ records } satisfies CmsWorkflowStorePayload, null, 2),
      "utf8",
    );
    await rename(tempStorePath, storePath);
  });

  return writeChain;
}
