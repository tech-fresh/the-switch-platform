import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ENTRY_POINT_FILES = [
  "HANDOFF.md",
  "AGENTS.md",
  "PLATFORM-GUIDE.md",
  "README.md",
  "docs/ideas/README.md",
  "docs/ideas/FINAL-PHASE-PLAN.md",
];

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("operator truth doc separates launch proof, usability hardening, and deferred scope", () => {
  const source = readRepoFile("docs/MVP-OPERATOR-TRUTH.md");

  assert.match(source, /Truthful launch completion \(Priority A–D\)/);
  assert.match(source, /MVP usability hardening \(Areas 1–9\)/);
  assert.match(source, /Deferred expansion \(Priority E\)/);
  assert.match(source, /MVP-USABILITY-LAUNCH-READINESS-PLAN\.md/);
  assert.match(source, /LOCAL-LAUNCH-REHEARSAL\.md/);
  assert.match(source, /verify:priority-a-closeout/);
  assert.match(source, /verify:local-launch-readiness/);
  assert.match(source, /Complete — 30 June 2026/);
});

test("handoff entry points link the usability plan and operator truth", () => {
  const handoff = readRepoFile("HANDOFF.md");
  const agents = readRepoFile("AGENTS.md");
  const platformGuide = readRepoFile("PLATFORM-GUIDE.md");

  for (const source of [handoff, agents, platformGuide]) {
    assert.match(source, /MVP-USABILITY-LAUNCH-READINESS-PLAN\.md/);
  }

  assert.match(agents, /MVP-OPERATOR-TRUTH\.md/);
  assert.match(platformGuide, /MVP-OPERATOR-TRUTH\.md/);
});

test("ideas index lists the usability plan as an active follow-on reference", () => {
  const ideasReadme = readRepoFile("docs/ideas/README.md");

  assert.match(ideasReadme, /MVP-USABILITY-LAUNCH-READINESS-PLAN\.md/);
  assert.match(ideasReadme, /MVP-OPERATOR-TRUTH\.md/);
  assert.match(ideasReadme, /LOCAL-LAUNCH-REHEARSAL\.md/);
});

test("final phase plan keeps Priority A–D closed and usability as a separate lane", () => {
  const finalPhasePlan = readRepoFile("docs/ideas/FINAL-PHASE-PLAN.md");

  assert.match(finalPhasePlan, /28 \/ 28 complete/);
  assert.match(finalPhasePlan, /MVP-USABILITY-LAUNCH-READINESS-PLAN\.md/);
  assert.match(finalPhasePlan, /Priority E/);
  assert.doesNotMatch(finalPhasePlan, /Priority A.*in progress/i);
});

test("usability plan marks all areas complete and points to operator truth", () => {
  const usabilityPlan = readRepoFile("docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md");

  assert.match(usabilityPlan, /## Area 2 — Route-to-Route Clickability/);
  assert.match(usabilityPlan, /Area 8 summary.*4 \/ 4.*complete/s);
  assert.match(usabilityPlan, /MVP-OPERATOR-TRUTH\.md/);
  assert.match(usabilityPlan, /Status: \*\*complete/i);
});

test("README build record documents Area 7 and Area 8 closeout", () => {
  const readme = readRepoFile("README.md");

  assert.match(readme, /Area 7 — complete/);
  assert.match(readme, /Area 8 — complete/);
  assert.match(readme, /MVP-OPERATOR-TRUTH\.md/);
});
