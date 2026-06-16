export type GovernanceStatus = "ready" | "watch";
export type GovernanceRecordSource = "seeded" | "runtime" | "manual";

export interface GovernanceReviewRecord {
  reviewId: string;
  title: string;
  status: GovernanceStatus;
  completedAt: string | null;
  owner: string;
  note: string;
  environment: string | null;
  source: GovernanceRecordSource;
}

export interface GovernanceOwnershipArea {
  areaId: string;
  area: string;
  primaryOwner: string;
  backupOwner: string;
  responsibility: string;
}

export interface GovernanceSmokeCheck {
  checkId: string;
  route: string;
  status: GovernanceStatus;
  note: string;
  owner: string | null;
  recordedAt: string | null;
  environment: string | null;
  source: GovernanceRecordSource;
}

export interface GovernanceFollowUpLoop {
  loopId: string;
  title: string;
  cadence: string;
  owner: string;
  purpose: string;
}

export interface GovernanceEnvironmentCheck {
  checkId: string;
  label: string;
  status: GovernanceStatus;
  detail: string;
  owner: string | null;
  recordedAt: string | null;
  environment: string | null;
  source: GovernanceRecordSource;
}

export interface GovernanceSignOffCheck {
  checkId: string;
  label: string;
  status: GovernanceStatus;
  owner: string;
  detail: string;
  recordedAt: string | null;
  environment: string | null;
  source: GovernanceRecordSource;
}

export interface GovernanceEvidenceRecord {
  evidenceId: string;
  title: string;
  area:
    | "auth"
    | "persistence"
    | "editorial"
    | "environment"
    | "smoke"
    | "signoff";
  status: "recorded" | "still-needed";
  recordedAt: string | null;
  owner: string;
  summary: string;
  environment: string | null;
  source: GovernanceRecordSource;
}

export interface GovernanceCloseoutItem {
  itemId: string;
  status: "done" | "remaining";
  title: string;
  detail: string;
}

export interface GovernanceFinalPathSummary {
  label: string;
  codeCompleteCount: number;
  totalCount: number;
  estimatedCompletionRange: string;
  note: string;
  biggestBlockers: string[];
  closeoutItems: GovernanceCloseoutItem[];
}

export interface LaunchGovernanceOverview {
  overallStatus: GovernanceStatus;
  reviews: GovernanceReviewRecord[];
  ownership: GovernanceOwnershipArea[];
  smokeChecks: GovernanceSmokeCheck[];
  environmentChecks: GovernanceEnvironmentCheck[];
  signOffChecks: GovernanceSignOffCheck[];
  evidenceRecords: GovernanceEvidenceRecord[];
  followUpLoops: GovernanceFollowUpLoop[];
  finalPathSummary: GovernanceFinalPathSummary;
}

export interface StoredGovernanceReviewRecord {
  kind: "review";
  targetId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt: string;
}

export interface StoredGovernanceSignOffRecord {
  kind: "signoff";
  targetId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt: string;
}

export interface StoredGovernanceEvidenceRecord {
  kind: "evidence";
  targetId: string;
  status: "recorded" | "still-needed";
  owner: string;
  summary: string;
  environment: string;
  recordedAt: string;
}

export interface StoredGovernanceEnvironmentRecord {
  kind: "environment";
  targetId: string;
  status: GovernanceStatus;
  owner: string;
  detail: string;
  environment: string;
  recordedAt: string;
}

export interface StoredGovernanceSmokeRecord {
  kind: "smoke";
  targetId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt: string;
}

export type StoredGovernanceRecord =
  | StoredGovernanceReviewRecord
  | StoredGovernanceSignOffRecord
  | StoredGovernanceEvidenceRecord
  | StoredGovernanceEnvironmentRecord
  | StoredGovernanceSmokeRecord;
