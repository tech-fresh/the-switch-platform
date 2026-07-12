import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";
import {
  POWER_GRID_RANKS,
  getPowerGridRankPresentation,
} from "@/lib/power-grid/rank-presentation";
import { getPublicRouteHref } from "@/lib/public-route";
import type { PowerGridLevel } from "@/modules/power-grid/types";

interface PremiumPowerGridCardProps {
  /** Legacy backend level — kept for API compatibility; display uses xpTotal. */
  level?: PowerGridLevel;
  readinessScore?: number;
  xpTotal?: number;
  compact?: boolean;
  isAuthenticated?: boolean;
}

export function PremiumPowerGridCard({
  xpTotal = 0,
  readinessScore,
  compact = false,
  isAuthenticated = false,
}: PremiumPowerGridCardProps) {
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
              Power Level {presentation.powerLevel} · {presentation.xpTotal.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div
          className={`mt-4 ${premiumUi.progressTrack}`}
          role="progressbar"
          aria-valuenow={presentation.powerLevelProgressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to next Power Level"
        >
          <div className={premiumUi.progressFill} style={{ width: `${presentation.powerLevelProgressPercentage}%` }} />
        </div>
        <p className="mt-2 text-sm text-[#52646a]">{presentation.nextRankPreview}</p>
      </article>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className={premiumUi.eyebrowAccent}>Power Grid</p>
        <h2 className={`mt-2 ${premiumUi.heading}`}>Earn XP · unlock milestone ranks</h2>
        <p className={`mt-2 max-w-2xl ${premiumUi.body}`}>
          XP is your primary progression currency. Six milestone ranks mark your journey — Power Levels keep motivation
          high between promotions.
          {readinessScore !== undefined ? ` ${readinessScore}/100 exam readiness.` : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      <Link href={getPublicRouteHref("/progress", isAuthenticated)} className={premiumUi.secondaryBtn}>
        View full Power Grid journey
      </Link>
    </section>
  );
}
