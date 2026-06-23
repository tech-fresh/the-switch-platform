import Link from "next/link";

import { SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";

interface SendSupportRailProps {
  summary?: string | null;
  chips?: string[];
}

export function SendSupportRail({ summary, chips = [] }: SendSupportRailProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Access &amp; SEND signposting
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Your MVP support setup</h2>
          <p className="text-sm leading-6 text-slate-600">
            {summary ??
              "Optional onboarding choices appear here with links to Accessibility, Access Arrangements foundation, and Support Hub."}
          </p>
          {chips.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {SEND_COLOUR_CHIPS.map((chip) => (
            <Link
              key={chip.id}
              href={chip.href}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${chip.className}`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
