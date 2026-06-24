import type { NavAccent } from "@/components/mock-idea/brand-tokens";

export type WeeklyPlannerItemKind = "exam" | "assessment" | "recommended";
export type WeeklyPlannerItemStatus = "scheduled" | "completed" | "recommended";

export interface WeeklyPlannerItem {
  itemId: string;
  kind: WeeklyPlannerItemKind;
  subject: string;
  subjectId?: string;
  tone: NavAccent;
  title: string;
  subtitle: string;
  href: string;
  status: WeeklyPlannerItemStatus;
  sourceLabel: string;
}

export interface WeeklyPlannerDay {
  dayKey: string;
  weekdayLabel: string;
  isToday: boolean;
  items: WeeklyPlannerItem[];
}

export interface WeeklyPlannerSummary {
  weekLabel: string;
  days: WeeklyPlannerDay[];
  emptyStateMessage?: string;
  dataSourceSummary: string;
}
