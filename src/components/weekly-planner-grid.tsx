import Link from "next/link";

import { SubjectToneChip, subjectToneBlockClasses } from "@/components/subject-tone-chip";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
import type { WeeklyPlannerSummary } from "@/modules/weekly-planner/types";

interface WeeklyPlannerGridProps {
  planner: WeeklyPlannerSummary;
  compact?: boolean;
}

export function WeeklyPlannerGrid({ planner, compact = false }: WeeklyPlannerGridProps) {
  return (
    <section className={mark32Ui.card}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={mark32Ui.eyebrowSm}>Weekly planner</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{planner.weekLabel}</h2>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{planner.dataSourceSummary}</p>
      </div>

      <div className={`mt-5 grid gap-2 ${compact ? "grid-cols-7" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"}`}>
        {planner.days.map((day) => (
          <div
            key={day.dayKey}
            className={`min-h-[7.5rem] rounded-xl border p-2 ${
              day.isToday ? "border-teal-300 bg-teal-50/70" : "border-stone-200 bg-stone-50/80"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {day.weekdayLabel}
              </p>
              {day.isToday ? (
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-700">Today</span>
              ) : null}
            </div>

            <div className="mt-2 space-y-2">
              {day.items.length ? (
                day.items.map((item) => (
                  <Link
                    key={item.itemId}
                    href={item.href}
                    className={`block rounded-lg border p-2 transition hover:shadow-sm ${subjectToneBlockClasses(item.tone)}`}
                  >
                    <SubjectToneChip label={item.subject} tone={item.tone} />
                    <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-4">{item.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-80">{item.sourceLabel}</p>
                  </Link>
                ))
              ) : (
                <p className="text-[10px] leading-4 text-slate-500">No items yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {planner.emptyStateMessage ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">{planner.emptyStateMessage}</p>
      ) : null}
    </section>
  );
}
