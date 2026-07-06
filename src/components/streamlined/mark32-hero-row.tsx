import Link from "next/link";

import type { DashboardHomeData } from "@/modules/dashboard/types";
import { PremiumContinueRevisionCard } from "@/components/premium/premium-continue-revision-card";
import { PremiumDashboardCard } from "@/components/premium/premium-dashboard-card";
import { PremiumPowerGridCard } from "@/components/premium/premium-power-grid-card";
import { premiumUi } from "@/components/premium/premium-ui";
import {
  pickContinueLearning,
  pickNextExam,
  pickWeakestTopics,
} from "@/components/streamlined/mark32-dashboard-utils";

interface Mark32HeroRowProps {
  data: DashboardHomeData;
}

export function Mark32HeroRow({ data }: Mark32HeroRowProps) {
  const signals = data.primarySignals;
  const continueLearning = signals
    ? {
        title: signals.continueLearning.label,
        subtitle: signals.continueLearning.reason,
        progress: data.summary.examReadinessScore,
        href: signals.continueLearning.href,
        actionLabel: signals.continueLearning.label,
      }
    : pickContinueLearning(data);
  const nextExam = signals
    ? {
        title: signals.nextExamTask.title,
        detail: signals.nextExamTask.dueLabel ?? "Open exam lobby",
        href: signals.nextExamTask.href,
      }
    : pickNextExam(data);
  const weakTopic = signals?.weakTopic;
  const weakest = pickWeakestTopics(data, 3);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Study overview">
      <PremiumContinueRevisionCard {...continueLearning} />

      <PremiumDashboardCard eyebrow="Weak topic" title={weakTopic?.label ?? "Focus here next"} accent="amber">
        <p className={premiumUi.body}>
          {weakTopic?.strength !== undefined
            ? `${weakTopic.strength}/100 strength — practise to improve recall.`
            : "Strengthen your weakest area next."}
        </p>
        <Link href={weakTopic?.href ?? "/subjects"} className={`mt-4 ${premiumUi.secondaryBtn}`}>
          Practise weak topic
        </Link>
      </PremiumDashboardCard>

      <PremiumDashboardCard eyebrow="Next exam" title={nextExam.title} accent="blue">
        <p className={premiumUi.body}>{nextExam.detail}</p>
        <Link href={nextExam.href} className={`mt-4 ${premiumUi.secondaryBtn}`}>
          View exam
        </Link>
      </PremiumDashboardCard>

      <PremiumPowerGridCard
        level={data.summary.overallLevel}
        readinessScore={data.summary.examReadinessScore}
        xpTotal={data.summary.xpTotal}
        compact
      />

      {!signals && weakest.length ? (
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
