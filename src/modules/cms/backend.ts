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
    nextStep: "Keep serving the website while repository-backed content storage is added.",
  },
  {
    providerId: "headless-cms-provider",
    name: "Future Headless CMS",
    type: "headless-cms",
    description: "Planned source for editor-managed revision content, topic copy, and launch metadata.",
    syncStatus: "planned",
    nextStep: "Add repository adapter and publishing workflow before replacing seed content.",
  },
  {
    providerId: "manual-upload-provider",
    name: "Manual Upload Gateway",
    type: "manual-upload",
    description: "Fallback import path for structured CSV or JSON content updates during MVP growth.",
    syncStatus: "planned",
    nextStep: "Use for controlled imports before full CMS tooling is prioritised.",
  },
];

const repositoryCmsBackend: CmsBackend = {
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
    return "Keep the website on reviewed seed content now, then add a headless CMS adapter and approval workflow without changing student routes.";
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
    return "This runtime is read-only. Editorial updates can be reviewed, but a writable production CMS adapter is still required before launch publishing.";
  },
  isReadOnly() {
    return true;
  },
};

export function getCmsBackend(): CmsBackend {
  const runtime = getCmsRuntimeConfig();

  return runtime.backendMode === "read-only" ? readOnlyCmsBackend : repositoryCmsBackend;
}
