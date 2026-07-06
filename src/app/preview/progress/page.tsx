import Link from "next/link";

import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { Mark32SubjectProgressCard } from "@/components/streamlined/mark32-subject-progress-card";
import { WeeklyPlannerGrid } from "@/components/weekly-planner-grid";
import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getWeeklyPlannerSummary } from "@/modules/weekly-planner/service";

const PREVIEW_PREFIX = "/preview";

export default async function PreviewProgressPage() {
  const dashboardData = buildMockPreviewDashboardData();
  const [summary, planner] = await Promise.all([
    getMockPowerGridSummary({ userId: "guest-preview" }),
    getWeeklyPlannerSummary({ userId: "guest-preview" }),
  ]);

  return (
    <StudentAppShell
      displayName="Preview student"
      powerGridLevel={dashboardData.summary.overallLevel}
      xpTotal={summary.xpTotal}
      hrefPrefix={PREVIEW_PREFIX}
      showUtilityLinks={false}
      accountHref="/preview/account"
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Progress preview</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Open the Power Grid and weekly planner inside preview.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            These cards are driven by the same mock progress signals as the main app, but all route actions stay
            inside the preview namespace.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-600">
            <span>{summary.examReadinessScore} / 100 readiness</span>
            <span>{summary.trackedSubjectCount} tracked subjects</span>
            <span>{summary.activeSessionCount} active sessions</span>
          </div>
        </section>

        <WeeklyPlannerGrid planner={planner} hrefPrefix={PREVIEW_PREFIX} />

        <section className="grid gap-4 xl:grid-cols-2">
          {summary.subjectProgress.map((subject) => (
            <Mark32SubjectProgressCard key={subject.subject} subject={subject} hrefPrefix={PREVIEW_PREFIX} />
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Continue</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/preview/subjects"
              className="rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Return to subjects
            </Link>
            <Link
              href="/preview/exams"
              className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
            >
              Open exams preview
            </Link>
          </div>
        </section>
      </div>
    </StudentAppShell>
  );
}
