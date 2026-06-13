export type CmsBackendMode = "repository" | "read-only";

export interface CmsRuntimeConfig {
  backendMode: CmsBackendMode;
}

export function getCmsRuntimeConfig(): CmsRuntimeConfig {
  const requestedMode = process.env.SWITCH_CMS_BACKEND_MODE?.trim();

  return {
    backendMode: requestedMode === "read-only" ? "read-only" : "repository",
  };
}
