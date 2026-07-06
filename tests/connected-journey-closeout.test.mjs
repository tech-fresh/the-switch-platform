import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assertExists(relativePath) {
  assert.ok(existsSync(path.join(repoRoot, relativePath)), `Expected ${relativePath} to exist.`);
}

test("connected learning architecture modules and APIs are present", () => {
  assertExists("src/modules/journey/service.ts");
  assertExists("src/modules/recall-strength/service.ts");
  assertExists("src/modules/learning-loop/service.ts");
  assertExists("src/modules/recommendations/ranking.ts");
  assertExists("src/modules/power-grid/progression-events.ts");
  assertExists("src/modules/saved-progress/continuity-graph.ts");
  assertExists("src/app/api/journey/next-action/route.ts");
  assertExists("src/app/api/recommendations/ranked/route.ts");
  assertExists("src/app/api/recall-strength/snapshot/route.ts");
  assertExists("src/app/api/learning-loop/[topicId]/route.ts");
  assertExists("scripts/verify-connected-journey.mjs");
});

test("dashboard exposes four primary signals for student demo", async () => {
  const { getDashboardHomeData } = await import("../src/modules/dashboard/service.ts");
  const data = await getDashboardHomeData("student-demo");

  assert.ok(data.primarySignals?.continueLearning.href);
  assert.ok(data.primarySignals?.weakTopic.href);
  assert.ok(data.primarySignals?.nextExamTask.href);
  assert.equal(typeof data.primarySignals?.powerGrid.xpTotal, "number");
  assert.ok(data.primarySignals?.powerGrid.rank.label);
  assert.ok(data.journey?.primaryAction.href);
});

test("journey next-action API route delegates to journey service", () => {
  const routeSource = readRepoFile("src/app/api/journey/next-action/route.ts");
  assert.match(routeSource, /getJourneyContext/);
});

test("architecture principles doc records implementation status", () => {
  const principlesSource = readRepoFile(
    "docs/design/09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md",
  );
  assert.match(principlesSource, /Implementation status/);
  assert.match(principlesSource, /Implemented in code/);
});
