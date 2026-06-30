import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("onboarding Phase 6 surfaces dashboard creation framing and exam board setup", () => {
  const experience = readRepoFile("src/app/onboarding/onboarding-experience.tsx");
  const shell = readRepoFile("src/components/onboarding/onboarding-shell.tsx");
  const papersRoute = readRepoFile("src/app/api/exams/papers/route.ts");

  assert.match(experience, /dashboard creation|dashboard is ready/i);
  assert.match(experience, /exam board/i);
  assert.match(experience, /study goal/i);
  assert.match(experience, /dashboardCreationStepLabels/);
  assert.match(shell, /dashboard creation/i);
  assert.match(papersRoute, /filterExamPapersForOnboardingProfile/);
});
