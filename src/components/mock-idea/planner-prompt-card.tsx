"use client";

import Link from "next/link";
import { useState } from "react";

import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface PlannerPromptCardProps {
  initialDismissed?: boolean;
}

export function PlannerPromptCard({ initialDismissed = false }: PlannerPromptCardProps) {
  const [dismissed, setDismissed] = useState(initialDismissed);
  const [saving, setSaving] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleDismiss = async () => {
    setDismissed(true);
    setSaving(true);

    try {
      await fetch("/api/dashboard/ui-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plannerPromptDismissed: true }),
      });
    } catch {
      // Keep dismissed locally; persistence retry on next visit is acceptable for MVP.
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="relative border-b border-stone-200 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 p-6 text-white md:border-b-0 md:border-r">
          <button
            type="button"
            onClick={handleDismiss}
            disabled={saving}
            className="absolute right-3 top-3 rounded-lg border border-white/30 px-2 py-0.5 text-[10px] text-white/90 hover:bg-white/10 disabled:opacity-60"
            aria-label="Dismiss planner prompt"
          >
            Close
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-100">Planner</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight">Your study plan, built around you</h2>
          <p className="mt-3 text-sm leading-6 text-teal-50/90">
            Links planner, progress, exams, and access settings in one panel.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
            <div className="rounded-lg border border-white/20 bg-white/10 p-2">Subjects</div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-2">Practice</div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-2">Exams</div>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          <p className="text-sm leading-7 text-slate-600">
            Your plan pulls from onboarding subjects, saved sessions, and accessibility choices — all through
            the API layer, not hard-coded UI rules.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/progress" className={mark32Ui.primaryBtn}>
              Create my plan
            </Link>
            <Link
              href="/accessibility"
              className="rounded-2xl border border-amber-300 bg-[#fff8c4] px-5 py-2.5 text-sm font-bold text-amber-950"
            >
              SEND colour options
            </Link>
            <Link href="/support" className={mark32Ui.secondaryBtn}>
              Support hub
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
