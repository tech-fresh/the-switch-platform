import { getDefaultCmsWorkflowRepository } from "@/lib/server/repositories";
import type {
  CmsEditorialWorkflowRecord,
  CmsProvider,
} from "./types";
import { getCmsRuntimeConfig } from "./runtime";

export interface CmsBackend {
  listWorkflowRecords(): Promise<CmsEditorialWorkflowRecord[]>;
  replaceWorkflowRecords(records: CmsEditorialWorkflowRecord[]): Promise<void>;
  listProviders(): Promise<CmsProvider[]>;
  getNextUpdatePlan(): Promise<string>;
  isReadOnly(): boolean;
}

const defaultRepository = getDefaultCmsWorkflowRepository();

const cmsProviders: CmsProvider[] = [
  {
    providerId: "seed-content-provider",
    name: "Seed Content Provider",
    type: "seed-content",
    description: "Current MVP source for subjects, topics, revision stacks, and quiz prompts.",
    syncStatus: "healthy",
    lastSyncedAt: "2026-06-06T09:10:00.000Z",
    nextStep: "Keep serving reviewed learner content while the live editorial workflow controls review, approval, and rollback state.",
  },
  {
    providerId: "headless-cms-provider",
    name: "Future Headless CMS",
    type: "headless-cms",
    description: "Optional upstream source for editor-managed revision content, topic copy, and launch metadata.",
    syncStatus: "warning",
    nextStep: "Connect this provider only when its updates pass through the live editorial workflow and keep source evidence intact.",
  },
  {
    providerId: "manual-upload-provider",
    name: "Manual Upload Gateway",
    type: "manual-upload",
    description: "Controlled import path for structured CSV or JSON content updates that need the same review controls.",
    syncStatus: "warning",
    nextStep: "Use this gateway for controlled imports when editorial review, fact-check, and publish checks are still required.",
  },
];

const liveCmsBackend: CmsBackend = {
  async listWorkflowRecords() {
    return defaultRepository.listRecords();
  },
  async replaceWorkflowRecords(records) {
    await defaultRepository.replaceRecords(records);
  },
  async listProviders() {
    return cmsProviders;
  },
  async getNextUpdatePlan() {
    return "Editorial work now runs through the live writable workflow in this runtime, while reviewed seed content continues serving students until a future provider replaces the source path.";
  },
  isReadOnly() {
    return false;
  },
};

const readOnlyCmsBackend: CmsBackend = {
  async listWorkflowRecords() {
    return defaultRepository.listRecords();
  },
  async replaceWorkflowRecords() {
    throw new Error("CMS workflow updates are disabled because the backend is running in read-only mode.");
  },
  async listProviders() {
    return cmsProviders.map((provider) =>
      provider.type === "headless-cms"
        ? {
            ...provider,
            syncStatus: "warning",
            nextStep:
              "This runtime is read-only. Point the CMS backend at a writable production adapter before editorial updates can ship.",
          }
        : provider,
    );
  },
  async getNextUpdatePlan() {
    return "This runtime is read-only. Editorial updates can be reviewed, but the live writable workflow must be re-enabled before launch publishing.";
  },
  isReadOnly() {
    return true;
  },
};

export function getCmsBackend(): CmsBackend {
  const runtime = getCmsRuntimeConfig();

  return runtime.backendMode === "read-only" ? readOnlyCmsBackend : liveCmsBackend;
}
