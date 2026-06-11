import { NextResponse } from "next/server";

import { getRequestUserId } from "@/modules/auth/request";
import type { UpdateSavedProgressStatusRequest } from "@/modules/saved-progress/contracts";
import {
  canTransitionSavedProgressStatus,
  getSavedProgress,
  markSavedProgressStatus,
} from "@/modules/saved-progress/service";
import type { SavedProgressEntityType, SavedProgressStatus } from "@/modules/saved-progress/types";

const allowedEntityTypes = new Set<SavedProgressEntityType>([
  "exam-session",
  "timed-assessment-attempt",
]);

const allowedStatuses = new Set<SavedProgressStatus>([
  "in-progress",
  "paused",
  "submitted",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ entityType: string; entityId: string }> },
) {
  const userId = await getRequestUserId();
  const { entityType, entityId } = await context.params;

  if (!allowedEntityTypes.has(entityType as SavedProgressEntityType)) {
    return NextResponse.json(
      {
        error: "entityType must be a supported saved-progress entity type.",
      },
      { status: 400 },
    );
  }

  try {
    const payload = (await request.json()) as Partial<UpdateSavedProgressStatusRequest>;
    const nextStatus = payload.status;

    if (!nextStatus || !allowedStatuses.has(nextStatus)) {
      return NextResponse.json(
        {
          error: "status must be a supported saved-progress status.",
        },
        { status: 400 },
      );
    }

    const existing = await getSavedProgress(
      userId,
      entityType as SavedProgressEntityType,
      entityId,
    );

    if (!existing) {
      return NextResponse.json(
        {
          error: "Saved progress record not found for the active user.",
        },
        { status: 404 },
      );
    }

    if (!canTransitionSavedProgressStatus(existing.status, nextStatus)) {
      return NextResponse.json(
        {
          error: `Saved progress cannot move from ${existing.status} to ${nextStatus}.`,
        },
        { status: 409 },
      );
    }

    const record = await markSavedProgressStatus(
      userId,
      entityType as SavedProgressEntityType,
      entityId,
      nextStatus,
    );

    if (!record) {
      return NextResponse.json(
        {
          error: "Saved progress record could not be updated.",
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
        error: error instanceof Error ? error.message : "Unknown saved progress update error",
      },
      { status: 400 },
    );
  }
}
