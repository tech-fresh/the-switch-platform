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
    name: "Reviewed Content Catalog",
    type: "seed-content",
    description: "Current live operating source for reviewed subjects, topics, revision stacks, and quiz prompts.",
    syncStatus: "healthy",
    lastSyncedAt: "2026-06-06T09:10:00.000Z",
    nextStep: "Keep serving reviewed learner content while the live editorial workflow controls review, approval, correction, and rollback state.",
  },
  {
    providerId: "managed-content-source",
    name: "Managed Content Source",
    type: "headless-cms",
    description: "Managed upstream source boundary for editor-owned topic copy, revision content, and release metadata when connected through the same publish controls.",
    syncStatus: "healthy",
    nextStep: "Use this source only through the same editorial review, fact-check, source evidence, and rollback controls as the reviewed catalog.",
  },
  {
    providerId: "controlled-import-gateway",
    name: "Controlled Import Gateway",
    type: "manual-upload",
    description: "Controlled import path for structured CSV or JSON content updates that must pass the same review, evidence, and publish controls before release.",
    syncStatus: "healthy",
    nextStep: "Use this gateway for approved structured imports without bypassing editorial review, fact-checking, or source evidence checks.",
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
    return "Editorial work now runs through the live writable workflow in this runtime, and reviewed content updates move through the reviewed catalog, managed content source boundary, and controlled import gateway under the same publish controls.";
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
      provider.type === "headless-cms" || provider.type === "manual-upload"
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
