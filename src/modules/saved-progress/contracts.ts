import type { SavedProgressOverview } from "./types";

export type SavedProgressContractRoute = "GET /saved-progress/overview";

export interface GetSavedProgressOverviewResponse {
  overview: SavedProgressOverview;
}
