import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RECOMMENDATION_SIGNAL_WEIGHTS,
  sortRankingSignals,
} from "../src/modules/recommendations/ranking.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("higher weight signals sort first", () => {
  const sorted = sortRankingSignals([
    {
      id: "a",
      weight: 30,
      recommendation: {
        recommendationId: "a",
        userId: "user-1",
        category: "revise-next",
        title: "Low",
        description: "Low priority",
        actionLabel: "Open",
        href: "/a",
        priority: "low",
      },
    },
    {
      id: "b",
      weight: 100,
      recommendation: {
        recommendationId: "b",
        userId: "user-1",
        category: "resume-saved",
        title: "High",
        description: "High priority",
        actionLabel: "Open",
        href: "/b",
        priority: "high",
      },
    },
  ]);
  assert.equal(sorted[0].id, "b");
});

test("ranking weights define at least six signal types", () => {
  assert.ok(Object.keys(RECOMMENDATION_SIGNAL_WEIGHTS).length >= 6);
  assert.equal(RECOMMENDATION_SIGNAL_WEIGHTS.recallStrengthDue, 85);
});

test("ranked recommendations route and journey integration are wired", () => {
  const rankedRouteSource = readRepoFile("src/app/api/recommendations/ranked/route.ts");
  const recommendationsRouteSource = readRepoFile("src/app/api/recommendations/route.ts");
  const recommendationsServiceSource = readRepoFile("src/modules/recommendations/service.ts");
  const journeyServiceSource = readRepoFile("src/modules/journey/service.ts");

  assert.match(rankedRouteSource, /getRankedRecommendations/);
  assert.match(rankedRouteSource, /topPick:\s*recommendations\[0\] \?\? null/);

  assert.match(recommendationsRouteSource, /getRankedRecommendations/);
  assert.match(recommendationsServiceSource, /buildRankingSignals/);
  assert.match(recommendationsServiceSource, /RECOMMENDATION_SIGNAL_WEIGHTS/);
  assert.match(journeyServiceSource, /getRankedRecommendations/);
});
