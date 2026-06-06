import type { CmsOverview } from "./types";

export type CmsContractRoute = "GET /cms/overview";

export interface GetCmsOverviewResponse {
  overview: CmsOverview;
}
