import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";
import type { DailyMotivation } from "@/modules/motivation/service";

interface Mark32DailyQuoteProps {
  motivation: DailyMotivation;
}

export function Mark32DailyQuote({ motivation }: Mark32DailyQuoteProps) {
  return (
    <article className={`${premiumUi.card} border-[#6C4EFF]/20 bg-gradient-to-br from-[#6C4EFF]/10 to-[#121826]`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={premiumUi.eyebrowAccent}>Daily motivation</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-white">One thought to carry into today</h2>
        </div>
        <span className="rounded-full border border-[#6C4EFF]/30 bg-[#6C4EFF]/15 px-3 py-1 text-xs font-semibold text-[#00BFFF]">
          {motivation.theme}
        </span>
      </div>

      <blockquote className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-white sm:text-2xl">
        &ldquo;{motivation.quote}&rdquo;
      </blockquote>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-sm font-semibold text-white">{motivation.speaker}</p>
          <p className={`mt-1 ${premiumUi.body}`}>{motivation.region}</p>
          <p className={premiumUi.body}>{motivation.occupation}</p>
        </div>
        <div className="max-w-xl">
          <p className={premiumUi.eyebrow}>What to do next</p>
          <p className={`mt-2 ${premiumUi.body}`}>{motivation.reflection}</p>
          <p className="mt-2 text-sm font-semibold text-white">{motivation.focusLabel}</p>
          {motivation.learnMoreHref ? (
            <Link href={motivation.learnMoreHref} className={`mt-3 inline-flex ${premiumUi.linkAccent}`}>
              Learn more
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
