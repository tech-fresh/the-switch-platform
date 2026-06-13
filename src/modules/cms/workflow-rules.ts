import type {
  CmsContentReference,
  CmsEditorialActionType,
  CmsEditorialWorkflowRecord,
  CmsPublishGateSummary,
} from "./types";

const requiredWorkflowNotes = new Set<CmsEditorialActionType>(["block", "rollback"]);

export class CmsWorkflowValidationError extends Error {}

export function buildCmsPublishGateSummary(
  item: CmsContentReference,
  workflowStatus: CmsEditorialWorkflowRecord["status"],
): CmsPublishGateSummary {
  const checks = [
    {
      checkId: "publication-status",
      label: "Publication status is published",
      passed: item.status === "published",
      detail:
        item.status === "published"
          ? "The content metadata is marked as published."
          : "The content is still marked as draft and cannot ship to student routes.",
    },
    {
      checkId: "editorial-review",
      label: "Editorial review is complete",
      passed: item.reviewStatus === "reviewed",
      detail:
        item.reviewStatus === "reviewed"
          ? "Editorial review status is complete."
          : `Current review status is ${item.reviewStatus ?? "not-set"}, so the content is not yet through editorial review.`,
    },
    {
      checkId: "fact-check",
      label: "Fact-check is verified",
      passed: item.factCheckStatus === "verified",
      detail:
        item.factCheckStatus === "verified"
          ? "Fact-check verification is complete."
          : `Current fact-check status is ${item.factCheckStatus ?? "not-set"}, so trusted verification is still incomplete.`,
    },
    {
      checkId: "source-attribution",
      label: "Trusted source attribution is complete",
      passed: item.trustedSourceAttributionComplete === true,
      detail:
        item.trustedSourceAttributionComplete
          ? "Named source attribution and checked-against evidence are present."
          : item.gateReason ?? "Source attribution or checked-against evidence is still incomplete.",
    },
    {
      checkId: "workflow-approval",
      label: "Workflow status is approved",
      passed: workflowStatus === "approved",
      detail:
        workflowStatus === "approved"
          ? "The editorial workflow has reached approved status."
          : `Workflow status is currently ${workflowStatus}, so the content is not yet approved for publication.`,
    },
  ];
  const blockedReasons = checks.filter((check) => !check.passed).map((check) => check.detail);

  return {
    readyToPublish: blockedReasons.length === 0,
    blockedReasons,
    checks,
  };
}

export function assertValidCmsWorkflowUpdate(input: {
  fromStatus: CmsEditorialWorkflowRecord["status"];
  nextStatus: CmsEditorialWorkflowRecord["status"];
  actionType: CmsEditorialActionType;
  note: string;
  reference: CmsContentReference;
}) {
  const expectedStatus = getExpectedStatusForAction(input.actionType, input.fromStatus);

  if (input.nextStatus !== expectedStatus) {
    throw new CmsWorkflowValidationError(
      `The ${input.actionType} action must move content from ${input.fromStatus} to ${expectedStatus}.`,
    );
  }

  if (requiredWorkflowNotes.has(input.actionType) && input.note.length === 0) {
    throw new CmsWorkflowValidationError(
      `A workflow note is required when the action is ${input.actionType}.`,
    );
  }

  if (input.actionType === "approve") {
    const publishGate = buildCmsPublishGateSummary(input.reference, input.nextStatus);
    const blockingChecks = publishGate.checks.filter(
      (check) => !check.passed && check.checkId !== "workflow-approval",
    );

    if (blockingChecks.length > 0) {
      throw new CmsWorkflowValidationError(
        `Content cannot be approved yet: ${blockingChecks.map((check) => check.detail).join(" ")}`,
      );
    }
  }
}

function getExpectedStatusForAction(
  actionType: CmsEditorialActionType,
  fromStatus: CmsEditorialWorkflowRecord["status"],
): CmsEditorialWorkflowRecord["status"] {
  if (actionType === "rollback") {
    return fromStatus === "approved" ? "fact-check" : "queued-review";
  }

  if (actionType === "approve") {
    return "approved";
  }

  if (actionType === "fact-check") {
    return "fact-check";
  }

  if (actionType === "block") {
    return "blocked";
  }

  return "queued-review";
}
