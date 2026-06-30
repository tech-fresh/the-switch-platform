import Link from "next/link";

import type { DailyMotivation } from "@/modules/motivation/service";

interface Mark32DailyQuoteProps {
  motivation: DailyMotivation;
}

function getToneClasses(colour: DailyMotivation["colour"]): string {
  switch (colour) {
    case "amber":
      return "border-amber-200 bg-amber-50/70";
    case "sky":
      return "border-sky-200 bg-sky-50/70";
    case "rose":
      return "border-rose-200 bg-rose-50/70";
    default:
      return "border-teal-200 bg-teal-50/70";
  }
}

function getBadgeClasses(colour: DailyMotivation["colour"]): string {
  switch (colour) {
    case "amber":
      return "bg-amber-100 text-amber-900";
    case "sky":
      return "bg-sky-100 text-sky-900";
    case "rose":
      return "bg-rose-100 text-rose-900";
    default:
      return "bg-teal-100 text-teal-900";
  }
}

export function Mark32DailyQuote({ motivation }: Mark32DailyQuoteProps) {
  return (
    <article className={`rounded-3xl border p-6 shadow-sm ${getToneClasses(motivation.colour)}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600">Daily motivation</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">One thought to carry into today</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(motivation.colour)}`}>
          {motivation.theme}
        </span>
      </div>

      <blockquote className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-stone-950 sm:text-2xl">
        &ldquo;{motivation.quote}&rdquo;
      </blockquote>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-t border-stone-200/80 pt-4">
        <div>
          <p className="text-sm font-semibold text-stone-950">{motivation.speaker}</p>
          <p className="mt-1 text-sm text-stone-600">{motivation.region}</p>
          <p className="mt-1 text-sm text-stone-600">{motivation.occupation}</p>
        </div>
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            What to do next
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-700">{motivation.reflection}</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">{motivation.focusLabel}</p>
          {motivation.learnMoreHref ? (
            <Link href={motivation.learnMoreHref} className="mt-3 inline-flex text-sm font-semibold text-teal-900 hover:opacity-80">
              Learn more
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
