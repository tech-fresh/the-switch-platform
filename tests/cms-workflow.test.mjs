import test from "node:test";
import assert from "node:assert/strict";

import {
  CmsWorkflowValidationError,
  assertValidCmsWorkflowUpdate,
  buildCmsPublishGateSummary,
} from "../src/modules/cms/workflow-rules.ts";

function createReference(overrides = {}) {
  return {
    contentId: "topic-quadratics",
    kind: "topic",
    title: "Quadratic equations",
    subjectId: "maths",
    topicId: "quadratics",
    status: "published",
    reviewStatus: "reviewed",
    factCheckStatus: "verified",
    studentVisible: true,
    trustedSourceAttributionComplete: true,
    gateReason: "All launch gates are satisfied.",
    sourceReference: "AQA GCSE Mathematics specification",
    updatedAt: "2026-06-12T12:00:00.000Z",
    sourceProviderId: "seed-content-provider",
    ...overrides,
  };
}

test("publish gate summary is ready only when all launch checks pass", () => {
  const ready = buildCmsPublishGateSummary(createReference(), "approved");
  assert.equal(ready.readyToPublish, true);
  assert.equal(ready.blockedReasons.length, 0);

  const blocked = buildCmsPublishGateSummary(
    createReference({
      factCheckStatus: "in-progress",
      studentVisible: false,
      gateReason: "Fact-check verification is still incomplete.",
    }),
    "fact-check",
  );

  assert.equal(blocked.readyToPublish, false);
  assert.ok(blocked.blockedReasons.some((reason) => reason.includes("fact-check")));
});

test("approval is blocked until publish-gate prerequisites pass", () => {
  assert.throws(
    () =>
      assertValidCmsWorkflowUpdate({
        fromStatus: "fact-check",
        nextStatus: "approved",
        actionType: "approve",
        note: "Ready for release",
        reference: createReference({
          factCheckStatus: "in-progress",
          studentVisible: false,
          gateReason: "Fact-check verification is still incomplete.",
        }),
      }),
    CmsWorkflowValidationError,
  );
});

test("blocking or rollback actions require an editorial note", () => {
  assert.throws(
    () =>
      assertValidCmsWorkflowUpdate({
        fromStatus: "fact-check",
        nextStatus: "blocked",
        actionType: "block",
        note: "",
        reference: createReference({ studentVisible: false }),
      }),
    CmsWorkflowValidationError,
  );
});
