import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("dashboard home builds four primary signals", async () => {
  const { getDashboardHomeData } = await import("../src/modules/dashboard/service.ts");

  const data = await getDashboardHomeData("student-demo");

  assert.ok(data.primarySignals, "Expected primarySignals on dashboard home data.");
  assert.ok(data.primarySignals.continueLearning.href);
  assert.ok(data.primarySignals.weakTopic.href);
  assert.ok(data.primarySignals.nextExamTask.href);
  assert.equal(typeof data.primarySignals.powerGrid.xpTotal, "number");
  assert.ok(data.primarySignals.powerGrid.rank.label);

  if (data.primarySignals.weakTopic.topicId) {
    assert.notEqual(data.primarySignals.weakTopic.label, data.primarySignals.weakTopic.topicId);
  }
});

test("dashboard UI uses primary signals and collapses secondary content", () => {
  const dashboardHomeSource = readRepoFile("src/components/dashboard-home.tsx");
  const heroRowSource = readRepoFile("src/components/streamlined/mark32-hero-row.tsx");

  assert.match(dashboardHomeSource, /<details/);
  assert.match(dashboardHomeSource, /JourneyNextStepPanel/);
  assert.match(heroRowSource, /data\.primarySignals/);
  assert.match(heroRowSource, /signals\?\.weakTopic/);
});
