import type { DashboardHomeData, DashboardSessionCard } from "@/modules/dashboard/types";
import type { PowerGridLevel } from "@/modules/power-grid/types";
import type { WeeklyPlannerSummary } from "@/modules/weekly-planner/types";

export const POWER_GRID_LEVELS: PowerGridLevel[] = [
  "Ignition",
  "Powered Up",
  "Current Flow",
  "Voltage Rising",
  "Full Circuit",
  "High Voltage",
  "Grid Master",
  "Power Station",
  "Switch Legend",
];

export function getPowerGridLevelIndex(level: PowerGridLevel): number {
  const index = POWER_GRID_LEVELS.indexOf(level);
  return index >= 0 ? index + 1 : 1;
}

export function getWeeklyGoalProgress(planner: WeeklyPlannerSummary): number {
  const items = planner.days.flatMap((day) => day.items);

  if (!items.length) {
    return 0;
  }

  const completed = items.filter((item) => item.status === "completed").length;
  return Math.round((completed / items.length) * 100);
}

export function getStudyDaysThisWeek(planner: WeeklyPlannerSummary): number {
  return planner.days.filter((day) => day.items.some((item) => item.status === "completed")).length;
}

export function pickContinueLearning(data: DashboardHomeData): {
  title: string;
  subtitle: string;
  progress: number;
  href: string;
  actionLabel: string;
} {
  const activeSessions = pickRecentSessions(data, 1);
  const active = activeSessions[0];

  if (active) {
    return {
      title: active.title,
      subtitle: active.subtitle,
      progress: active.completionPercentage,
      href: active.href,
      actionLabel: active.actionLabel,
    };
  }

  return {
    title: data.recommendedAction,
    subtitle: data.continuityDescription,
    progress: data.summary.examReadinessScore,
    href: data.continuityHref,
    actionLabel: data.continuityActionLabel,
  };
}

export function pickNextExam(data: DashboardHomeData): {
  title: string;
  detail: string;
  href: string;
} {
  const inProgressExam =
    data.examSessions.find((session) => session.status === "in-progress") ?? data.examSessions[0];

  if (inProgressExam) {
    return {
      title: inProgressExam.title,
      detail:
        inProgressExam.status === "in-progress"
          ? `${inProgressExam.completionPercentage}% complete`
          : "Ready in exam lobby",
      href: inProgressExam.href,
    };
  }

  return {
    title: "Full GCSE papers",
    detail: "Open the exam lobby to choose a paper",
    href: "/exams",
  };
}

export function pickWeakestTopics(data: DashboardHomeData, limit = 3) {
  return [...data.focusCards]
    .sort((left, right) => left.readinessScore - right.readinessScore)
    .slice(0, limit)
    .map((card) => ({
      subject: card.subject,
      subjectId: card.subjectId,
      focus: card.recommendedFocus,
      score: card.readinessScore,
      href: card.subjectId ? `/subjects?subjectId=${encodeURIComponent(card.subjectId)}` : "/subjects",
    }));
}

function pickRecentSessions(data: DashboardHomeData, limit: number): DashboardSessionCard[] {
  return [...data.examSessions, ...data.assessmentSessions]
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "in-progress" ? -1 : 1;
      }

      return right.completionPercentage - left.completionPercentage;
    })
    .slice(0, limit);
}
