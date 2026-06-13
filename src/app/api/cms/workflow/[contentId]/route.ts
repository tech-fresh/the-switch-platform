import { NextResponse } from "next/server";

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
      return NextResponse.json(
        {
          error: "status must be a supported editorial workflow state.",
        },
        { status: 400 },
      );
    }

    if (payload.actionType && !allowedActions.has(payload.actionType)) {
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
      return NextResponse.json(
        {
          error: "CMS content item not found for workflow update.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      record,
    });
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 401 },
      );
    }

    if (error instanceof AuthorizationRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 403 },
      );
    }

    if (error instanceof CmsWorkflowValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown CMS workflow update error",
      },
      { status: 400 },
    );
  }
}
