import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("saved-progress overview exposes a continuity graph", async () => {
  const { getSavedProgressOverview } = await import("../src/modules/saved-progress/overview-service.ts");

  const overview = await getSavedProgressOverview({ userId: "guest-preview" });

  assert.ok(overview.continuityGraph, "Expected continuityGraph on saved-progress overview.");
  assert.equal(overview.continuityGraph.overview.status, overview.continuity.status);
  assert.equal(typeof overview.continuityGraph.generatedAt, "string");
});

test("phase 2 routes fetch journey data and render the shared panel", () => {
  const subjectsPageSource = readRepoFile("src/app/subjects/page.tsx");
  const examsPageSource = readRepoFile("src/app/exams/page.tsx");
  const savedProgressPageSource = readRepoFile("src/app/saved-progress/page.tsx");
  const savedProgressExperienceSource = readRepoFile("src/app/saved-progress/saved-progress-experience.tsx");

  assert.match(subjectsPageSource, /getJourneyNextActionApiData/);
  assert.match(subjectsPageSource, /JourneyNextStepPanel/);

  assert.match(examsPageSource, /getJourneyNextActionApiData/);
  assert.match(examsPageSource, /JourneyNextStepPanel/);

  assert.match(savedProgressPageSource, /getJourneyNextActionApiData/);
  assert.match(savedProgressExperienceSource, /JourneyNextStepPanel/);
});
