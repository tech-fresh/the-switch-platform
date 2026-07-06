/**
 * Power Grid rank presentation — UI-only mapping from existing xpTotal.
 * Does not change XP calculations, services, APIs, or persistence.
 */

export interface PowerGridRankDefinition {
  id: string;
  label: string;
  icon: string;
  xpThreshold: number;
  nextReward: string;
}

/** Six milestone ranks — XP thresholds are presentation-only tier boundaries. */
export const POWER_GRID_RANKS: PowerGridRankDefinition[] = [
  { id: "switch-on", label: "Switch On", icon: "💡", xpThreshold: 0, nextReward: "Daily streak badge" },
  { id: "locked-in", label: "Locked In", icon: "🔥", xpThreshold: 150, nextReward: "Focus accent unlock" },
  { id: "level-up", label: "Level Up", icon: "📈", xpThreshold: 350, nextReward: "Progress ring style" },
  { id: "power-mode", label: "Power Mode", icon: "⚡", xpThreshold: 650, nextReward: "Dashboard highlight" },
  { id: "top-performer", label: "Top Performer", icon: "🏆", xpThreshold: 1000, nextReward: "Profile prestige frame" },
  { id: "switch-legend", label: "Switch Legend", icon: "👑", xpThreshold: 1500, nextReward: "Maximum legend badge" },
];

export const POWER_LEVELS_PER_RANK = 10;

export interface PowerGridRankPresentation {
  xpTotal: number;
  rankIndex: number;
  rank: PowerGridRankDefinition;
  nextRank: PowerGridRankDefinition | null;
  powerLevel: number;
  xpEarnedInRank: number;
  xpNeededForNextRank: number;
  xpEarnedInCurrentPowerLevel: number;
  xpNeededForNextPowerLevel: number;
  rankProgressPercentage: number;
  powerLevelProgressPercentage: number;
  nextReward: string;
  nextRankPreview: string;
  isMaxRank: boolean;
}

function getLegendTierSpan(): number {
  return 500;
}

export function getPowerGridRankPresentation(xpTotal: number): PowerGridRankPresentation {
  const xp = Math.max(0, Math.floor(xpTotal));

  let rankIndex = 0;
  for (let index = POWER_GRID_RANKS.length - 1; index >= 0; index -= 1) {
    if (xp >= POWER_GRID_RANKS[index].xpThreshold) {
      rankIndex = index;
      break;
    }
  }

  const rank = POWER_GRID_RANKS[rankIndex];
  const nextRank = POWER_GRID_RANKS[rankIndex + 1] ?? null;
  const tierStart = rank.xpThreshold;
  const tierEnd = nextRank?.xpThreshold ?? tierStart + getLegendTierSpan();
  const tierSpan = Math.max(1, tierEnd - tierStart);
  const xpEarnedInRank = xp - tierStart;
  const rankProgressPercentage = nextRank
    ? Math.min(100, Math.round((xpEarnedInRank / tierSpan) * 100))
    : 100;

  const isMaxRank = !nextRank;
  const powerLevel = isMaxRank
    ? POWER_LEVELS_PER_RANK
    : Math.min(
        POWER_LEVELS_PER_RANK,
        Math.max(1, Math.floor((xpEarnedInRank / tierSpan) * POWER_LEVELS_PER_RANK) + 1),
      );

  const powerLevelSpan = tierSpan / POWER_LEVELS_PER_RANK;
  const powerLevelStart = tierStart + (powerLevel - 1) * powerLevelSpan;
  const powerLevelEnd = tierStart + powerLevel * powerLevelSpan;
  const xpEarnedInCurrentPowerLevel = Math.max(0, xp - powerLevelStart);
  const xpNeededForNextPowerLevel = isMaxRank && powerLevel >= POWER_LEVELS_PER_RANK
    ? 0
    : Math.max(0, Math.ceil(powerLevelEnd - xp));
  const powerLevelProgressPercentage =
    isMaxRank && powerLevel >= POWER_LEVELS_PER_RANK
      ? 100
      : Math.min(100, Math.round((xpEarnedInCurrentPowerLevel / Math.max(1, powerLevelSpan)) * 100));

  const xpNeededForNextRank = nextRank ? Math.max(0, nextRank.xpThreshold - xp) : 0;
  const nextRankPreview = nextRank
    ? `${nextRank.icon} ${nextRank.label} in ${xpNeededForNextRank} XP`
    : "Maximum rank reached — keep earning XP";

  return {
    xpTotal: xp,
    rankIndex,
    rank,
    nextRank,
    powerLevel,
    xpEarnedInRank,
    xpNeededForNextRank,
    xpEarnedInCurrentPowerLevel: Math.round(xpEarnedInCurrentPowerLevel),
    xpNeededForNextPowerLevel,
    rankProgressPercentage,
    powerLevelProgressPercentage,
    nextReward: rank.nextReward,
    nextRankPreview,
    isMaxRank,
  };
}
