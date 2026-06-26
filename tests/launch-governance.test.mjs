import test from "node:test";
import assert from "node:assert/strict";

test("launch governance overview defines reviews, ownership, smoke checks, and follow-up loops", async () => {
  const { getLaunchGovernanceOverview } = await import("../src/modules/governance/service.ts");

  const overview = await getLaunchGovernanceOverview();

  assert.equal(
    overview.overallStatus === "ready" || overview.overallStatus === "watch",
    true,
  );
  assert.equal(overview.reviews.length >= 3, true);
  assert.equal(overview.ownership.length >= 4, true);
  assert.equal(overview.smokeChecks.length >= 6, true);
  assert.equal(overview.environmentChecks.length >= 5, true);
  assert.equal(overview.signOffChecks.length >= 5, true);
  assert.equal(overview.evidenceRecords.length >= 8, true);
  assert.equal(overview.followUpLoops.length >= 3, true);
  assert.equal(overview.smokeChecks.some((check) => check.status === "watch"), true);
  assert.equal(overview.smokeChecks.every((check) => ["seeded", "manual"].includes(check.source)), true);
  assert.equal(overview.finalPathSummary.label, "Priority A closeout complete");
  assert.equal(overview.finalPathSummary.codeCompleteCount, 10);
  assert.equal(overview.finalPathSummary.totalCount, 10);
  assert.equal(overview.finalPathSummary.closeoutItems.length, 10);
  assert.equal(overview.finalPathSummary.biggestBlockers.length >= 3, true);
  assert.equal(
    overview.finalPathSummary.closeoutItems.find((item) => item.itemId === "closeout-content-path")?.status,
    "done",
  );
  assert.equal(
    overview.evidenceRecords.some((item) => item.area === "persistence"),
    true,
  );
  assert.equal(
    overview.reviews.every((review) => ["seeded", "manual"].includes(review.source)),
    true,
  );
  assert.equal(
    overview.evidenceRecords.every((record) => ["seeded", "runtime", "manual"].includes(record.source)),
    true,
  );
});
