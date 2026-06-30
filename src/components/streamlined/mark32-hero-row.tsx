import Link from "next/link";

import type { DashboardHomeData } from "@/modules/dashboard/types";
import {
  getPowerGridLevelIndex,
  getWeeklyGoalProgress,
  pickContinueLearning,
  pickNextExam,
  POWER_GRID_LEVELS,
} from "@/components/streamlined/mark32-dashboard-utils";

interface Mark32HeroRowProps {
  data: DashboardHomeData;
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className="relative grid size-20 place-items-center rounded-full border-[8px] border-teal-100 bg-white text-lg font-semibold text-teal-900 shadow-inner"
      aria-label={`${label}: ${clamped}%`}
    >
      {clamped}%
    </div>
  );
}

export function Mark32HeroRow({ data }: Mark32HeroRowProps) {
  const continueLearning = pickContinueLearning(data);
  const nextExam = pickNextExam(data);
  const dailyGoal = getWeeklyGoalProgress(data.weeklyPlanner);
  const levelIndex = getPowerGridLevelIndex(data.summary.overallLevel);
  const levelProgress = Math.max(
    8,
    Math.min(100, Math.round((levelIndex / POWER_GRID_LEVELS.length) * 100)),
  );

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Study overview">
      <article className="border border-stone-200 bg-white p-5 shadow-sm md:col-span-2 xl:col-span-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Continue learning</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">{continueLearning.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{continueLearning.subtitle}</p>
            <div className="mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-teal-800 transition-all"
                style={{ width: `${continueLearning.progress}%` }}
              />
            </div>
            <Link
              href={continueLearning.href}
              className="mt-4 inline-flex rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              {continueLearning.actionLabel}
            </Link>
          </div>
          <ProgressRing value={continueLearning.progress} label="Continue learning progress" />
        </div>
      </article>

      <article className="border border-sky-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Next exam</p>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">{nextExam.title}</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">{nextExam.detail}</p>
        <Link
          href={nextExam.href}
          className="mt-4 inline-flex border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-900 hover:bg-sky-100"
        >
          View exam
        </Link>
      </article>

      <article className="border border-emerald-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Today&apos;s goal</p>
        <p className="mt-4 text-4xl font-semibold text-emerald-800">{dailyGoal}%</p>
        <p className="text-sm text-stone-600">of weekly planner items complete</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${dailyGoal}%` }} />
        </div>
        <Link href="/progress" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:opacity-80">
          Open planner
        </Link>
      </article>

      <article className="border border-teal-800 bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-50">Power Grid progress</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-teal-800 text-2xl shadow-lg">
            ◆
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{data.summary.overallLevel}</h2>
            <p className="text-sm text-teal-50/90">
              Level {levelIndex} of {POWER_GRID_LEVELS.length}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-teal-950/50">
          <div className="h-full rounded-full bg-amber-300" style={{ width: `${levelProgress}%` }} />
        </div>
        <p className="mt-3 text-sm text-teal-50/90">
          {data.summary.examReadinessScore} / 100 exam readiness
        </p>
      </article>
    </section>
  );
}
