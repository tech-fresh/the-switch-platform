import Link from "next/link";

import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { StudentRouteRecovery } from "@/components/student-route-recovery";
import { SubjectToneChip, subjectToneBlockClasses } from "@/components/subject-tone-chip";
import { WeeklyPlannerGrid } from "@/components/weekly-planner-grid";
import { getProgressSummaryApiData, getWeeklyPlannerApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";
import { resolveCatalogSubjectByLabel, resolveSubjectToneById, resolveSubjectToneByLabel } from "@/lib/subjects/tone";
import type { PowerGridSummary } from "@/modules/power-grid/types";

export const dynamic = "force-dynamic";

function getTrendTone(trend: "improving" | "stable" | "declining"): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

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
      <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Power Grid Progress
          </p>
          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Readiness, trend, and next-step signals from your active sessions.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Your study planner — built from exam and timed assessment activity through the Power
              Grid module.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Overall level</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{summary.overallLevel}</p>
            <p className={`mt-1 text-sm font-medium capitalize ${getTrendTone(summary.overallTrend)}`}>
              {summary.overallTrend}
            </p>
          </div>
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness score</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">
              {summary.examReadinessScore} / 100
            </p>
            <p className="mt-1 text-sm text-stone-600">Built from active revision signals.</p>
          </div>
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Sessions live</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{summary.activeSessionCount}</p>
            <p className="mt-1 text-sm text-stone-600">
              {summary.completedSessionCount} completed, the rest still in motion
            </p>
          </div>
          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Access snapshots</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{summary.accessSnapshotCoverage}%</p>
            <p className="mt-1 text-sm text-stone-600">
              Saved progress carries support settings across study routes
            </p>
          </div>
        </div>
      </section>

      <WeeklyPlannerGrid planner={planner} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          {summary.subjectProgress.map((subject) => {
            const catalogSubject = subject.subjectId
              ? { subjectId: subject.subjectId, name: subject.subject }
              : resolveCatalogSubjectByLabel(subject.subject);
            const tone = catalogSubject?.subjectId
              ? resolveSubjectToneById(catalogSubject.subjectId)
              : resolveSubjectToneByLabel(subject.subject);

            return (
            <article
              key={subject.subject}
              className="grid gap-5 border border-stone-200 bg-white p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <SubjectToneChip label={subject.subject} tone={tone} />
                  <span className={`border px-2 py-1 text-xs font-medium uppercase tracking-[0.2em] ${subjectToneBlockClasses(tone)}`}>
                    {subject.level}
                  </span>
                  <span className={`text-sm font-medium capitalize ${getTrendTone(subject.trend)}`}>
                    {subject.trend}
                  </span>
                </div>
                <p className="text-sm leading-6 text-stone-600">{subject.evidence}</p>
                <div className="border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                  Recommended next focus: {subject.recommendedFocus}
                </div>
                <div className="grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                  <div className="border border-stone-200 bg-stone-50 px-4 py-3">
                    {subject.activeSessionCount} active session
                    {subject.activeSessionCount === 1 ? "" : "s"} and {subject.completedSessionCount}{" "}
                    completed
                  </div>
                  <div className="border border-stone-200 bg-stone-50 px-4 py-3">
                    {subject.reviewItemCount} review item{subject.reviewItemCount === 1 ? "" : "s"} and{" "}
                    {subject.accessSnapshotCount} support snapshot
                    {subject.accessSnapshotCount === 1 ? "" : "s"}
                  </div>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Last activity: {formatActivityTimestamp(subject.lastActivityAt)}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={subject.subjectHref ?? "/subjects"}
                    className="inline-flex items-center justify-center border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
                  >
                    Open subject route
                  </Link>
                  {subject.resumeHref ? (
                    <Link
                      href={subject.resumeHref}
                      className="inline-flex items-center justify-center border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                    >
                      Resume saved work
                    </Link>
                  ) : null}
                  <Link
                    href="/assessments"
                    className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    Start timed practice
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">
                    {subject.readinessScore} / 100
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">
                    {subject.completionScore}%
                  </p>
                </div>
              </div>
            </article>
            );
          })}
        </div>

        <aside className="space-y-6">
          {summary.sourceWarnings.length ? (
            <section className="space-y-3 border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">
                Data watch
              </h3>
              <ul className="space-y-2 text-sm leading-6 text-amber-950">
                {summary.sourceWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-3 border border-stone-200 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Next best action
            </h3>
            <p className="text-sm leading-6 text-stone-700">{summary.nextBestAction}</p>
            <Link
              href={summary.nextBestActionHref ?? "/subjects"}
              className="inline-flex items-center justify-center border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Open next step
            </Link>
          </section>

          <section className="space-y-3 border border-stone-200 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Autosave health
            </h3>
            <ul className="space-y-2 text-sm leading-6 text-stone-600">
              <li>{summary.trackedSubjectCount} tracked subjects are contributing evidence.</li>
              <li>{summary.subjectsNeedingAttentionCount} subjects currently need extra focus.</li>
              <li>Latest activity: {formatActivityTimestamp(summary.latestActivityAt)}.</li>
            </ul>
            {summary.resumeHref ? (
              <Link
                href={summary.resumeHref}
                className="inline-flex items-center justify-center border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Resume most recent session
              </Link>
            ) : null}
          </section>
        </aside>
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
      <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
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
