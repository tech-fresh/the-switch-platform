import { resolveCatalogSubjectByLabel, resolveSubjectToneById, resolveSubjectToneByLabel } from "@/lib/subjects/tone";
import { listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";
import { buildDashboardSetupSummary, getOnboardingOverview } from "@/modules/onboarding/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import type { PowerGridSubjectProgress } from "@/modules/power-grid/types";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import type { SavedProgressSessionSummary } from "@/modules/saved-progress/types";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { ExamPaper } from "@/modules/exam-engine/types";
import type {
  WeeklyPlannerDay,
  WeeklyPlannerItem,
  WeeklyPlannerSummary,
} from "./types";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export async function getWeeklyPlannerSummary(
  options?: {
    userId?: string;
    referenceDate?: Date;
  },
): Promise<WeeklyPlannerSummary> {
  const userId = options?.userId ?? "student-demo";
  const referenceDate = options?.referenceDate ?? new Date();

  const [savedProgress, summary, onboardingOverview] = await Promise.all([
    getSavedProgressOverview({ userId }),
    getMockPowerGridSummary({ userId }),
    userId === "guest-preview" ? Promise.resolve(null) : getOnboardingOverview(userId),
  ]);

  const setup = buildDashboardSetupSummary(onboardingOverview?.profile ?? null);
  const papers = listStudentVisibleExamPapers();
  const assessments = getMockTimedAssessments();
  const weekStart = getWeekStart(referenceDate);
  const days = buildWeekDays(weekStart, referenceDate);
  const dayMap = new Map(days.map((day) => [day.dayKey, day]));

  for (const session of savedProgress.sessions) {
    const item = buildPlannerItemFromSession(session, papers, assessments);

    if (!item || !isSubjectAllowed(item.subjectId, item.subject, setup.subjectFilterIds)) {
      continue;
    }

    const dayKey = toDayKey(new Date(session.lastActivityAt));
    const day = dayMap.get(dayKey);

    if (day) {
      day.items.push(item);
    }
  }

  const recommendedSubjects = pickRecommendedSubjects(summary.subjectProgress, setup.subjectFilterIds);
  scheduleRecommendedItems(days, recommendedSubjects, summary);

  for (const day of days) {
    day.items.sort(sortPlannerItems);
  }

  const scheduledCount = days.reduce((total, day) => total + day.items.length, 0);

  return {
    weekLabel: formatWeekLabel(weekStart),
    days,
    emptyStateMessage:
      scheduledCount === 0
        ? "No saved sessions yet this week. Start an exam or timed assessment to populate your planner."
        : undefined,
    dataSourceSummary: `${savedProgress.sessionCount} saved session${
      savedProgress.sessionCount === 1 ? "" : "s"
    } • ${summary.subjectProgress.length} Power Grid subject${
      summary.subjectProgress.length === 1 ? "" : "s"
    }`,
  };
}

function buildWeekDays(weekStart: Date, referenceDate: Date): WeeklyPlannerDay[] {
  const todayKey = toDayKey(referenceDate);

  return WEEKDAY_LABELS.map((weekdayLabel, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dayKey = toDayKey(date);

    return {
      dayKey,
      weekdayLabel,
      isToday: dayKey === todayKey,
      items: [],
    };
  });
}

function buildPlannerItemFromSession(
  session: SavedProgressSessionSummary,
  papers: ExamPaper[],
  assessments: ReturnType<typeof getMockTimedAssessments>,
): WeeklyPlannerItem | null {
  if (session.entityType === "exam-session") {
    const examId = session.entityId.replace(/-session-\d+$/, "");
    const paper = papers.find((candidate) => candidate.examId === examId);

    if (!paper) {
      return null;
    }

    const catalogSubject = resolveCatalogSubjectByLabel(paper.subject);

    return {
      itemId: session.progressId,
      kind: "exam",
      subject: catalogSubject?.name ?? paper.subject,
      subjectId: catalogSubject?.subjectId,
      tone: catalogSubject ? resolveSubjectToneById(catalogSubject.subjectId) : resolveSubjectToneByLabel(paper.subject),
      title: session.title,
      subtitle: session.subtitle,
      href: session.href,
      status: session.status === "submitted" ? "completed" : "scheduled",
      sourceLabel: "Saved exam",
    };
  }

  const assessment = assessments.find((candidate) =>
    session.entityId.startsWith(`${candidate.assessmentId}-attempt-`),
  );

  if (!assessment) {
    return null;
  }

  const catalogSubject = resolveCatalogSubjectByLabel(assessment.subject);

  return {
    itemId: session.progressId,
    kind: "assessment",
    subject: catalogSubject?.name ?? assessment.subject,
    subjectId: catalogSubject?.subjectId,
    tone: catalogSubject
      ? resolveSubjectToneById(catalogSubject.subjectId)
      : resolveSubjectToneByLabel(assessment.subject),
    title: session.title,
    subtitle: session.subtitle,
    href: session.href,
    status: session.status === "submitted" ? "completed" : "scheduled",
    sourceLabel: "Timed practice",
  };
}

function pickRecommendedSubjects(
  subjects: PowerGridSubjectProgress[],
  subjectFilterIds: string[],
): PowerGridSubjectProgress[] {
  const filtered = subjects.filter((subject) =>
    isSubjectAllowed(subject.subjectId, subject.subject, subjectFilterIds),
  );

  return [...filtered]
    .sort((left, right) => {
      if (left.trend === "declining" && right.trend !== "declining") {
        return -1;
      }

      if (right.trend === "declining" && left.trend !== "declining") {
        return 1;
      }

      return left.readinessScore - right.readinessScore;
    })
    .slice(0, 3);
}

function scheduleRecommendedItems(
  days: WeeklyPlannerDay[],
  subjects: PowerGridSubjectProgress[],
  summary: Awaited<ReturnType<typeof getMockPowerGridSummary>>,
): void {
  const todayIndex = days.findIndex((day) => day.isToday);
  const startIndex = todayIndex >= 0 ? todayIndex : 0;
  let subjectIndex = 0;

  for (let dayOffset = startIndex; dayOffset < days.length && subjectIndex < subjects.length; dayOffset += 1) {
    const day = days[dayOffset];

    if (day.items.length > 0) {
      continue;
    }

    const subject = subjects[subjectIndex];
    subjectIndex += 1;
    const catalogSubject = subject.subjectId
      ? { subjectId: subject.subjectId, name: subject.subject }
      : resolveCatalogSubjectByLabel(subject.subject);

    day.items.push({
      itemId: `recommended-${subject.subject}-${day.dayKey}`,
      kind: "recommended",
      subject: catalogSubject?.name ?? subject.subject,
      subjectId: catalogSubject?.subjectId ?? subject.subjectId,
      tone: catalogSubject?.subjectId
        ? resolveSubjectToneById(catalogSubject.subjectId)
        : resolveSubjectToneByLabel(subject.subject),
      title: subject.recommendedFocus,
      subtitle: subject.evidence,
      href: subject.resumeHref ?? subject.subjectHref ?? summary.nextBestActionHref ?? "/assessments",
      status: "recommended",
      sourceLabel: "Power Grid",
    });
  }
}

function isSubjectAllowed(
  subjectId: string | undefined,
  subjectLabel: string,
  subjectFilterIds: string[],
): boolean {
  if (subjectFilterIds.length === 0) {
    return true;
  }

  if (subjectId && subjectFilterIds.includes(subjectId)) {
    return true;
  }

  const catalogSubject = resolveCatalogSubjectByLabel(subjectLabel);

  return catalogSubject ? subjectFilterIds.includes(catalogSubject.subjectId) : false;
}

function getWeekStart(referenceDate: Date): Date {
  const date = new Date(referenceDate);
  const weekday = date.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;

  date.setDate(date.getDate() + mondayOffset);
  date.setHours(0, 0, 0, 0);

  return date;
}

function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  const endFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: weekStart.getFullYear() === weekEnd.getFullYear() ? undefined : "numeric",
  });

  return `${startFormatter.format(weekStart)}–${endFormatter.format(weekEnd)}`;
}

function sortPlannerItems(left: WeeklyPlannerItem, right: WeeklyPlannerItem): number {
  const statusOrder = { scheduled: 0, recommended: 1, completed: 2 };

  return statusOrder[left.status] - statusOrder[right.status];
}
