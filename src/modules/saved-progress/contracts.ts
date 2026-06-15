import type {
  SavedProgressEntityType,
  SavedProgressOverview,
  SavedProgressRecord,
  SavedProgressStatus,
} from "./types";

export type SavedProgressContractRoute =
  | "GET /saved-progress/overview"
  | "PATCH /saved-progress/session/:entityType/:entityId";

export interface GetSavedProgressOverviewResponse {
  overview: SavedProgressOverview;
}

export interface UpdateSavedProgressStatusRequest {
  entityType: SavedProgressEntityType;
  entityId: string;
  status: SavedProgressStatus;
}

export interface UpdateSavedProgressStatusResponse {
  record: SavedProgressRecord;
}
