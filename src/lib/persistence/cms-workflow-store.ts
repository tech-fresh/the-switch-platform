import type { CmsEditorialWorkflowRecord } from "@/modules/cms/types";

import { createJsonFileCollectionStore } from "./json-file-store";

const store = createJsonFileCollectionStore<CmsEditorialWorkflowRecord>({
  filename: "cms-workflow.json",
  collectionKey: "records",
});

export async function readCmsWorkflowRecords(): Promise<CmsEditorialWorkflowRecord[]> {
  return store.read();
}

export async function writeCmsWorkflowRecords(
  records: CmsEditorialWorkflowRecord[],
): Promise<void> {
  return store.write(records);
}
