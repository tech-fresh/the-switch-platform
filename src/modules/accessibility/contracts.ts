import type { AccessibilitySnapshot } from "./types";

export type AccessibilityContractRoute = "GET /accessibility/snapshot";

export interface GetAccessibilitySnapshotResponse {
  snapshot: AccessibilitySnapshot;
}
