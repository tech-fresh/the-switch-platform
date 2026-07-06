import Link from "next/link";

import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { Mark32PowerGridJourney } from "@/components/streamlined/mark32-power-grid-journey";
import { Mark32ProgressAtAGlance } from "@/components/streamlined/mark32-progress-at-a-glance";
import { Mark32SubjectProgressCard } from "@/components/streamlined/mark32-subject-progress-card";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
import { StudentRouteRecovery } from "@/components/student-route-recovery";
import { WeeklyPlannerGrid } from "@/components/weekly-planner-grid";
import { getProgressSummaryApiData, getWeeklyPlannerApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";
import type { PowerGridSummary } from "@/modules/power-grid/types";

export const dynamic = "force-dynamic";

function formatActivityTimestamp(value?: string): string {
  if (!value) {
    return "No saved activity yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProgressMainContent({
  summary,
  planner,
}: {
  summary: PowerGridSummary;
  planner: Awaited<ReturnType<typeof getWeeklyPlannerApiData>>;
}) {
  return (
    <>
      <Mark32PageHeader
        eyebrow="Progress"
        eyebrowTone="teal"
        title="See where you are, then open the next best study step."
        description="Power Grid level, weekly planner, and subject readiness — all from your saved sessions."
      />

      <Mark32PowerGridJourney
        currentLevel={summary.overallLevel}
        readinessScore={summary.examReadinessScore}
        xpTotal={summary.xpTotal}
        voltagePointsTotal={summary.voltagePointsTotal}
      />

      <Mark32ProgressAtAGlance summary={summary} />

      <WeeklyPlannerGrid planner={planner} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={mark32Ui.eyebrow}>Subject progress</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white">Your active subjects</h2>
          </div>
          <p className="text-sm text-stone-600">
            {summary.trackedSubjectCount} tracked · {summary.subjectsNeedingAttentionCount} need extra focus
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {summary.subjectProgress.map((subject) => (
            <Mark32SubjectProgressCard key={subject.subject} subject={subject} />
          ))}
        </div>
      </section>

      {summary.sourceWarnings.length ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Data watch</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
            {summary.sourceWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={`${mark32Ui.cardMuted} flex flex-wrap items-center justify-between gap-4 text-sm text-stone-600`}>
        <p>
          Latest activity: {formatActivityTimestamp(summary.latestActivityAt)} · Access snapshots at{" "}
          {summary.accessSnapshotCoverage}%
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/assessments" className={mark32Ui.secondaryBtn}>
            Start timed practice
          </Link>
          {summary.resumeHref ? (
            <Link href={summary.resumeHref} className={mark32Ui.linkAccent}>
              Resume most recent session
            </Link>
          ) : null}
        </div>
      </section>
    </>
  );
}

export default async function ProgressPage() {
  const shell = await requireStudentAppRouteContext();

  try {
    const [summary, planner] = await Promise.all([
      getProgressSummaryApiData(),
      getWeeklyPlannerApiData(),
    ]);

    if (summary.dataState === "degraded" || summary.subjectProgress.length === 0) {
      return (
        <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
          <StudentRouteRecovery
            eyebrow="Power Grid recovery"
            title={summary.recoveryTitle ?? "Power Grid progress is not ready yet."}
            description={
              summary.recoveryDescription ??
              "The progress route loaded without enough reliable subject evidence to build a safe readiness summary."
            }
            warnings={summary.sourceWarnings}
            actions={[
              { href: summary.resumeHref ?? "/saved-progress", label: "Open saved progress", variant: "primary" },
              { href: summary.nextBestActionHref ?? "/assessments", label: "Start next safe route", variant: "secondary" },
              { href: "/dashboard", label: "Return to dashboard", variant: "secondary" },
            ]}
          />
        </StudentAppShell>
      );
    }

    return (
      <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips} xpTotal={summary.xpTotal}>
        <div className="flex flex-col gap-8">
          <ProgressMainContent summary={summary} planner={planner} />
        </div>
      </StudentAppShell>
    );
  } catch {
    return (
      <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
        <StudentRouteRecovery
          eyebrow="Power Grid recovery"
          title="The Power Grid route could not finish loading."
          description="The progress route could not build a safe readiness summary from the current saved or linked activity data. The safest next step is to resume a known-good saved session or return to the dashboard."
        />
      </StudentAppShell>
    );
  }
}
