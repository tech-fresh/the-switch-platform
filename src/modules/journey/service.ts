import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getRecallStrengthSnapshot } from "@/modules/recall-strength/service";
import { getRankedRecommendations } from "@/modules/recommendations/service";
import { getResultsOverview } from "@/modules/results/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";

import { rankPrimaryNextAction } from "./ranking";
import type { JourneyContext, PrimaryNextAction } from "./types";

export async function getJourneyContext(userId: string): Promise<JourneyContext> {
  const [savedProgress, results, powerGrid, recommendations, recallStrength] = await Promise.all([
    getSavedProgressOverview({ userId }),
    getResultsOverview(userId),
    getMockPowerGridSummary({ userId }),
    getRankedRecommendations(userId),
    getRecallStrengthSnapshot(userId),
  ]);

  const topRecommendation = recommendations[0];
  const { primary, secondary } = rankPrimaryNextAction({
    activeSessionHref: savedProgress.continuity.activeSession?.href,
    activeSessionTitle: savedProgress.continuity.activeSession?.title,
    reviewSessionHref: savedProgress.continuity.reviewSession?.href,
    reviewSessionTitle: savedProgress.continuity.reviewSession?.title,
    hasReviewReadyResults: results.readyForReviewCount > 0,
    resultsHref: "/results",
    recallDueHref: recallStrength.nextDueTopic
      ? `/subjects?subjectId=${recallStrength.nextDueTopic.subjectId}&topicId=${recallStrength.nextDueTopic.topicId}`
      : undefined,
    recallDueTopicLabel: recallStrength.nextDueTopic?.topicId,
    powerGridNextAction: powerGrid.nextBestAction,
    powerGridNextActionHref: powerGrid.nextBestActionHref,
    topRecommendationHref: topRecommendation?.href,
    topRecommendationLabel: topRecommendation?.title,
    topRecommendationReason: topRecommendation?.description,
  });

  return {
    userId,
    generatedAt: new Date().toISOString(),
    primaryAction: primary,
    secondaryActions: secondary,
  };
}

export async function getPrimaryNextAction(userId: string): Promise<PrimaryNextAction> {
  const context = await getJourneyContext(userId);
  return context.primaryAction;
}
