import Link from "next/link";

import { pickWeakestTopics } from "@/components/streamlined/mark32-dashboard-utils";
import type { DashboardHomeData } from "@/modules/dashboard/types";

interface Mark32WeakestTopicsProps {
  data: DashboardHomeData;
}

export function Mark32WeakestTopics({ data }: Mark32WeakestTopicsProps) {
  const topics = pickWeakestTopics(data);

  return (
    <aside className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm" aria-label="Weakest topics">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-700">Weakest topics</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">Focus here next</h2>

      <div className="mt-4 space-y-3">
        {topics.length ? (
          topics.map((topic, index) => (
            <Link
              key={`${topic.subject}-${topic.focus}`}
              href={topic.href}
              className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 hover:border-rose-300 hover:bg-white"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-700 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-950">{topic.focus}</p>
                <p className="mt-1 text-xs text-stone-600">
                  {topic.subject} · {topic.score}/100 readiness
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm leading-6 text-stone-600">
            Start a practice session to surface topic-level focus areas.
          </p>
        )}
      </div>

      <Link href="/recommendations" className="mt-4 inline-flex text-sm font-semibold text-rose-800 hover:opacity-80">
        See all recommendations
      </Link>
    </aside>
  );
}
