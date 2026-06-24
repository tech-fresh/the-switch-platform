"use client";

import Link from "next/link";
import { useState } from "react";

export function PlannerPromptCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <article className="overflow-hidden border border-stone-200 bg-white shadow-lg shadow-stone-200/60">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="relative border-b border-stone-200 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 p-6 text-white md:border-b-0 md:border-r">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-3 border border-white/30 px-2 py-0.5 text-[10px] text-white/90 hover:bg-white/10"
            aria-label="Dismiss planner prompt"
          >
            Close
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-200">Planner</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Your study plan, built around you</h2>
          <p className="mt-3 text-sm leading-6 text-teal-100">
            Not a popup clone — a bento panel that links planner, progress, and access tools.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
            <div className="border border-white/20 bg-white/10 p-2">Subjects</div>
            <div className="border border-white/20 bg-white/10 p-2">Practice</div>
            <div className="border border-white/20 bg-white/10 p-2">Exams</div>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          <ul className="space-y-3 text-sm text-stone-700">
            <li className="flex gap-3 border-l-4 border-teal-500 pl-3">
              Built around your onboarding subjects and qualification path
            </li>
            <li className="flex gap-3 border-l-4 border-emerald-500 pl-3">
              Links exams, timed practice, and saved progress through the API layer
            </li>
            <li className="flex gap-3 border-l-4 border-amber-500 pl-3">
              Respects accessibility choices and access arrangement signposting
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/progress"
              className="bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Create my plan
            </Link>
            <Link
              href="/accessibility"
              className="border border-amber-300 bg-[#fff8c4] px-5 py-2.5 text-sm font-semibold text-amber-950"
            >
              SEND colour options
            </Link>
            <Link
              href="/support"
              className="border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
            >
              Support hub
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
