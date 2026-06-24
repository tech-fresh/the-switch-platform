import Link from "next/link";

import { SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";

interface SendSupportRailProps {
  summary?: string | null;
  chips?: string[];
}

export function SendSupportRail({ summary, chips = [] }: SendSupportRailProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-700">
          Access &amp; SEND signposting
        </p>
        <h2 className="mt-2 text-xl font-semibold text-stone-950">Your MVP support setup</h2>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          {summary ??
            "Optional onboarding choices appear here with links to Accessibility, Access Arrangements foundation, and Support Hub."}
        </p>
        {chips.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/accessibility"
            className="bg-stone-950 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
          >
            Accessibility module
          </Link>
          <Link
            href="/how-it-works"
            className="border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-800 hover:border-teal-400"
          >
            Access arrangements
          </Link>
          <Link
            href="/support"
            className="border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-800 hover:border-teal-400"
          >
            Support hub
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        {SEND_COLOUR_CHIPS.map((chip) => (
          <Link
            key={chip.id}
            href={chip.href}
            className="group flex flex-col border border-stone-200 bg-white p-3 shadow-sm transition hover:border-teal-400 hover:shadow-md"
          >
            <span
              className="mb-2 h-14 w-full border border-stone-200 shadow-inner"
              style={{ backgroundColor: chip.swatch }}
              aria-hidden
            />
            <span className="text-xs font-semibold text-stone-800 group-hover:text-teal-800">{chip.label}</span>
            <span className="mt-1 text-[10px] text-stone-500">Tap to open settings</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
