import type { ResultsOverview } from "./types";

export type ResultsContractRoute = "GET /results/overview";

export interface GetResultsOverviewResponse {
  results: ResultsOverview;
}
