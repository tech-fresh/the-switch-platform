import { NextResponse } from "next/server";

import { buildOperationsEvent, recordOperationsEvent } from "@/lib/server/operations-event";
import {
  AuthenticationRequiredError,
  AuthorizationRequiredError,
  getAuthorizedSwitchRequestContext,
} from "@/lib/server/request-context";
import { updateCmsEditorialWorkflowRecord } from "@/modules/cms/service";
import { CmsWorkflowValidationError } from "@/modules/cms/workflow-rules";
import type { CmsEditorialActionType, CmsEditorialWorkflowStatus } from "@/modules/cms/types";

const allowedStatuses = new Set<CmsEditorialWorkflowStatus>([
  "queued-review",
  "fact-check",
  "approved",
  "blocked",
]);

const allowedActions = new Set<CmsEditorialActionType>([
  "review",
  "fact-check",
  "approve",
  "block",
  "rollback",
  "publish-check",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ contentId: string }> },
) {
  try {
    const requestContext = await getAuthorizedSwitchRequestContext(["editor", "admin"]);
    const { contentId } = await context.params;
    const payload = (await request.json()) as Partial<{
      status: CmsEditorialWorkflowStatus;
      note: string;
      owner: string;
      actionType: CmsEditorialActionType;
    }>;

    if (!payload.status || !allowedStatuses.has(payload.status)) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-invalid-status",
          status: "warning",
          entityId: contentId,
          detail: "A CMS workflow update was rejected because the requested status was not supported.",
        }),
      );
      return NextResponse.json(
        {
          error: "status must be a supported editorial workflow state.",
        },
        { status: 400 },
      );
    }

    if (payload.actionType && !allowedActions.has(payload.actionType)) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-invalid-action",
          status: "warning",
          entityId: contentId,
          detail: "A CMS workflow update was rejected because the requested action type was not supported.",
        }),
      );
      return NextResponse.json(
        {
          error: "actionType must be a supported editorial workflow action.",
        },
        { status: 400 },
      );
    }

    const record = await updateCmsEditorialWorkflowRecord({
      contentId,
      status: payload.status,
      note: payload.note?.trim() ?? "",
      owner: payload.owner?.trim() || requestContext.session.user.displayName,
      actionType: payload.actionType,
    });

    if (!record) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-missing-record",
          status: "warning",
          entityId: contentId,
          detail: "A CMS workflow update targeted a content item that was not found.",
        }),
      );
      return NextResponse.json(
        {
          error: "CMS content item not found for workflow update.",
        },
        { status: 404 },
      );
    }

    recordOperationsEvent(
      buildOperationsEvent({
        domain: "editorial",
        action: "workflow-updated",
        status: "success",
        userId: requestContext.session.user.userId,
        entityId: contentId,
        detail: `Editorial workflow moved to ${record.status}${payload.actionType ? ` through ${payload.actionType}` : ""}.`,
      }),
    );
    return NextResponse.json({
      record,
    });
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-auth-required",
          status: "warning",
          detail: "A CMS workflow update was blocked because there was no authenticated session.",
        }),
      );
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 401 },
      );
    }

    if (error instanceof AuthorizationRequiredError) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-role-denied",
          status: "warning",
          detail: "A CMS workflow update was blocked because the current session lacked the required role.",
        }),
      );
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 403 },
      );
    }

    if (error instanceof CmsWorkflowValidationError) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "editorial",
          action: "workflow-update-validation-blocked",
          status: "warning",
          detail: error.message,
        }),
      );
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 409 },
      );
    }

    recordOperationsEvent(
      buildOperationsEvent({
        domain: "editorial",
        action: "workflow-update-failed",
        status: "failure",
        detail: error instanceof Error ? error.message : "Unknown CMS workflow update error",
      }),
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown CMS workflow update error",
      },
      { status: 400 },
    );
  }
}
