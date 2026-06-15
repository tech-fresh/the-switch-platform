import type { WebsiteGuideData } from "./types";

export type WebsiteGuideContractRoute = "GET /website-guide";

export interface GetWebsiteGuideResponse {
  guide: WebsiteGuideData;
}
