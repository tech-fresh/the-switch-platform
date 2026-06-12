import type { CmsEditorialWorkflowRecord } from "@/modules/cms/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<CmsEditorialWorkflowRecord>("cms-workflow.records")
    : createJsonFileCollectionStore<CmsEditorialWorkflowRecord>({
        filename: "cms-workflow.json",
        collectionKey: "records",
        directory: runtimeConfig.dataDirectory,
      });

export async function readCmsWorkflowRecords(): Promise<CmsEditorialWorkflowRecord[]> {
  return store.read();
}

export async function writeCmsWorkflowRecords(
  records: CmsEditorialWorkflowRecord[],
): Promise<void> {
  return store.write(records);
}
