import { NextResponse } from "next/server";

import { updateCmsEditorialWorkflowRecord } from "@/modules/cms/service";
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
  const { contentId } = await context.params;

  try {
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
      owner: payload.owner?.trim(),
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
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown CMS workflow update error",
      },
      { status: 400 },
    );
  }
}
