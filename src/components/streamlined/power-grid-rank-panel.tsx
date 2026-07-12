import { premiumUi } from "@/components/premium/premium-ui";
import {
  POWER_GRID_RANKS,
  getPowerGridRankPresentation,
  type PowerGridRankPresentation,
} from "@/lib/power-grid/rank-presentation";

interface PowerGridRankPanelProps {
  xpTotal: number;
  compact?: boolean;
  showRankJourney?: boolean;
}

function ProgressBlock({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={premiumUi.body}>{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div
        className={`mt-2 ${premiumUi.progressTrack}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={premiumUi.progressFill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function RankSummary({ presentation }: { presentation: PowerGridRankPresentation }) {
  return (
    <div className="rounded-2xl border border-[#0f766e]/20 bg-gradient-to-br from-[#0f766e]/10 to-[#f7f2ea] p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <span className="text-4xl" aria-hidden="true">
          {presentation.rank.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className={premiumUi.eyebrowAccent}>Current rank</p>
          <p className="text-2xl font-bold text-[#163038]">{presentation.rank.label}</p>
          <p className={`mt-1 ${premiumUi.body}`}>
            Power Level {presentation.powerLevel} · {presentation.xpTotal.toLocaleString()} XP total
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ProgressBlock
          label="Progress within rank"
          value={`${presentation.rankProgressPercentage}%`}
          percentage={presentation.rankProgressPercentage}
        />
        <ProgressBlock
          label="Progress to next Power Level"
          value={
            presentation.xpNeededForNextPowerLevel > 0
              ? `${presentation.xpEarnedInCurrentPowerLevel} / ${presentation.xpEarnedInCurrentPowerLevel + presentation.xpNeededForNextPowerLevel} XP`
              : "Max Power Level"
          }
          percentage={presentation.powerLevelProgressPercentage}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className={premiumUi.statCard}>
          <p className={premiumUi.eyebrow}>Next reward</p>
          <p className="mt-2 text-sm font-semibold text-[#163038]">{presentation.nextReward}</p>
        </div>
        <div className={premiumUi.statCard}>
          <p className={premiumUi.eyebrow}>Next rank</p>
          <p className="mt-2 text-sm font-semibold text-[#163038]">{presentation.nextRankPreview}</p>
        </div>
      </div>
    </div>
  );
}

export function PowerGridRankPanel({ xpTotal, compact = false, showRankJourney = true }: PowerGridRankPanelProps) {
  const presentation = getPowerGridRankPresentation(xpTotal);

  if (compact) {
    return (
      <article className="rounded-2xl border border-[#0f766e]/20 bg-gradient-to-br from-[#0f766e]/10 to-[#f7f2ea] p-5 shadow-sm">
        <p className={premiumUi.eyebrowAccent}>Power Grid</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {presentation.rank.icon}
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#163038]">{presentation.rank.label}</h2>
            <p className="text-sm text-[#52646a]">
              Power Level {presentation.powerLevel} · {presentation.xpTotal} XP
            </p>
          </div>
        </div>
        <div className={`mt-4 ${premiumUi.progressTrack}`}>
          <div className={premiumUi.progressFill} style={{ width: `${presentation.powerLevelProgressPercentage}%` }} />
        </div>
        <p className="mt-2 text-sm text-[#52646a]">{presentation.nextRankPreview}</p>
      </article>
    );
  }

  return (
    <section className={premiumUi.card} aria-label="Power Grid rank progression">
      <div>
        <p className={premiumUi.eyebrowAccent}>Power Grid</p>
        <h2 className={`mt-2 ${premiumUi.heading}`}>XP journey · six milestone ranks</h2>
        <p className={`mt-2 max-w-2xl ${premiumUi.body}`}>
          XP is your primary progression currency. Ranks are major milestones — Power Levels give frequent motivation
          between promotions.
        </p>
      </div>

      {showRankJourney ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POWER_GRID_RANKS.map((rankDef, index) => {
            const isActive = index === presentation.rankIndex;
            const isPast = index < presentation.rankIndex;

            return (
              <div
                key={rankDef.id}
                className={`rounded-2xl border p-4 transition ${
                  isActive
                    ? "border-[#0f766e]/30 bg-[#0f766e]/10"
                    : isPast
                      ? "border-[#3f7d5c]/30 bg-[#3f7d5c]/10"
                      : "border-[#ddd3c6] bg-white"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {rankDef.icon}
                </span>
                <p className="mt-2 text-sm font-bold text-[#163038]">{rankDef.label}</p>
                <p className="mt-1 text-xs text-[#52646a]">{rankDef.xpThreshold.toLocaleString()}+ XP</p>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6">
        <RankSummary presentation={presentation} />
      </div>
    </section>
  );
}
