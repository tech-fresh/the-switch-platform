import type { PowerGridSummary, PowerGridTrend } from "@/modules/power-grid/types";
import type { DailyMotivation } from "@/modules/motivation/service";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "emerald" | "amber" | "sky";
}

export interface DashboardRouteCard {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
  tone: "teal" | "emerald" | "amber" | "sky" | "rose";
}

export interface DashboardSessionCard {
  sessionId: string;
  href: string;
  kind: "exam" | "assessment";
  status: "submitted" | "in-progress";
  title: string;
  subtitle: string;
  completionPercentage: number;
  timeLabel: string;
  statusLabel: string;
  supportLabel: string;
  supportPreferenceChips: string[];
  focusLabel: string;
  reviewCount: number;
  actionLabel: string;
}

export interface DashboardFocusCard {
  subject: string;
  level: string;
  trend: PowerGridTrend;
  readinessScore: number;
  recommendedFocus: string;
  evidence: string;
}

export interface DashboardHomeData {
  summary: PowerGridSummary;
  metrics: DashboardMetric[];
  dailyMotivation: DailyMotivation;
  routeCards: DashboardRouteCard[];
  examSessions: DashboardSessionCard[];
  assessmentSessions: DashboardSessionCard[];
  focusCards: DashboardFocusCard[];
  strongestSubject?: DashboardFocusCard;
  weakestSubject?: DashboardFocusCard;
  recommendedAction: string;
  continuityStatus: "resume-active-session" | "review-submitted-session" | "start-first-session";
  continuityDescription: string;
  continuityHref: string;
  continuityActionLabel: string;
  supportSnapshotSummary: string;
  supportPreferenceChips: string[];
}
