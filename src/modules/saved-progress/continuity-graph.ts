import { getLearnerContinuityOverview } from "./continuity-service";
import type { ContinuityGraph, SavedProgressSessionSummary } from "./types";

export function getContinuityGraph(sessions: SavedProgressSessionSummary[]): ContinuityGraph {
  const overview = getLearnerContinuityOverview(sessions);
  const latest = overview.latestSession;

  return {
    overview,
    lastTopicId: undefined,
    lastSubjectId: undefined,
    lastRoute: latest?.href,
    generatedAt: new Date().toISOString(),
  };
}
