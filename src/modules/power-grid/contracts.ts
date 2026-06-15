import type { PowerGridSummary } from "./types";

export type PowerGridContractRoute = "GET /progress/summary";

export interface GetPowerGridSummaryResponse {
  summary: PowerGridSummary;
}
