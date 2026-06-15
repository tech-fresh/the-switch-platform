"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CmsEditorialActionType, CmsEditorialWorkflowStatus } from "@/modules/cms/types";

interface CmsWorkflowControlsProps {
  contentId: string;
  note: string;
  status: CmsEditorialWorkflowStatus;
  owner: string;
}

const workflowOptions: CmsEditorialWorkflowStatus[] = [
  "queued-review",
  "fact-check",
  "approved",
  "blocked",
];

const workflowActions: CmsEditorialActionType[] = [
  "review",
  "fact-check",
  "approve",
  "block",
  "rollback",
];

export function CmsWorkflowControls({
  contentId,
  note,
  status,
  owner,
}: CmsWorkflowControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<CmsEditorialWorkflowStatus>(status);
  const [nextActionType, setNextActionType] = useState<CmsEditorialActionType>(inferActionType(status));
  const [nextNote, setNextNote] = useState(note);
  const [nextOwner, setNextOwner] = useState(owner);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function saveWorkflow() {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await fetch(`/api/cms/workflow/${encodeURIComponent(contentId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextActionType === "rollback" ? "queued-review" : nextStatus,
          note: nextNote,
          owner: nextOwner,
          actionType: nextActionType,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(payload?.error ?? "Editorial workflow update failed.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Workflow action
        </span>
        <select
          value={nextActionType}
          onChange={(event) => {
            const actionType = event.target.value as CmsEditorialActionType;
            setNextActionType(actionType);
            setNextStatus(getStatusForAction(actionType, status));
          }}
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
        >
          {workflowActions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Workflow status
        </span>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as CmsEditorialWorkflowStatus)}
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
          disabled={nextActionType === "rollback"}
        >
          {workflowOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Owner
        </span>
        <input
          value={nextOwner}
          onChange={(event) => setNextOwner(event.target.value)}
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Editorial note
        </span>
        <textarea
          value={nextNote}
          onChange={(event) => setNextNote(event.target.value)}
          rows={3}
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-900"
        />
      </label>
      <button
        type="button"
        onClick={saveWorkflow}
        disabled={isPending}
        className="inline-flex items-center justify-center border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save workflow step"}
      </button>
      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
    </div>
  );
}

function inferActionType(status: CmsEditorialWorkflowStatus): CmsEditorialActionType {
  if (status === "fact-check") {
    return "fact-check";
  }
  if (status === "approved") {
    return "approve";
  }
  if (status === "blocked") {
    return "block";
  }
  return "review";
}

function getStatusForAction(
  actionType: CmsEditorialActionType,
  currentStatus: CmsEditorialWorkflowStatus,
): CmsEditorialWorkflowStatus {
  if (actionType === "approve") {
    return "approved";
  }

  if (actionType === "fact-check") {
    return "fact-check";
  }

  if (actionType === "block") {
    return "blocked";
  }

  if (actionType === "rollback") {
    return currentStatus === "approved" ? "fact-check" : "queued-review";
  }

  return "queued-review";
}
