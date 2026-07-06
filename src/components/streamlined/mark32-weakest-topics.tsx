import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";
import { pickWeakestTopics } from "@/components/streamlined/mark32-dashboard-utils";
import type { DashboardHomeData } from "@/modules/dashboard/types";

interface Mark32WeakestTopicsProps {
  data: DashboardHomeData;
}

export function Mark32WeakestTopics({ data }: Mark32WeakestTopicsProps) {
  const topics = pickWeakestTopics(data);

  return (
    <aside className={premiumUi.card} aria-label="Weakest topics">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F59E0B]">Weak topics</p>
      <h2 className="mt-2 text-lg font-bold tracking-tight text-white">Focus here next</h2>

      <div className="mt-4 space-y-3">
        {topics.length ? (
          topics.map((topic, index) => (
            <Link
              key={`${topic.subject}-${topic.focus}`}
              href={topic.href}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0F1420] p-3 transition hover:border-[#F59E0B]/40"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{topic.focus}</p>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  {topic.subject} · {topic.score}/100 readiness
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className={premiumUi.body}>Start a practice session to surface topic-level focus areas.</p>
        )}
      </div>

      <Link href="/recommendations" className={`mt-4 inline-flex ${premiumUi.linkAccent}`}>
        See all recommendations
      </Link>
    </aside>
  );
}
