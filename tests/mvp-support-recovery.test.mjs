import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  assertAllowedMvpClickTarget,
  CANONICAL_MVP_ROUTES_DEFINITION,
} from "../scripts/canonical-mvp-routes.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractRecoveryActionHrefs(source) {
  const blockMatch = source.match(/actions=\{(\[[\s\S]*?\])\}/);
  if (!blockMatch) {
    return [];
  }

  return [...blockMatch[1].matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
}

test("support route stays public with marketing chrome and urgent signposting", () => {
  const supportPage = readRepoFile("src/app/support/page.tsx");

  assert.match(supportPage, /PublicMarketingPage/);
  assert.match(supportPage, /getSupportHubApiData/);
  assert.match(supportPage, /urgentHelp/);
  assert.match(supportPage, /routeGuidance/);
});

test("accessibility route stays in the student shell with support signposting", () => {
  const accessibilityPage = readRepoFile("src/app/accessibility/page.tsx");
  const accessibilityExperience = readRepoFile("src/app/accessibility/accessibility-experience.tsx");

  assert.match(accessibilityPage, /StudentAppShell/);
  assert.match(accessibilityPage, /getSupportHubApiData/);
  assert.match(accessibilityExperience, /href="\/support"/);
  assert.match(accessibilityExperience, /Open support hub/);
});

test("account quick links signpost accessibility and support", async () => {
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "mvp-support-recovery-test";

  const { getAccountOverview } = await import(
    `../src/modules/auth/service.ts?test=${Date.now()}-support-account-links`,
  );
  const account = await getAccountOverview();
  const hrefs = account.quickLinks.map((link) => link.href);

  assert(hrefs.includes("/accessibility"), "Expected account quick links to include /accessibility.");
  assert(hrefs.includes("/support"), "Expected account quick links to include /support.");

  for (const link of account.quickLinks) {
    assertAllowedMvpClickTarget(link.href, `account quick link "${link.label}"`);
  }
});

test("dashboard route cards signpost support and accessibility", async () => {
  const { getDashboardHomeData } = await import("../src/modules/dashboard/service.ts");
  const dashboard = await getDashboardHomeData("walkthrough-student-001");
  const hrefs = dashboard.routeCards.map((card) => card.href);

  assert(hrefs.includes("/support"), "Expected dashboard route cards to include /support.");
  assert(hrefs.includes("/accessibility"), "Expected dashboard route cards to include /accessibility.");

  for (const card of dashboard.routeCards) {
    assertAllowedMvpClickTarget(card.href, `dashboard route card "${card.title}"`);
  }
});

test("empty and blocked study routes expose StudentRouteRecovery with allowed next clicks", () => {
  const emptyStateFiles = [
    "src/app/saved-progress/saved-progress-experience.tsx",
    "src/app/results/results-experience.tsx",
    "src/app/exams/exams-recovery.tsx",
    "src/app/assessments/assessments-recovery.tsx",
  ];

  for (const relativePath of emptyStateFiles) {
    const source = readRepoFile(relativePath);

    assert.match(source, /StudentRouteRecovery/, `${relativePath} should use StudentRouteRecovery.`);

    const hrefs = extractRecoveryActionHrefs(source);
    assert(hrefs.length > 0, `Expected recovery actions in ${relativePath}.`);

    for (const href of hrefs) {
      assertAllowedMvpClickTarget(href, `${relativePath} recovery action`);
    }
  }
});

test("recommendations route keeps support-aware guidance and actionable cards", async () => {
  const recommendationsExperience = readRepoFile("src/app/recommendations/recommendations-experience.tsx");

  assert.match(recommendationsExperience, /href="\/support"/);
  assert.match(recommendationsExperience, /Open support hub/);

  const { getRecommendationsPageData } = await import("../src/modules/recommendations/service.ts");
  const pageData = await getRecommendationsPageData("walkthrough-student-001");

  assert(pageData.recommendations.length > 0, "Expected recommendations page data to expose actionable cards.");

  for (const recommendation of pageData.recommendations) {
    assert(recommendation.href, `Expected recommendation "${recommendation.title}" to expose an href.`);
    assert(recommendation.actionLabel, `Expected recommendation "${recommendation.title}" to expose an action label.`);
    assertAllowedMvpClickTarget(recommendation.href, `recommendation "${recommendation.title}"`);
  }
});

test("support route guidance maps accessibility and recommendations to the support hub", async () => {
  const { getSupportHubData } = await import("../src/modules/support/service.ts");
  const support = await getSupportHubData();
  const routeIds = support.routeGuidance.map((entry) => entry.routeId);

  assert(routeIds.includes("/support"), "Expected support route guidance to include /support.");
  assert(routeIds.includes("/accessibility"), "Expected support route guidance to include /accessibility.");
  assert(routeIds.includes("/recommendations"), "Expected support route guidance to include /recommendations.");

  for (const guidance of support.routeGuidance) {
    assertAllowedMvpClickTarget(guidance.href, `support route guidance "${guidance.routeId}"`);
  }

  assert(support.safetyReview.urgentHelpVisible, "Expected support safety review to keep urgent help visible.");
  assert(support.safetyReview.avoidsTherapeuticClaims, "Expected support safety review to avoid therapeutic claims.");
});

test("canonical recovery defaults stay aligned with support and recovery UX", () => {
  for (const path of CANONICAL_MVP_ROUTES_DEFINITION.recoveryDefaultActions) {
    assertAllowedMvpClickTarget(path, "canonical recovery default action");
  }

  const supportRoute = CANONICAL_MVP_ROUTES_DEFINITION.routes.find((route) => route.path === "/support");
  const accessibilityRoute = CANONICAL_MVP_ROUTES_DEFINITION.routes.find(
    (route) => route.path === "/accessibility",
  );

  assert.equal(supportRoute?.requiresAuth, false, "Expected /support to remain public.");
  assert.equal(accessibilityRoute?.requiresAuth, true, "Expected /accessibility to require sign-in.");
  assert.equal(
    accessibilityRoute?.studentShellWhenSignedIn,
    true,
    "Expected /accessibility to render in the student shell when signed in.",
  );
});
