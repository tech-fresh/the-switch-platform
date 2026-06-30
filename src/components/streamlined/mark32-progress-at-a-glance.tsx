import Link from "next/link";

import { mark32Ui } from "@/components/streamlined/mark32-ui";
import type { PowerGridLevel, PowerGridSummary } from "@/modules/power-grid/types";

interface Mark32ProgressAtAGlanceProps {
  summary: Pick<
    PowerGridSummary,
    | "overallLevel"
    | "overallTrend"
    | "examReadinessScore"
    | "activeSessionCount"
    | "completedSessionCount"
    | "nextBestAction"
    | "nextBestActionHref"
    | "resumeHref"
  >;
}

function getTrendLabel(trend: PowerGridSummary["overallTrend"]): string {
  if (trend === "improving") {
    return "Improving";
  }

  if (trend === "declining") {
    return "Needs focus";
  }

  return "Steady";
}

export function Mark32ProgressAtAGlance({ summary }: Mark32ProgressAtAGlanceProps) {
  const readinessWidth = Math.max(4, Math.min(100, summary.examReadinessScore));

  return (
    <section className={`${mark32Ui.card} grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]`}>
      <div className="space-y-5">
        <div>
          <p className={mark32Ui.eyebrow}>Progress at a glance</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
            {summary.overallLevel} · {getTrendLabel(summary.overallTrend)}
          </h2>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
            <span>Exam readiness</span>
            <span className="font-semibold text-stone-950">{summary.examReadinessScore} / 100</span>
          </div>
          <div
            className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100"
            role="progressbar"
            aria-valuenow={summary.examReadinessScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Exam readiness score"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-500 transition-all"
              style={{ width: `${readinessWidth}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Active sessions</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">{summary.activeSessionCount}</p>
            <p className="mt-1 text-sm text-stone-600">{summary.completedSessionCount} completed</p>
          </div>
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Current level</p>
            <p className="mt-2 text-lg font-semibold leading-tight text-stone-950">{summary.overallLevel}</p>
            <p className="mt-1 text-sm capitalize text-stone-600">{summary.overallTrend} trend</p>
          </div>
        </div>
      </div>

      <aside className="flex flex-col justify-between gap-4 rounded-3xl border border-teal-800 bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">Next best step</p>
          <p className="mt-3 text-lg font-semibold leading-snug">{summary.nextBestAction}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={summary.nextBestActionHref ?? "/subjects"}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-teal-900 hover:bg-teal-50"
          >
            Open next step
          </Link>
          {summary.resumeHref ? (
            <Link
              href={summary.resumeHref}
              className="inline-flex items-center justify-center rounded-2xl border border-teal-200/40 bg-teal-950/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-950/40"
            >
              Resume session
            </Link>
          ) : null}
        </div>
      </aside>
    </section>
  );
}

export type { PowerGridLevel };
