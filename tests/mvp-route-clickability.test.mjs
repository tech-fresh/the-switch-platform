import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  ALLOWED_MVP_CLICK_TARGETS,
  CANONICAL_MVP_ROUTES_DEFINITION,
  assertAllowedMvpClickTarget,
  getClickTargetPathname,
} from "../scripts/canonical-mvp-routes.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PLAN_ROUTE_PATHS = [
  "/",
  "/dashboard",
  "/subjects",
  "/assessments",
  "/exams",
  "/saved-progress",
  "/results",
  "/recommendations",
  "/progress",
  "/accessibility",
  "/account",
  "/support",
  "/how-it-works",
];

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractHrefAttributes(source) {
  return [...source.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
}

test("canonical MVP route map matches the launch-readiness plan list", () => {
  const canonicalPaths = CANONICAL_MVP_ROUTES_DEFINITION.routes.map((route) => route.path);

  for (const path of PLAN_ROUTE_PATHS) {
    assert(canonicalPaths.includes(path), `Canonical route map should include ${path}.`);
  }
});

test("student route recovery defaults stay on allowed MVP targets", () => {
  const recoverySource = readRepoFile("src/components/student-route-recovery.tsx");
  const defaultHrefs = [...recoverySource.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);

  assert(defaultHrefs.length >= 3, "Expected StudentRouteRecovery to declare default recovery actions.");

  for (const href of defaultHrefs) {
    assertAllowedMvpClickTarget(href, "StudentRouteRecovery defaults");
  }
});

test("student shell navigation only links to allowed MVP targets", () => {
  const brandTokens = readRepoFile("src/components/mock-idea/brand-tokens.ts");
  const navHrefs = extractHrefAttributes(brandTokens);

  for (const href of navHrefs) {
    assertAllowedMvpClickTarget(href, "brand navigation");
  }
});

test("homepage marketing sections only link to allowed MVP targets", () => {
  const marketingSections = readRepoFile("src/components/streamlined/mark32-marketing-sections.tsx");
  const hrefs = extractHrefAttributes(marketingSections);

  assert(hrefs.length > 0, "Expected Mark32MarketingSections to declare href targets.");

  for (const href of hrefs) {
    assertAllowedMvpClickTarget(href, "Mark32MarketingSections");
  }
});

test("dashboard route cards resolve to allowed MVP click targets", async () => {
  const { getDashboardHomeData } = await import("../src/modules/dashboard/service.ts");
  const dashboard = await getDashboardHomeData("guest-preview");

  for (const card of dashboard.routeCards) {
    assertAllowedMvpClickTarget(card.href, `dashboard route card "${card.title}"`);
  }

  assertAllowedMvpClickTarget(dashboard.continuityHref, "dashboard continuity href");

  if (dashboard.primarySignals) {
    assertAllowedMvpClickTarget(
      dashboard.primarySignals.continueLearning.href,
      "dashboard primary continue-learning signal",
    );
    assertAllowedMvpClickTarget(
      dashboard.primarySignals.weakTopic.href,
      "dashboard primary weak-topic signal",
    );
    assertAllowedMvpClickTarget(
      dashboard.primarySignals.nextExamTask.href,
      "dashboard primary next-exam signal",
    );
  }
});

test("account quick links resolve to allowed MVP click targets", async () => {
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "mvp-route-clickability-test";

  const { getAccountOverview } = await import(
    `../src/modules/auth/service.ts?test=${Date.now()}-account-quick-links`,
  );
  const account = await getAccountOverview();

  for (const link of account.quickLinks) {
    assertAllowedMvpClickTarget(link.href, `account quick link "${link.label}"`);
  }
});

test("saved progress resume href builder only returns allowed MVP targets", async () => {
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

  const submittedRecord = { ...examRecord, status: "submitted" };

  for (const [label, record] of [
    ["exam resume", examRecord],
    ["assessment resume", assessmentRecord],
    ["submitted review", submittedRecord],
  ]) {
    const href = buildSavedProgressHref(record);
    assertAllowedMvpClickTarget(href, `saved progress href (${label})`);
    assert(getClickTargetPathname(href), `Expected ${label} href to resolve to an internal path.`);
  }
});

test("signed-in student experience routes keep Mark32PageHeader or recovery guidance", () => {
  const experienceFiles = [
    "src/app/subjects/subject-experience.tsx",
    "src/app/account/account-experience.tsx",
    "src/app/exams/exam-lobby-experience.tsx",
    "src/app/recommendations/recommendations-experience.tsx",
    "src/app/results/results-experience.tsx",
    "src/app/saved-progress/saved-progress-experience.tsx",
    "src/app/accessibility/accessibility-experience.tsx",
  ];

  for (const relativePath of experienceFiles) {
    const source = readRepoFile(relativePath);

    assert.match(
      source,
      /Mark32PageHeader|StudentRouteRecovery/,
      `${relativePath} should expose a page header or recovery guidance`,
    );
  }
});

test("canonical routes distinguish public pages from auth-protected student routes", () => {
  const protectedRoutes = CANONICAL_MVP_ROUTES_DEFINITION.routes.filter((route) => route.requiresAuth);
  const publicRoutes = CANONICAL_MVP_ROUTES_DEFINITION.routes.filter((route) => !route.requiresAuth);

  assert(protectedRoutes.length >= 9, "Expected most core study routes to require sign-in.");
  assert(publicRoutes.some((route) => route.path === "/"), "Expected / to remain public.");
  assert(publicRoutes.some((route) => route.path === "/login"), "Expected /login to remain public.");
  assert(publicRoutes.some((route) => route.path === "/account"), "Expected /account to stay reachable when signed out.");
});

test("allowed click targets stay a superset of canonical MVP paths", () => {
  for (const route of CANONICAL_MVP_ROUTES_DEFINITION.routes) {
    assert(
      ALLOWED_MVP_CLICK_TARGETS.has(route.path),
      `Allowed click targets should include canonical route ${route.path}.`,
    );
  }
});

test("recovery default actions match the canonical recovery list", () => {
  for (const path of CANONICAL_MVP_ROUTES_DEFINITION.recoveryDefaultActions) {
    assert(ALLOWED_MVP_CLICK_TARGETS.has(path), `Recovery action ${path} should be an allowed click target.`);
  }
});
