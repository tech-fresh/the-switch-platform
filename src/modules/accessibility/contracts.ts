import type { AccessibilitySettings, AccessibilitySnapshot } from "./types";

export type AccessibilityContractRoute =
  | "GET /accessibility/snapshot"
  | "PATCH /accessibility/snapshot";

export interface GetAccessibilitySnapshotResponse {
  snapshot: AccessibilitySnapshot;
}

export interface UpdateAccessibilitySnapshotRequest {
  settings: AccessibilitySettings;
}

export interface UpdateAccessibilitySnapshotResponse {
  snapshot: AccessibilitySnapshot;
}
