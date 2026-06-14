import test from "node:test";
import assert from "node:assert/strict";

test("launch governance overview defines reviews, ownership, smoke checks, and follow-up loops", async () => {
  const { getLaunchGovernanceOverview } = await import("../src/modules/governance/service.ts");

  const overview = getLaunchGovernanceOverview();

  assert.equal(overview.overallStatus, "ready");
  assert.equal(overview.reviews.length >= 3, true);
  assert.equal(overview.ownership.length >= 4, true);
  assert.equal(overview.smokeChecks.length >= 6, true);
  assert.equal(overview.followUpLoops.length >= 3, true);
  assert.equal(overview.smokeChecks.every((check) => check.status === "ready"), true);
});
