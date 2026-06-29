import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { assertAllowedMvpClickTarget } from "../scripts/canonical-mvp-routes.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractRecoveryActions(source) {
  return [...source.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
}

test("exam recovery surfaces StudentRouteRecovery with allowed next clicks", () => {
  const source = readRepoFile("src/app/exams/exams-recovery.tsx");

  assert.match(source, /StudentRouteRecovery/);
  assert.match(source, /Exam recovery/);

  for (const href of extractRecoveryActions(source)) {
    assertAllowedMvpClickTarget(href, "exams recovery actions");
  }
});

test("assessment recovery surfaces StudentRouteRecovery with allowed next clicks", () => {
  const source = readRepoFile("src/app/assessments/assessments-recovery.tsx");

  assert.match(source, /StudentRouteRecovery/);
  assert.match(source, /Timed practice recovery/);

  for (const href of extractRecoveryActions(source)) {
    assertAllowedMvpClickTarget(href, "assessments recovery actions");
  }
});

test("assessments page routes unknown assessment ids to recovery", () => {
  const source = readRepoFile("src/app/assessments/page.tsx");

  assert.match(source, /AssessmentsRecoveryInShell/);
  assert.match(source, /unavailable for the selected checkpoint/);
});

test("exam focus helpers build stable deep-link hrefs", async () => {
  const { buildExamFocusHref, buildExamLobbyHref, isExamFocusMode } = await import(
    "../src/lib/exams/focus-mode.ts"
  );

  assert.equal(isExamFocusMode({ examId: "paper-1", questionId: "q1" }), true);
  assert.equal(isExamFocusMode({ examId: "paper-1", focus: "1" }), true);
  assert.equal(isExamFocusMode({ examId: "paper-1" }), false);

  assert.equal(
    buildExamFocusHref("paper-1", "q1"),
    "/exams?examId=paper-1&focus=1&questionId=q1",
  );
  assert.equal(buildExamLobbyHref("paper-1"), "/exams?examId=paper-1");
});

test("saved progress href builder returns exam and assessment resume routes", async () => {
  const { buildSavedProgressHref } = await import("../src/modules/saved-progress/overview-service.ts");
  const {
    buildExamSavedProgressRecord,
    buildTimedAssessmentSavedProgressRecord,
  } = await import("../src/modules/saved-progress/rules.ts");

  const examRecord = buildExamSavedProgressRecord({
    input: {
      userId: "learner-1",
      examSessionId: "aqa-maths-higher-paper-1",
      currentQuestionId: "q1-v1",
      questionSet: [{ questionId: "q1-v1" }],
      questionResponses: [],
      timeRemainingMinutes: 45,
      status: "in-progress",
    },
    now: "2026-06-29T10:00:00.000Z",
  });

  const assessmentRecord = buildTimedAssessmentSavedProgressRecord({
    input: {
      userId: "learner-1",
      assessmentAttemptId: "edexcel-english-writing-craft-checkpoint-attempt-1",
      currentQuestionId: "q4",
      questionSet: [{ questionId: "q4" }],
      selectedAnswerIds: [],
      writtenAnswers: {},
      notes: {},
      bookmarkedQuestionIds: [],
      selectedDurationMinutes: 30,
      timeRemainingMinutes: 30,
      status: "in-progress",
    },
    now: "2026-06-29T10:00:00.000Z",
  });

  const examHref = buildSavedProgressHref(examRecord);
  const assessmentHref = buildSavedProgressHref(assessmentRecord);

  assert.match(examHref, /^\/exams\?/);
  assert.match(assessmentHref, /^\/assessments\?/);
});

test("exam and assessment session APIs expose save and submit handlers", () => {
  const examRoute = readRepoFile("src/app/api/exams/session/[examId]/route.ts");
  const assessmentRoute = readRepoFile("src/app/api/assessments/seed/[assessmentId]/route.ts");

  assert.match(examRoute, /export async function PATCH/);
  assert.match(examRoute, /export async function POST/);
  assert.match(assessmentRoute, /export async function PATCH/);
  assert.match(assessmentRoute, /export async function POST/);
});
