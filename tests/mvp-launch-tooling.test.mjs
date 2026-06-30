import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { assertAllowedMvpClickTarget } from "../scripts/canonical-mvp-routes.mjs";
import {
  LOCAL_LAUNCH_REHEARSAL_CORE_STEPS,
  LOCAL_LAUNCH_REHEARSAL_EXTENDED_STEPS,
  LOCAL_READINESS_PROBE_ROUTES,
} from "../scripts/local-launch-rehearsal-order.mjs";
import { LOCAL_READINESS_PROBE_ROUTES as launchUtilsProbeRoutes } from "../scripts/launch-utils.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("local launch rehearsal core order is documented and wired into the wrapper", () => {
  const wrapperSource = readRepoFile("scripts/local-launch-readiness.mjs");
  const docSource = readRepoFile("docs/LOCAL-LAUNCH-REHEARSAL.md");

  assert.equal(LOCAL_LAUNCH_REHEARSAL_CORE_STEPS.length, 6);
  assert.match(wrapperSource, /LOCAL_LAUNCH_REHEARSAL_CORE_STEPS/);
  assert.match(wrapperSource, /formatLocalLaunchReadinessSummary/);
  assert.match(docSource, /verify:local-launch-readiness/);

  for (const step of LOCAL_LAUNCH_REHEARSAL_CORE_STEPS) {
    assert(step.id, `Expected step "${step.label}" to declare an id.`);
    assert(step.story, `Expected step "${step.label}" to declare a readiness story.`);
    assert(
      wrapperSource.includes(step.id) || wrapperSource.includes(step.npmScript) || wrapperSource.includes(step.runner ?? ""),
      `Expected local-launch-readiness wrapper to reference ${step.id}.`,
    );
    assert(docSource.includes(step.npmScript), `Expected LOCAL-LAUNCH-REHEARSAL.md to document ${step.npmScript}.`);
  }
});

test("extended MVP rehearsals stay documented for release hardening", () => {
  const docSource = readRepoFile("docs/LOCAL-LAUNCH-REHEARSAL.md");

  assert(LOCAL_LAUNCH_REHEARSAL_EXTENDED_STEPS.length >= 5);

  for (const step of LOCAL_LAUNCH_REHEARSAL_EXTENDED_STEPS) {
    assert(docSource.includes(step.npmScript), `Expected extended rehearsal doc for ${step.npmScript}.`);
  }
});

test("launch utils and rehearsal order share the same readiness probe routes", () => {
  assert.deepEqual(launchUtilsProbeRoutes, LOCAL_READINESS_PROBE_ROUTES);
  assert.deepEqual(LOCAL_READINESS_PROBE_ROUTES, [
    "/",
    "/api/auth/providers",
    "/api/account/overview",
    "/api/dashboard/home",
  ]);
});

test("route smoke and launch e2e export reusable rehearsal runners", async () => {
  const { runRouteSmoke } = await import("../scripts/route-smoke.mjs");
  const { runLaunchE2e } = await import("../scripts/launch-e2e.mjs");

  assert.equal(typeof runRouteSmoke, "function");
  assert.equal(typeof runLaunchE2e, "function");
});

test("route smoke uses canonical signed-out route behavior", () => {
  const smokeSource = readRepoFile("scripts/route-smoke.mjs");

  assert.match(smokeSource, /assertSignedOutRouteBehavior/);
  assert.match(smokeSource, /CANONICAL_MVP_ROUTES/);
  assert.doesNotMatch(smokeSource, /async function assertSignedOutRouteBehavior/);
});

test("launch e2e rehearses save and resume through saved progress", () => {
  const e2eSource = readRepoFile("scripts/launch-e2e.mjs");

  assert.match(e2eSource, /ensureWalkthroughStudentOnboardingComplete/);
  assert.match(e2eSource, /method: "PATCH"/);
  assert.match(e2eSource, /saved-progress\/overview/);
  assert.match(e2eSource, /examSavedSession\.href/);
});

test("primary homepage and dashboard CTAs stay on allowed MVP targets", async () => {
  const marketingSections = readRepoFile("src/components/streamlined/mark32-marketing-sections.tsx");
  const marketingHrefs = [...marketingSections.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  assert(marketingHrefs.length > 0, "Expected homepage marketing CTAs to declare href targets.");

  for (const href of marketingHrefs) {
    assertAllowedMvpClickTarget(href, "homepage marketing CTA");
  }

  const { getDashboardHomeData } = await import("../src/modules/dashboard/service.ts");
  const dashboard = await getDashboardHomeData("guest-preview");

  for (const card of dashboard.routeCards) {
    assertAllowedMvpClickTarget(card.href, `dashboard primary CTA "${card.title}"`);
  }
});

test("launch utils binds the local rehearsal server to loopback", () => {
  const launchUtilsSource = readRepoFile("scripts/launch-utils.mjs");

  assert.match(launchUtilsSource, /"-H", "127\.0\.0\.1"/);
  assert.match(launchUtilsSource, /LOCAL_READINESS_PROBE_ROUTES/);
});
