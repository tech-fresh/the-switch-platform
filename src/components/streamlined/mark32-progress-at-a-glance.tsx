import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";
import { getPowerGridRankPresentation } from "@/lib/power-grid/rank-presentation";
import type { PowerGridSummary } from "@/modules/power-grid/types";

interface Mark32ProgressAtAGlanceProps {
  summary: Pick<
    PowerGridSummary,
    | "overallLevel"
    | "overallTrend"
    | "examReadinessScore"
    | "activeSessionCount"
    | "completedSessionCount"
    | "quizAttemptCount"
    | "quizCorrectCount"
    | "quizAccuracyPercentage"
    | "xpTotal"
    | "voltagePointsTotal"
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
  const rank = getPowerGridRankPresentation(summary.xpTotal);

  return (
    <section className={`${premiumUi.card} grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]`}>
      <div className="space-y-5">
        <div>
          <p className={premiumUi.eyebrowAccent}>Progress at a glance</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>
            {rank.rank.icon} {rank.rank.label} · {getTrendLabel(summary.overallTrend)}
          </h2>
          <p className={`mt-1 ${premiumUi.body}`}>
            Power Level {rank.powerLevel} · {summary.xpTotal.toLocaleString()} XP · {summary.voltagePointsTotal.toLocaleString()}{" "}
            voltage points
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className={premiumUi.body}>Exam readiness</span>
            <span className="font-semibold text-white">{summary.examReadinessScore} / 100</span>
          </div>
          <div
            className={`mt-2 ${premiumUi.progressTrack}`}
            role="progressbar"
            aria-valuenow={summary.examReadinessScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Exam readiness score"
          >
            <div className={premiumUi.progressFill} style={{ width: `${readinessWidth}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className={premiumUi.body}>Next Power Level</span>
            <span className="font-semibold text-white">
              {rank.xpNeededForNextPowerLevel > 0 ? `${rank.xpNeededForNextPowerLevel} XP to go` : "Max level in rank"}
            </span>
          </div>
          <div
            className={`mt-2 ${premiumUi.progressTrack}`}
            role="progressbar"
            aria-valuenow={rank.powerLevelProgressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress to next Power Level"
          >
            <div className={premiumUi.progressFill} style={{ width: `${rank.powerLevelProgressPercentage}%` }} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={premiumUi.statCard}>
            <p className={premiumUi.eyebrow}>Active sessions</p>
            <p className="mt-2 text-2xl font-semibold text-white">{summary.activeSessionCount}</p>
            <p className={`mt-1 ${premiumUi.body}`}>{summary.completedSessionCount} completed</p>
          </div>
          <div className={premiumUi.statCard}>
            <p className={premiumUi.eyebrow}>Next reward</p>
            <p className="mt-2 text-lg font-semibold leading-tight text-white">{rank.nextReward}</p>
            <p className={`mt-1 capitalize ${premiumUi.body}`}>{summary.overallTrend} trend</p>
          </div>
          <div className={premiumUi.statCard}>
            <p className={premiumUi.eyebrow}>Quiz totals</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {summary.quizCorrectCount}/{summary.quizAttemptCount || 0}
            </p>
            <p className={`mt-1 ${premiumUi.body}`}>{summary.quizAccuracyPercentage}% accuracy</p>
          </div>
          <div className={premiumUi.statCard}>
            <p className={premiumUi.eyebrow}>Next rank</p>
            <p className="mt-2 text-sm font-semibold leading-tight text-white">{rank.nextRankPreview}</p>
            <p className={`mt-1 ${premiumUi.body}`}>Evidence level: {summary.overallLevel}</p>
          </div>
        </div>
      </div>

      <aside className="flex flex-col justify-between gap-4 rounded-3xl border border-[#6C4EFF]/40 bg-gradient-to-br from-[#6C4EFF]/30 to-[#121826] p-5 text-white">
        <div>
          <p className={premiumUi.eyebrowAccent}>Next best step</p>
          <p className="mt-3 text-lg font-semibold leading-snug">{summary.nextBestAction}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={summary.nextBestActionHref ?? "/subjects"} className={premiumUi.primaryBtn}>
            Open next step
          </Link>
          {summary.resumeHref ? (
            <Link
              href={summary.resumeHref}
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
            >
              Resume session
            </Link>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
