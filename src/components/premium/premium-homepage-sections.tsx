import Link from "next/link";

import { PremiumPowerGridCard } from "@/components/premium/premium-power-grid-card";
import { PremiumSubjectCard } from "@/components/premium/premium-subject-card";
import {
  PREMIUM_PLATFORM_FEATURES,
  PREMIUM_SUBJECTS,
  premiumUi,
} from "@/components/premium/premium-ui";
import { getPublicRouteHref } from "@/lib/public-route";
import type { PowerGridLevel } from "@/modules/power-grid/types";

interface PremiumHomepageSectionsProps {
  powerGridLevel: PowerGridLevel;
  readinessScore: number;
  xpTotal: number;
  isAuthenticated?: boolean;
}

export function PremiumHomepageSections({
  powerGridLevel,
  readinessScore,
  xpTotal,
  isAuthenticated = false,
}: PremiumHomepageSectionsProps) {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <div>
          <p className={premiumUi.eyebrowAccent}>GCSE subjects</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>Save My Exams-style structure</h2>
          <p className={`mt-2 max-w-2xl ${premiumUi.body}`}>
            Subject → exam board → topic — clear BBC Bitesize clarity with premium presentation.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PREMIUM_SUBJECTS.map((subject) => (
            <PremiumSubjectCard key={subject.id} {...subject} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </section>

      <PremiumPowerGridCard
        level={powerGridLevel}
        readinessScore={readinessScore}
        xpTotal={xpTotal}
        isAuthenticated={isAuthenticated}
      />

      <section className="space-y-6">
        <div>
          <p className={premiumUi.eyebrowAccent}>Platform features</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>Everything you need to revise</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PREMIUM_PLATFORM_FEATURES.map((feature) => (
            <Link
              key={feature.title}
              href={getPublicRouteHref(feature.href, isAuthenticated)}
              className={premiumUi.cardHover}
            >
              <span className="text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-[#163038]">{feature.title}</h3>
              <p className={`mt-2 ${premiumUi.body}`}>{feature.detail}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
