export type GovernanceStatus = "ready" | "watch";

export interface GovernanceReviewRecord {
  reviewId: string;
  title: string;
  status: GovernanceStatus;
  completedAt: string;
  owner: string;
  note: string;
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
}

export interface GovernanceSignOffCheck {
  checkId: string;
  label: string;
  status: GovernanceStatus;
  owner: string;
  detail: string;
}

export interface LaunchGovernanceOverview {
  overallStatus: GovernanceStatus;
  reviews: GovernanceReviewRecord[];
  ownership: GovernanceOwnershipArea[];
  smokeChecks: GovernanceSmokeCheck[];
  environmentChecks: GovernanceEnvironmentCheck[];
  signOffChecks: GovernanceSignOffCheck[];
  followUpLoops: GovernanceFollowUpLoop[];
}
