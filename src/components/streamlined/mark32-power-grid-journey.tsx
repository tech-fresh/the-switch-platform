import Link from "next/link";

import { getPowerGridLevelIndex, POWER_GRID_LEVELS } from "@/components/streamlined/mark32-dashboard-utils";
import type { PowerGridLevel } from "@/modules/power-grid/types";

interface Mark32PowerGridJourneyProps {
  currentLevel: PowerGridLevel;
  readinessScore?: number;
  compact?: boolean;
}

export function Mark32PowerGridJourney({
  currentLevel,
  readinessScore,
  compact = false,
}: Mark32PowerGridJourneyProps) {
  const currentIndex = getPowerGridLevelIndex(currentLevel);
  const levelProgress = Math.max(
    8,
    Math.min(100, Math.round((currentIndex / POWER_GRID_LEVELS.length) * 100)),
  );

  return (
    <section
      className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
      aria-label="Power Grid level journey"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Power Grid</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
            Level up as you learn
          </h2>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Nine levels from Ignition to Switch Legend — keep answering questions and completing sessions to
              advance.
            </p>
          ) : null}
        </div>
        {!compact ? (
          <Link href="/progress" className="text-sm font-semibold text-teal-800 hover:opacity-80">
            Open full progress
          </Link>
        ) : null}
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <ol className="flex min-w-[42rem] items-start gap-2 sm:min-w-0 sm:gap-3">
          {POWER_GRID_LEVELS.map((level, index) => {
            const levelNumber = index + 1;
            const isComplete = levelNumber < currentIndex;
            const isCurrent = levelNumber === currentIndex;

            return (
              <li key={level} className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-2 text-center">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                    isCurrent
                      ? "size-12 bg-teal-800 text-white shadow-lg ring-4 ring-teal-100"
                      : isComplete
                        ? "bg-amber-400 text-teal-950"
                        : "border border-stone-200 bg-stone-50 text-stone-500"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? "◆" : levelNumber}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] ${
                    isCurrent ? "text-teal-800" : isComplete ? "text-stone-700" : "text-stone-400"
                  }`}
                >
                  {level}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 rounded-3xl border border-teal-800 bg-gradient-to-br from-teal-900 to-teal-700 p-4 text-white sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-teal-800 text-xl shadow-lg">
            ◆
          </span>
          <div>
            <p className="text-sm font-semibold text-teal-50/90">Current level</p>
            <p className="text-xl font-semibold tracking-tight">{currentLevel}</p>
            <p className="text-sm text-teal-50/90">
              Level {currentIndex} of {POWER_GRID_LEVELS.length}
              {readinessScore !== undefined ? ` · ${readinessScore}/100 readiness` : ""}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-teal-950/50">
          <div className="h-full rounded-full bg-amber-300 transition-all" style={{ width: `${levelProgress}%` }} />
        </div>
        <p className="mt-3 text-sm text-teal-50/90">Keep answering to level up!</p>
      </div>
    </section>
  );
}
