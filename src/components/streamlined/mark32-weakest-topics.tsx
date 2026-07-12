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
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b48a38]">Weak topics</p>
      <h2 className="mt-2 text-lg font-bold tracking-tight text-[#163038]">Focus here next</h2>

      <div className="mt-4 space-y-3">
        {topics.length ? (
          topics.map((topic, index) => (
            <Link
              key={`${topic.subject}-${topic.focus}`}
              href={topic.href}
              className="flex items-start gap-3 rounded-xl border border-[#ddd3c6] bg-[#f7f2ea] p-3 transition hover:border-[#b48a38]/40"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b48a38] to-[#d97706] text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#163038]">{topic.focus}</p>
                <p className="mt-1 text-xs text-[#52646a]">
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
