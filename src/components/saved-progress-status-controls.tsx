"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type {
  SavedProgressEntityType,
  SavedProgressRecoveryState,
  SavedProgressStatus,
} from "@/modules/saved-progress/types";

interface SavedProgressStatusControlsProps {
  entityId: string;
  entityType: SavedProgressEntityType;
  recoveryState: SavedProgressRecoveryState;
  status: SavedProgressStatus;
}

export function SavedProgressStatusControls({
  entityId,
  entityType,
  recoveryState,
  status,
}: SavedProgressStatusControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nextStatus = status === "paused" ? "in-progress" : "paused";
  const canToggleStatus = recoveryState === "resume-ready" && status !== "submitted";

  function updateStatus(nextValue: SavedProgressStatus) {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await fetch(
        `/api/saved-progress/session/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entityType,
            entityId,
            status: nextValue,
          }),
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(payload?.error ?? "Saved progress status could not be updated.");
        return;
      }

      router.refresh();
    });
  }

  if (!canToggleStatus) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => updateStatus(nextStatus)}
        disabled={isPending}
        className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? "Updating..."
          : status === "paused"
            ? "Mark ready to resume"
            : "Pause saved session"}
      </button>
      {errorMessage ? (
        <p className="text-sm text-rose-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
