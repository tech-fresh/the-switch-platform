export type PowerGridLevel =
  | "Ignition"
  | "Powered Up"
  | "Current Flow"
  | "Voltage Rising"
  | "Full Circuit"
  | "High Voltage"
  | "Grid Master"
  | "Power Station"
  | "Switch Legend";

export type PowerGridTrend = "improving" | "stable" | "declining";

export interface PowerGridSubjectProgress {
  subject: string;
  subjectId?: string;
  level: PowerGridLevel;
  trend: PowerGridTrend;
  readinessScore: number;
  completionScore: number;
  activeSessionCount: number;
  completedSessionCount: number;
  reviewItemCount: number;
  accessSnapshotCount: number;
  recommendedFocus: string;
  recommendedTopicId?: string;
  subjectHref?: string;
  resumeHref?: string;
  lastActivityAt?: string;
  evidence: string;
}

export interface PowerGridSummary {
  overallLevel: PowerGridLevel;
  overallTrend: PowerGridTrend;
  examReadinessScore: number;
  completedSessionCount: number;
  activeSessionCount: number;
  trackedSubjectCount: number;
  subjectsNeedingAttentionCount: number;
  accessSnapshotCoverage: number;
  latestActivityAt?: string;
  resumeHref?: string;
  nextBestAction: string;
  nextBestActionHref?: string;
  subjectProgress: PowerGridSubjectProgress[];
}
