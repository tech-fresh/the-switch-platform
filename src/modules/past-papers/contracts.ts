import type { PastPaperCatalogOverview } from "./types";

export type PastPapersContractRoute = "GET /past-papers/catalog";

export interface GetPastPaperCatalogResponse {
  catalog: PastPaperCatalogOverview;
}
