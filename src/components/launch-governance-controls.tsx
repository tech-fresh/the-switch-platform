"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { GovernanceStatus } from "@/modules/governance/types";

interface LaunchGovernanceControlsProps {
  mode: "review" | "signoff" | "evidence" | "environment" | "smoke";
  targetId: string;
  owner: string;
  environment: string | null;
  note: string;
  status: GovernanceStatus | "recorded" | "still-needed";
}

export function LaunchGovernanceControls({
  mode,
  targetId,
  owner,
  environment,
  note,
  status,
}: LaunchGovernanceControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextOwner, setNextOwner] = useState(owner);
  const [nextEnvironment, setNextEnvironment] = useState(environment ?? "");
  const [nextNote, setNextNote] = useState(note);
  const [nextStatus, setNextStatus] = useState(status);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function saveRecord() {
    startTransition(async () => {
      setErrorMessage(null);

      const endpoint =
        mode === "review"
          ? `/api/governance/reviews/${encodeURIComponent(targetId)}`
          : mode === "signoff"
            ? `/api/governance/signoff/${encodeURIComponent(targetId)}`
            : mode === "evidence"
              ? `/api/governance/evidence/${encodeURIComponent(targetId)}`
              : mode === "environment"
                ? `/api/governance/environment/${encodeURIComponent(targetId)}`
                : `/api/governance/smoke/${encodeURIComponent(targetId)}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: nextOwner,
          environment: nextEnvironment,
          note: nextNote,
          summary: nextNote,
          detail: nextNote,
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(payload?.error ?? "Launch governance record update failed.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="mt-3 space-y-3 border-t border-stone-200 pt-3">
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Status
        </span>
        <select
          value={nextStatus}
          onChange={(event) =>
            setNextStatus(event.target.value as LaunchGovernanceControlsProps["status"])
          }
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
        >
          {mode === "evidence" ? (
            <>
              <option value="recorded">recorded</option>
              <option value="still-needed">still-needed</option>
            </>
          ) : (
            <>
              <option value="ready">ready</option>
              <option value="watch">watch</option>
            </>
          )}
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
          Environment
        </span>
        <input
          value={nextEnvironment}
          onChange={(event) => setNextEnvironment(event.target.value)}
          placeholder="production-eu-west-1"
          className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          {mode === "evidence"
            ? "Evidence summary"
            : mode === "environment"
              ? "Environment detail"
              : mode === "smoke"
                ? "Route check note"
                : "Approval note"}
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
        onClick={saveRecord}
        disabled={isPending}
        className="inline-flex items-center justify-center border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save record"}
      </button>
      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
    </div>
  );
}
