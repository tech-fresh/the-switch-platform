import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExamFocusHref,
  buildExamLobbyHref,
  isExamFocusMode,
} from "../src/lib/exams/focus-mode.ts";
import {
  getDashboardUiPreferences,
  setPlannerPromptDismissed,
} from "../src/modules/dashboard/ui-preferences-service.ts";

test("isExamFocusMode is true when focus=1 or questionId is present", () => {
  assert.equal(isExamFocusMode(undefined), false);
  assert.equal(isExamFocusMode({ examId: "paper-1" }), false);
  assert.equal(isExamFocusMode({ examId: "paper-1", focus: "1" }), true);
  assert.equal(isExamFocusMode({ examId: "paper-1", questionId: "q-1" }), true);
});

test("exam focus helpers build lobby and focus URLs", () => {
  assert.equal(buildExamLobbyHref(), "/exams");
  assert.equal(buildExamLobbyHref("paper-1"), "/exams?examId=paper-1");
  assert.equal(
    buildExamFocusHref("paper-1", "q-2"),
    "/exams?examId=paper-1&focus=1&questionId=q-2",
  );
});

test("weekly planner builds seven days from saved progress signals", async () => {
  const { getWeeklyPlannerSummary } = await import("../src/modules/weekly-planner/service.ts");

  const planner = await getWeeklyPlannerSummary({
    userId: `planner-week-${Date.now()}`,
    referenceDate: new Date("2026-06-24T12:00:00.000Z"),
  });

  assert.equal(planner.days.length, 7);
  assert.match(planner.weekLabel, /Jun/);
  assert.ok(planner.dataSourceSummary.length > 0);
});

test("subject tone mapping is stable for catalog subjects", async () => {
  const { resolveSubjectToneById, resolveSubjectToneByLabel } = await import(
    "../src/lib/subjects/tone.ts"
  );

  assert.equal(resolveSubjectToneById("gcse-maths"), resolveSubjectToneByLabel("Mathematics"));
  assert.equal(resolveSubjectToneById("gcse-maths"), resolveSubjectToneById("gcse-maths"));
});

test("planner dismiss preference persists per user", async () => {
  const userId = `planner-test-${Date.now()}`;

  assert.deepEqual(await getDashboardUiPreferences(userId), {
    plannerPromptDismissed: false,
  });

  await setPlannerPromptDismissed(userId, true);

  assert.deepEqual(await getDashboardUiPreferences(userId), {
    plannerPromptDismissed: true,
  });
});
