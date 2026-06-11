"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CmsEditorialWorkflowStatus } from "@/modules/cms/types";

interface CmsWorkflowControlsProps {
  contentId: string;
  note: string;
  status: CmsEditorialWorkflowStatus;
}

const workflowOptions: CmsEditorialWorkflowStatus[] = [
  "queued-review",
  "fact-check",
  "approved",
  "blocked",
];

export function CmsWorkflowControls({
  contentId,
  note,
  status,
}: CmsWorkflowControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<CmsEditorialWorkflowStatus>(status);
  const [nextNote, setNextNote] = useState(note);
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
          status: nextStatus,
          note: nextNote,
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
          Workflow status
        </span>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as CmsEditorialWorkflowStatus)}
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
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
