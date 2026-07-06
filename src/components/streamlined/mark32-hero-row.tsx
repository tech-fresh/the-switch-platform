import Link from "next/link";

import type { DashboardHomeData } from "@/modules/dashboard/types";
import { PremiumContinueRevisionCard } from "@/components/premium/premium-continue-revision-card";
import { PremiumDashboardCard } from "@/components/premium/premium-dashboard-card";
import { PremiumPowerGridCard } from "@/components/premium/premium-power-grid-card";
import { premiumUi } from "@/components/premium/premium-ui";
import {
  getWeeklyGoalProgress,
  pickContinueLearning,
  pickNextExam,
  pickWeakestTopics,
} from "@/components/streamlined/mark32-dashboard-utils";

interface Mark32HeroRowProps {
  data: DashboardHomeData;
}

export function Mark32HeroRow({ data }: Mark32HeroRowProps) {
  const continueLearning = pickContinueLearning(data);
  const nextExam = pickNextExam(data);
  const dailyGoal = getWeeklyGoalProgress(data.weeklyPlanner);
  const weakest = pickWeakestTopics(data, 3);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Study overview">
      <PremiumContinueRevisionCard {...continueLearning} />

      <PremiumDashboardCard eyebrow="Next exam" title={nextExam.title} accent="blue">
        <p className={premiumUi.body}>{nextExam.detail}</p>
        <Link href={nextExam.href} className={`mt-4 ${premiumUi.secondaryBtn}`}>
          View exam
        </Link>
      </PremiumDashboardCard>

      <PremiumDashboardCard eyebrow="Today's goal" title={`${dailyGoal}% complete`} accent="green">
        <p className={premiumUi.body}>Weekly planner items finished this week.</p>
        <div className={`mt-4 ${premiumUi.progressTrack}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#00BFFF]" style={{ width: `${dailyGoal}%` }} />
        </div>
        <Link href="/progress" className={`mt-4 inline-flex ${premiumUi.linkAccent}`}>
          Open planner →
        </Link>
      </PremiumDashboardCard>

      <PremiumPowerGridCard
        level={data.summary.overallLevel}
        readinessScore={data.summary.examReadinessScore}
        xpTotal={data.summary.xpTotal}
        compact
      />

      {weakest.length ? (
        <PremiumDashboardCard
          eyebrow="Weak topics"
          title="Focus here next"
          accent="amber"
          className="md:col-span-2 xl:col-span-4"
        >
          <ul className="space-y-2">
            {weakest.map((topic) => (
              <li key={topic.subject}>
                <Link
                  href={topic.href}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F1420] px-4 py-3 transition hover:border-[#F59E0B]/40"
                >
                  <span className="text-sm font-semibold text-white">{topic.subject}</span>
                  <span className="text-xs text-[#9CA3AF]">{topic.score}/100</span>
                </Link>
              </li>
            ))}
          </ul>
        </PremiumDashboardCard>
      ) : null}
    </section>
  );
}
