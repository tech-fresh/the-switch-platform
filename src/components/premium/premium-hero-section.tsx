import Link from "next/link";

import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { premiumUi } from "@/components/premium/premium-ui";
import { getPowerGridRankPresentation } from "@/lib/power-grid/rank-presentation";
import { getPublicRouteHref } from "@/lib/public-route";

interface PremiumHeroSectionProps {
  isAuthenticated: boolean;
  studyDaysThisWeek: number;
  readinessScore: number;
  xpTotal: number;
}

export function PremiumHeroSection({
  isAuthenticated,
  studyDaysThisWeek,
  readinessScore,
  xpTotal,
}: PremiumHeroSectionProps) {
  const rank = getPowerGridRankPresentation(xpTotal);
  const rankLabel = `${rank.rank.icon} ${rank.rank.label}`;

  return (
    <section className={`overflow-hidden rounded-3xl border border-[#ddd3c6] shadow-[0_30px_80px_rgba(117,94,66,0.12)] ${premiumUi.gradientHero}`}>
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-20 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
        <div className="max-w-2xl">
          <SwitchBrandLogo href="/" size="hero" />
          <p className={`mt-6 ${premiumUi.eyebrowAccent}`}>Premium GCSE revision platform</p>
          <h1 className={`mt-4 ${premiumUi.headingHero}`}>Switch On Your GCSE Revision</h1>
          <p className={`mt-5 max-w-xl ${premiumUi.body}`}>
            Exam-board revision, timed practice, progress tracking and smart quiz recommendations in one clean
            platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
              className={premiumUi.primaryBtn}
            >
              {isAuthenticated ? "Open dashboard" : "Start Learning Free"}
            </Link>
            <Link href={getPublicRouteHref("/subjects", isAuthenticated)} className={premiumUi.secondaryBtn}>
              View GCSE Subjects
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Study streak", value: `${studyDaysThisWeek} day${studyDaysThisWeek === 1 ? "" : "s"} this week` },
              { label: "Exam readiness", value: `${readinessScore}% ready` },
              { label: "Power Grid", value: rankLabel },
            ].map((item) => (
              <div key={item.label} className={premiumUi.statCard}>
                <p className={premiumUi.eyebrow}>{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-[#163038]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 lg:mt-0">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#0f766e]/18 to-[#b48a38]/14 blur-2xl" aria-hidden="true" />
          <div className={`relative ${premiumUi.card} space-y-4`}>
            <p className={premiumUi.eyebrowAccent}>Live dashboard preview</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Today's goal", value: "3 / 5 tasks", pct: 60 },
                { label: "Power Level", value: `${rank.rank.label} · L${rank.powerLevel}`, pct: rank.powerLevelProgressPercentage },
              ].map((item) => (
                <div key={item.label} className={premiumUi.cardMuted}>
                  <p className={premiumUi.eyebrow}>{item.label}</p>
                  <p className="mt-2 text-lg font-bold text-[#163038]">{item.value}</p>
                  <div className={`mt-3 ${premiumUi.progressTrack}`}>
                    <div className={premiumUi.progressFill} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-[#52646a]">
              Linear-style command centre — one clear next step, streak motivation, and XP-driven Power Grid ranks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
