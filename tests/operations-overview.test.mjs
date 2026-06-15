import test from "node:test";
import assert from "node:assert/strict";

test("operations overview warns when launch-critical infrastructure is still provisional", async () => {
  const { buildOperationsOverview } = await import("../src/modules/operations/overview.ts");

  const overview = buildOperationsOverview({
    generatedAt: "2026-06-14T12:00:00.000Z",
    authMode: "preview-cookie",
    allowRedirectSignIn: true,
    activeAuthSessions: 2,
    persistenceDriver: "local-json",
    isPrototypePersistence: true,
    dataDirectory: "/tmp/switch-data",
    totalSavedProgressRecords: 4,
    submittedSavedProgressCount: 2,
    savedProgressWithSupportSnapshots: 3,
    assessmentCount: 6,
    examPaperCount: 7,
    contentTopicCount: 11,
    cmsBackendMode: "live",
    queuedReviewCount: 1,
    blockedCount: 1,
    rollbackCount: 2,
  });

  assert.equal(overview.overallStatus, "warning");
  assert.equal(overview.alerts.length >= 3, true);
  assert.equal(overview.domains.find((domain) => domain.domainId === "auth")?.status, "warning");
  assert.equal(
    overview.domains.find((domain) => domain.domainId === "saved-progress")?.status,
    "warning",
  );
});

test("operations overview can report a healthier launch picture", async () => {
  const { buildOperationsOverview } = await import("../src/modules/operations/overview.ts");

  const overview = buildOperationsOverview({
    generatedAt: "2026-06-14T12:00:00.000Z",
    authMode: "oidc",
    allowRedirectSignIn: true,
    activeAuthSessions: 8,
    persistenceDriver: "local-json",
    isPrototypePersistence: false,
    dataDirectory: "/srv/switch-data",
    totalSavedProgressRecords: 5,
    submittedSavedProgressCount: 3,
    savedProgressWithSupportSnapshots: 5,
    assessmentCount: 6,
    examPaperCount: 7,
    contentTopicCount: 11,
    cmsBackendMode: "live",
    queuedReviewCount: 0,
    blockedCount: 0,
    rollbackCount: 1,
  });

  assert.equal(overview.overallStatus, "healthy");
  assert.equal(overview.alertCount, 0);
  assert.equal(
    overview.recoveryReadiness.every((item) => item.status === "ready"),
    true,
  );
});
