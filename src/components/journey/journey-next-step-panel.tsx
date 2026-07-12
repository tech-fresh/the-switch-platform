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
      className="rounded-2xl border border-[#ddd3c6] bg-white p-4 shadow-sm"
      aria-label="What to do next"
    >
      <p className="text-sm text-[#6f7b77]">What to do next</p>
      <Link href={primaryAction.href} className="mt-2 block text-lg font-semibold text-[#163038]">
        {primaryAction.label}
      </Link>
      <p className="mt-1 text-sm text-[#52646a]">{primaryAction.reason}</p>
      {secondaryActions.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {secondaryActions.map((action) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className="text-sm text-[#0f766e] underline-offset-2 hover:underline"
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
