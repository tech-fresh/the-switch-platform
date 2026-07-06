import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CONNECTED_ROUTES = [
  "src/app/dashboard/page.tsx",
  "src/app/subjects/page.tsx",
  "src/app/exams/page.tsx",
  "src/app/assessments/page.tsx",
  "src/app/progress/page.tsx",
  "src/app/results/page.tsx",
  "src/app/saved-progress/page.tsx",
  "src/app/recommendations/page.tsx",
  "src/app/accessibility/page.tsx",
  "src/app/account/page.tsx",
];

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("connected routes fetch journey data", () => {
  for (const routePath of CONNECTED_ROUTES) {
    const source = readRepoFile(routePath);
    const usesJourney =
      source.includes("getJourneyNextActionApiData") ||
      source.includes("getDashboardHomeApiData");

    assert.ok(usesJourney, `Expected journey wiring in ${routePath}`);
  }
});

test("signed-in routes render journey next-step panel", () => {
  const panelRoutes = [
    "src/app/subjects/page.tsx",
    "src/app/exams/page.tsx",
    "src/app/progress/page.tsx",
    "src/app/results/page.tsx",
    "src/app/recommendations/page.tsx",
    "src/app/assessments/page.tsx",
    "src/app/accessibility/page.tsx",
    "src/app/account/page.tsx",
  ];

  for (const routePath of panelRoutes) {
    const source = readRepoFile(routePath);
    assert.match(source, /JourneyNextStepPanel/, `Expected JourneyNextStepPanel in ${routePath}`);
  }

  const savedProgressExperienceSource = readRepoFile("src/app/saved-progress/saved-progress-experience.tsx");
  assert.match(savedProgressExperienceSource, /JourneyNextStepPanel/);

  const dashboardHomeSource = readRepoFile("src/components/dashboard-home.tsx");
  assert.match(dashboardHomeSource, /JourneyNextStepPanel/);
});

test("learning loop API and subject experience are wired", () => {
  const apiSource = readRepoFile("src/app/api/learning-loop/[topicId]/route.ts");
  const subjectExperienceSource = readRepoFile("src/app/subjects/subject-experience.tsx");

  assert.match(apiSource, /getLearningLoopSession/);
  assert.match(apiSource, /advanceLearningLoopStage/);
  assert.match(subjectExperienceSource, /\/api\/learning-loop\//);
});
