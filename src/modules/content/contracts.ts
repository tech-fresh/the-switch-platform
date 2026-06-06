import type { MvpContentCatalog } from "./types";

export type ContentContractRoute = "GET /content/catalog";

export interface GetContentCatalogResponse {
  catalog: MvpContentCatalog;
}
