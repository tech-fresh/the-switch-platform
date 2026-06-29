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

function buildSessionSummary({
  status,
  recoveryState,
  href,
  title = "AQA Maths Paper 1",
  entityId = "aqa-maths-higher-paper-1-session-001",
}) {
  return {
    progressId: "progress-1",
    entityId,
    entityType: "exam-session",
    title,
    subtitle: "AQA Paper 1 • attempt 001",
    href,
    actionLabel: status === "submitted" ? "Open results" : "Open and resume",
    status,
    recoveryState,
    lastActivityAt: "2026-06-26T10:00:00.000Z",
    completionPercentage: 40,
    currentQuestionLabel: status === "submitted" ? "Submitted and ready for review" : "Resume from q1-v1",
    timeRemainingLabel: status === "submitted" ? "Timing closed for this paper" : "42 mins remaining",
    supportSummary: "No access arrangements saved",
    supportPreferenceChips: [],
    reviewSummary: "No flagged questions in the saved state",
  };
}

test("learner continuity overview covers new, active, and completed states", async () => {
  const { getLearnerContinuityOverview } = await import("../src/modules/saved-progress/continuity-service.ts");

  const empty = getLearnerContinuityOverview([]);
  assert.equal(empty.status, "start-first-session");
  assert.equal(empty.primaryAction.href, "/exams");
  assert.equal(empty.primaryAction.actionLabel, "Open exam lobby");

  const activeSession = buildSessionSummary({
    status: "in-progress",
    recoveryState: "resume-ready",
    href: "/exams?examId=aqa-maths-higher-paper-1&questionId=q1-v1",
  });
  const active = getLearnerContinuityOverview([activeSession]);
  assert.equal(active.status, "resume-active-session");
  assert.equal(active.primaryAction.href, activeSession.href);
  assert.equal(active.primaryAction.actionLabel, "Open and resume");

  const reviewSession = buildSessionSummary({
    status: "submitted",
    recoveryState: "review-ready",
    href: "/results",
    entityId: "aqa-maths-higher-paper-1-session-002",
  });
  const review = getLearnerContinuityOverview([reviewSession]);
  assert.equal(review.status, "review-submitted-session");
  assert.equal(review.primaryAction.href, "/results");
  assert.equal(review.primaryAction.actionLabel, "Open results");

  const mixed = getLearnerContinuityOverview([reviewSession, activeSession]);
  assert.equal(mixed.status, "resume-active-session");
  assert.equal(mixed.primaryAction.href, activeSession.href);
});

test("submitted saved-progress hrefs route to results instead of live exam entry", async () => {
  const { buildSavedProgressHref } = await import("../src/modules/saved-progress/overview-service.ts");
  const { buildExamSavedProgressRecord } = await import("../src/modules/saved-progress/rules.ts");

  const submittedRecord = buildExamSavedProgressRecord({
    input: {
      userId: "learner-1",
      examSessionId: "aqa-maths-higher-paper-1-session-001",
      currentQuestionId: "q1-v1",
      questionSet: [{ questionId: "q1-v1" }],
      questionResponses: [],
      timeRemainingMinutes: 0,
      status: "submitted",
    },
    now: "2026-06-29T10:00:00.000Z",
  });

  assert.equal(buildSavedProgressHref(submittedRecord), "/results");
  assertAllowedMvpClickTarget("/results", "submitted saved-progress review href");
});

test("dashboard and results services copy saved-progress continuity fields", () => {
  const dashboardSource = readRepoFile("src/modules/dashboard/service.ts");
  const resultsSource = readRepoFile("src/modules/results/service.ts");

  assert.match(dashboardSource, /continuityStatus: savedProgress\.continuity\.status/);
  assert.match(dashboardSource, /continuityHref: savedProgress\.continuity\.primaryAction\.href/);
  assert.match(dashboardSource, /continuityActionLabel: savedProgress\.continuity\.primaryAction\.actionLabel/);

  assert.match(resultsSource, /continuityStatus: savedProgressOverview\.continuity\.status/);
  assert.match(resultsSource, /continuityHref: savedProgressOverview\.continuity\.primaryAction\.href/);
  assert.match(resultsSource, /continuityActionLabel: savedProgressOverview\.continuity\.primaryAction\.actionLabel/);
});

test("saved-progress overview session hrefs stay on allowed MVP targets", async () => {
  const { getSavedProgressOverview } = await import("../src/modules/saved-progress/overview-service.ts");

  const overview = await getSavedProgressOverview({ userId: "guest-preview" });

  assert.ok(overview.sessions.length > 0, "Expected seeded saved-progress sessions for continuity checks.");

  for (const session of overview.sessions) {
    assertAllowedMvpClickTarget(session.href, `saved-progress session "${session.title}"`);
    if (session.status === "submitted") {
      assert.equal(session.href, "/results", `Submitted session "${session.title}" should route to /results.`);
    } else {
      assert.match(
        session.href,
        /^\/(exams|assessments)\?/,
        `Active session "${session.title}" should resume through a live route.`,
      );
    }
  }
});

test("submitted exam autosave cannot roll saved-progress status back to in-progress", async () => {
  const { saveMockExamSession, submitMockExamSession, getMockExamSession } = await import(
    "../src/modules/exam-engine/service.ts"
  );
  const { listSavedProgressByUser } = await import("../src/modules/saved-progress/service.ts");

  const repository = createInMemorySavedProgressRepository();
  const userId = "continuity-submitted-lock";
  const examId = "aqa-maths-higher-paper-1";

  const session = await getMockExamSession(examId, { userId, savedProgressRepository: repository });
  await submitMockExamSession(examId, {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[0].questionId,
    questionResponses: session.questionResponses,
    timeRemainingMinutes: 30,
    userId,
    savedProgressRepository: repository,
  });

  await saveMockExamSession(examId, {
    examSessionId: session.examSessionId,
    currentQuestionId: session.questions[0].questionId,
    questionResponses: session.questionResponses.map((response, index) =>
      index === 0 ? { ...response, selectedOptionId: "b" } : response,
    ),
    timeRemainingMinutes: 25,
    userId,
    savedProgressRepository: repository,
  });

  const records = await listSavedProgressByUser(userId, repository);
  const submittedRecord = records.find((record) => record.entityId === session.examSessionId);

  assert.equal(submittedRecord?.status, "submitted");
});

test("saved-progress and results experiences expose continuity recovery guidance", () => {
  const savedProgressSource = readRepoFile("src/app/saved-progress/saved-progress-experience.tsx");
  const resultsSource = readRepoFile("src/app/results/results-experience.tsx");

  assert.match(savedProgressSource, /StudentRouteRecovery/);
  assert.match(savedProgressSource, /No saved sessions yet/);

  assert.match(resultsSource, /StudentRouteRecovery/);
  assert.match(resultsSource, /start-first-session/);
  assert.match(resultsSource, /No submitted results yet/);
});

function createInMemorySavedProgressRepository() {
  /** @type {import("../src/modules/saved-progress/types.ts").SavedProgressRecord[]} */
  const records = [];

  return {
    async getByEntityId(userId, entityType, entityId) {
      return (
        records.find(
          (record) =>
            record.userId === userId &&
            record.entityType === entityType &&
            record.entityId === entityId,
        ) ?? null
      );
    },
    async listByUserId(userId) {
      return records
        .filter((record) => record.userId === userId)
        .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
    },
    async save(record) {
      const index = records.findIndex(
        (existing) =>
          existing.userId === record.userId &&
          existing.entityType === record.entityType &&
          existing.entityId === record.entityId,
      );

      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }

      return record;
    },
  };
}
