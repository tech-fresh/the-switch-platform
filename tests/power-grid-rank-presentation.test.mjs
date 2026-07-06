import test from "node:test";
import assert from "node:assert/strict";

import {
  POWER_GRID_RANKS,
  getPowerGridRankPresentation,
} from "../src/lib/power-grid/rank-presentation.ts";

test("rank presentation maps XP to six milestone ranks", () => {
  assert.equal(getPowerGridRankPresentation(0).rank.label, "Switch On");
  assert.equal(getPowerGridRankPresentation(149).rank.label, "Switch On");
  assert.equal(getPowerGridRankPresentation(150).rank.label, "Locked In");
  assert.equal(getPowerGridRankPresentation(214).rank.label, "Locked In");
  assert.equal(getPowerGridRankPresentation(349).rank.label, "Locked In");
  assert.equal(getPowerGridRankPresentation(350).rank.label, "Level Up");
  assert.equal(getPowerGridRankPresentation(649).rank.label, "Level Up");
  assert.equal(getPowerGridRankPresentation(650).rank.label, "Power Mode");
  assert.equal(getPowerGridRankPresentation(999).rank.label, "Power Mode");
  assert.equal(getPowerGridRankPresentation(1000).rank.label, "Top Performer");
  assert.equal(getPowerGridRankPresentation(1499).rank.label, "Top Performer");
  assert.equal(getPowerGridRankPresentation(1500).rank.label, "Switch Legend");
});

test("rank presentation exposes internal power level progress fields", () => {
  const presentation = getPowerGridRankPresentation(214);

  assert.equal(presentation.rank.label, "Locked In");
  assert.ok(presentation.powerLevel >= 1 && presentation.powerLevel <= 10);
  assert.ok(presentation.xpTotal === 214);
  assert.ok(presentation.rankProgressPercentage >= 0 && presentation.rankProgressPercentage <= 100);
  assert.ok(presentation.powerLevelProgressPercentage >= 0 && presentation.powerLevelProgressPercentage <= 100);
  assert.ok(presentation.nextReward.length > 0);
  assert.match(presentation.nextRankPreview, /Level Up/);
  assert.ok(presentation.xpNeededForNextRank > 0);
});

test("max rank presentation stays at Switch Legend", () => {
  const presentation = getPowerGridRankPresentation(5000);

  assert.equal(presentation.rank.label, "Switch Legend");
  assert.equal(presentation.isMaxRank, true);
  assert.equal(presentation.powerLevel, 10);
  assert.match(presentation.nextRankPreview, /Maximum rank/);
});

test("rank definitions stay at six tiers", () => {
  assert.equal(POWER_GRID_RANKS.length, 6);
  assert.deepEqual(
    POWER_GRID_RANKS.map((rank) => rank.label),
    ["Switch On", "Locked In", "Level Up", "Power Mode", "Top Performer", "Switch Legend"],
  );
});
