import test from "node:test";
import assert from "node:assert/strict";

test("support hub data keeps signposting-only safety rules visible", async () => {
  const {
    buildSupportRouteGuidance,
    buildSupportSafetyReview,
    validateSupportHubSafety,
  } = await import("../src/modules/support/safety.ts");

  const support = {
    title: "Support hub",
    description: "Trusted support links only.",
    safetyNotice:
      "If you feel unsafe or need urgent help, use urgent help straight away and speak to a trusted adult, teacher, or school support lead.",
    safetyReview: buildSupportSafetyReview(),
    routeGuidance: buildSupportRouteGuidance(),
    urgentHelp: [
      { optionId: "a", name: "Childline", actionText: "Talk now", contactLabel: "Call", url: "https://example.com/a", lastReviewedAt: "2026-06-14" },
      { optionId: "b", name: "Shout", actionText: "Text now", contactLabel: "Text", url: "https://example.com/b", lastReviewedAt: "2026-06-14" },
      { optionId: "c", name: "NHS", actionText: "Urgent help", contactLabel: "Open", url: "https://example.com/c", lastReviewedAt: "2026-06-14" },
    ],
    examSupportGuides: [],
    trustedResources: [],
  };

  assert.equal(support.safetyReview.avoidsTherapeuticClaims, true);
  assert.equal(support.safetyReview.urgentHelpVisible, true);
  assert.ok(support.safetyNotice.includes("urgent help"));
  assert.ok(support.safetyNotice.includes("trusted adult"));
  assert.deepEqual(validateSupportHubSafety(support), []);
});

test("support route guidance covers support, accessibility, and recommendations", async () => {
  const { buildSupportRouteGuidance } = await import("../src/modules/support/safety.ts");

  const guidance = buildSupportRouteGuidance();
  const routeIds = guidance.map((item) => item.routeId).sort();

  assert.deepEqual(routeIds, ["/accessibility", "/recommendations", "/support"]);
  assert.ok(
    guidance.every((item) => item.href === "/support" || item.href === item.routeId),
  );
});
