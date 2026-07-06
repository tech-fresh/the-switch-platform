import Link from "next/link";

import { PowerGridRankPanel } from "@/components/streamlined/power-grid-rank-panel";
import { premiumUi } from "@/components/premium/premium-ui";
import type { PowerGridLevel } from "@/modules/power-grid/types";

interface Mark32PowerGridJourneyProps {
  /** Legacy backend level — kept for API compatibility; display uses xpTotal. */
  currentLevel?: PowerGridLevel;
  readinessScore?: number;
  xpTotal?: number;
  voltagePointsTotal?: number;
  compact?: boolean;
}

export function Mark32PowerGridJourney({
  xpTotal = 0,
  voltagePointsTotal,
  compact = false,
}: Mark32PowerGridJourneyProps) {
  if (compact) {
    return <PowerGridRankPanel xpTotal={xpTotal} compact />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div />
        <Link href="/progress" className={premiumUi.linkAccent}>
          Open full progress →
        </Link>
      </div>
      <PowerGridRankPanel xpTotal={xpTotal} showRankJourney />
      {voltagePointsTotal !== undefined ? (
        <p className={`text-center ${premiumUi.body}`}>{voltagePointsTotal.toLocaleString()} voltage points earned</p>
      ) : null}
    </div>
  );
}
