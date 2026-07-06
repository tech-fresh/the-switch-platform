import type { Recommendation } from "./types";

export interface RankingSignal {
  id: string;
  weight: number;
  recommendation: Recommendation;
}

export const RECOMMENDATION_SIGNAL_WEIGHTS = {
  activeSavedSession: 100,
  reviewReadyResults: 90,
  recallStrengthDue: 85,
  weakestTopic: 80,
  nextExamInPlanner: 70,
  onboardingGap: 60,
  revisionStreak: 50,
  accessibilityFriendly: 40,
  powerGridNextBestAction: 30,
} as const;

export function sortRankingSignals(signals: RankingSignal[]): RankingSignal[] {
  return [...signals].sort((left, right) => right.weight - left.weight);
}

export function getTopRankedRecommendation(signals: RankingSignal[]): Recommendation | undefined {
  return sortRankingSignals(signals)[0]?.recommendation;
}
