import type { ContentEditorialAudit, MvpContentCatalog } from "./types";

export type ContentContractRoute = "GET /content/catalog" | "GET /content/editorial-audit";

export type ContentCatalogAudience = "student" | "internal";

export interface GetContentCatalogResponse {
  catalog: MvpContentCatalog;
  audience: ContentCatalogAudience;
}

export interface GetContentEditorialAuditResponse {
  audit: ContentEditorialAudit;
}
