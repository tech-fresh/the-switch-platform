"use client";

import Link from "next/link";
import { useState } from "react";

export function PlannerPromptCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-100/40 sm:p-8">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
        aria-label="Dismiss planner prompt"
      >
        ✕
      </button>

      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-violet-100 to-sky-100 text-3xl">
          📅
        </div>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Build your personalised study plan in minutes
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>Built around your onboarding subjects 🎯</li>
          <li>Links exams, practice, and saved progress 🗓️</li>
          <li>Respects accessibility and access arrangements ♿</li>
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/progress"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create my plan
          </Link>
          <Link
            href="/accessibility"
            className="rounded-xl border border-amber-300 bg-[#fff8c4] px-5 py-2.5 text-sm font-semibold text-amber-950"
          >
            SEND colour options
          </Link>
        </div>
      </div>
    </div>
  );
}
