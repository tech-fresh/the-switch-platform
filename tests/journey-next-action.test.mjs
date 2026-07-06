import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rankPrimaryNextAction } from "../src/modules/journey/ranking.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("active saved session wins precedence", () => {
  const result = rankPrimaryNextAction({
    activeSessionHref: "/exams?examId=maths-1",
    activeSessionTitle: "GCSE Maths Paper 1",
    hasReviewReadyResults: true,
    resultsHref: "/results",
    powerGridNextActionHref: "/progress",
    powerGridNextAction: "Improve Power Grid",
  });
  assert.equal(result.primary.actionId, "resume-saved-work");
  assert.equal(result.primary.href, "/exams?examId=maths-1");
});

test("review-ready results beat power grid", () => {
  const result = rankPrimaryNextAction({
    hasReviewReadyResults: true,
    resultsHref: "/results",
    powerGridNextActionHref: "/progress",
    powerGridNextAction: "Improve Power Grid",
  });
  assert.equal(result.primary.actionId, "review-mistakes");
});

test("recall due topics beat power grid", () => {
  const result = rankPrimaryNextAction({
    hasReviewReadyResults: false,
    recallDueHref: "/subjects?subjectId=gcse-maths&topicId=maths-algebra",
    recallDueTopicLabel: "maths-algebra",
    powerGridNextActionHref: "/progress",
    powerGridNextAction: "Improve Power Grid",
  });

  assert.equal(result.primary.actionId, "practise-weak-topic");
  assert.equal(result.primary.sourceModule, "recall-strength");
});

test("fallback continues learning on subjects", () => {
  const result = rankPrimaryNextAction({ hasReviewReadyResults: false });
  assert.equal(result.primary.actionId, "continue-learning");
  assert.equal(result.primary.href, "/subjects");
});

test("journey API route and dashboard service are wired", () => {
  const routeSource = readRepoFile("src/app/api/journey/next-action/route.ts");
  const dashboardSource = readRepoFile("src/modules/dashboard/service.ts");
  const dashboardComponentSource = readRepoFile("src/components/dashboard-home.tsx");

  assert.match(routeSource, /withAuthenticatedSwitchRequestContext/);
  assert.match(routeSource, /journey:\s*await getJourneyContext\(context\.userId\)/);
  assert.match(dashboardSource, /getJourneyContext/);
  assert.match(dashboardSource, /primarySignals/);
  assert.match(dashboardComponentSource, /JourneyNextStepPanel/);
});
