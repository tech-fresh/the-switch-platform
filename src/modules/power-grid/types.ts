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
  level: PowerGridLevel;
  trend: PowerGridTrend;
  readinessScore: number;
  completionScore: number;
  recommendedFocus: string;
  evidence: string;
}

export interface PowerGridSummary {
  overallLevel: PowerGridLevel;
  overallTrend: PowerGridTrend;
  examReadinessScore: number;
  completedSessionCount: number;
  activeSessionCount: number;
  nextBestAction: string;
  subjectProgress: PowerGridSubjectProgress[];
}
