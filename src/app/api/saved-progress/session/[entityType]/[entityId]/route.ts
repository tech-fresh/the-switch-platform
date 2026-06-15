import { NextResponse } from "next/server";

import { buildOperationsEvent, recordOperationsEvent } from "@/lib/server/operations-event";
import { getAuthenticatedSwitchRequestContext } from "@/lib/server/request-context";
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
  const requestContext = await getAuthenticatedSwitchRequestContext();
  const { entityType, entityId } = await context.params;

  if (!allowedEntityTypes.has(entityType as SavedProgressEntityType)) {
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "saved-progress",
        action: "status-update-invalid-entity",
        status: "warning",
        entityId,
        detail: "A saved-progress status change was rejected because the entity type was not supported.",
      }),
    );
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
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "saved-progress",
          action: "status-update-invalid-status",
          status: "warning",
          userId: requestContext.userId,
          entityId,
          detail: "A saved-progress status change was rejected because the requested status was not supported.",
        }),
      );
      return NextResponse.json(
        {
          error: "status must be a supported saved-progress status.",
        },
        { status: 400 },
      );
    }

    const existing = await getSavedProgress(
      requestContext.userId,
      entityType as SavedProgressEntityType,
      entityId,
      requestContext.repositories.savedProgress,
    );

    if (!existing) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "saved-progress",
          action: "status-update-missing-record",
          status: "warning",
          userId: requestContext.userId,
          entityId,
          detail: "A saved-progress status change targeted a record that was not found for the active user.",
        }),
      );
      return NextResponse.json(
        {
          error: "Saved progress record not found for the active user.",
        },
        { status: 404 },
      );
    }

    if (!canTransitionSavedProgressStatus(existing.status, nextStatus)) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "saved-progress",
          action: "status-update-transition-blocked",
          status: "warning",
          userId: requestContext.userId,
          entityId,
          detail: `A saved-progress record could not move from ${existing.status} to ${nextStatus}.`,
        }),
      );
      return NextResponse.json(
        {
          error: `Saved progress cannot move from ${existing.status} to ${nextStatus}.`,
        },
        { status: 409 },
      );
    }

    const record = await markSavedProgressStatus(
      requestContext.userId,
      entityType as SavedProgressEntityType,
      entityId,
      nextStatus,
      requestContext.repositories.savedProgress,
    );

    if (!record) {
      recordOperationsEvent(
        buildOperationsEvent({
          domain: "saved-progress",
          action: "status-update-save-failed",
          status: "failure",
          userId: requestContext.userId,
          entityId,
          detail: "A saved-progress record could not be updated after the status transition was accepted.",
        }),
      );
      return NextResponse.json(
        {
          error: "Saved progress record could not be updated.",
        },
        { status: 404 },
      );
    }

    recordOperationsEvent(
      buildOperationsEvent({
        domain: "saved-progress",
        action: "status-updated",
        status: "success",
        userId: requestContext.userId,
        entityId,
        detail: `Saved progress is now marked as ${record.status}.`,
      }),
    );
    return NextResponse.json({
      record,
    });
  } catch (error) {
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "saved-progress",
        action: "status-update-failed",
        status: "failure",
        entityId,
        detail: error instanceof Error ? error.message : "Unknown saved progress update error",
      }),
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown saved progress update error",
      },
      { status: 400 },
    );
  }
}
