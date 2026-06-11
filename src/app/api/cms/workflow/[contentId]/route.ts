import { NextResponse } from "next/server";

import { updateCmsEditorialWorkflowRecord } from "@/modules/cms/service";
import type { CmsEditorialWorkflowStatus } from "@/modules/cms/types";

const allowedStatuses = new Set<CmsEditorialWorkflowStatus>([
  "queued-review",
  "fact-check",
  "approved",
  "blocked",
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
    }>;

    if (!payload.status || !allowedStatuses.has(payload.status)) {
      return NextResponse.json(
        {
          error: "status must be a supported editorial workflow state.",
        },
        { status: 400 },
      );
    }

    const record = await updateCmsEditorialWorkflowRecord({
      contentId,
      status: payload.status,
      note: payload.note?.trim() ?? "",
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
