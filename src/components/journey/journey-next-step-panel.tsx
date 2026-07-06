"use client";

import Link from "next/link";

import type { JourneyContext } from "@/modules/journey/types";

interface JourneyNextStepPanelProps {
  journey: JourneyContext;
}

export function JourneyNextStepPanel({ journey }: JourneyNextStepPanelProps) {
  const { primaryAction, secondaryActions } = journey;

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
      aria-label="What to do next"
    >
      <p className="text-sm text-white/70">What to do next</p>
      <Link href={primaryAction.href} className="mt-2 block text-lg font-semibold text-white">
        {primaryAction.label}
      </Link>
      <p className="mt-1 text-sm text-white/60">{primaryAction.reason}</p>
      {secondaryActions.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {secondaryActions.map((action) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className="text-sm text-sky-300 underline-offset-2 hover:underline"
              >
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
