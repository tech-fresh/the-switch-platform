import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";

interface PremiumContinueRevisionCardProps {
  title: string;
  subtitle: string;
  progress: number;
  href: string;
  actionLabel: string;
}

function ProgressRing({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className="relative grid size-20 shrink-0 place-items-center rounded-full border-[6px] border-[#6C4EFF]/30 bg-[#0B0F17] text-lg font-bold text-white shadow-inner"
      aria-label={`Progress: ${clamped}%`}
    >
      {clamped}%
    </div>
  );
}

export function PremiumContinueRevisionCard({
  title,
  subtitle,
  progress,
  href,
  actionLabel,
}: PremiumContinueRevisionCardProps) {
  return (
    <article className={`${premiumUi.card} md:col-span-2 xl:col-span-1`}>
      <p className={`${premiumUi.eyebrowAccent}`}>Continue revision</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
          <p className={`mt-2 ${premiumUi.body}`}>{subtitle}</p>
          <div className={`mt-4 max-w-xs ${premiumUi.progressTrack}`}>
            <div className={premiumUi.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <Link href={href} className={`mt-5 ${premiumUi.primaryBtn}`}>
            {actionLabel}
          </Link>
        </div>
        <ProgressRing value={progress} />
      </div>
    </article>
  );
}
