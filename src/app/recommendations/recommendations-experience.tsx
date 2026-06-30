import Link from "next/link";

import { Mark32PageHeader, Mark32StatCard } from "@/components/streamlined/mark32-page-header";
import type { RecommendationsPageData } from "@/modules/recommendations/types";
import type { SupportHubData } from "@/modules/support/types";

function getPriorityClasses(priority: "high" | "medium" | "low"): string {
  if (priority === "high") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (priority === "medium") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-stone-300 bg-stone-50 text-stone-800";
}

interface RecommendationsExperienceProps {
  data: RecommendationsPageData;
  support: SupportHubData;
}

export function RecommendationsExperience({ data, support }: RecommendationsExperienceProps) {
  return (
    <div className="flex flex-col gap-8">
      <Mark32PageHeader
        eyebrow="Recommendations"
        title={data.title}
        description={data.description}
        aside={
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Next best action</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{data.nextBestAction}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{data.routeSummary}</p>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {data.insights.map((insight) => (
          <Mark32StatCard
            key={insight.label}
            label={insight.label}
            value={insight.value}
            detail={
              [insight.detail, insight.supportSummary].filter(Boolean).join(" · ") || undefined
            }
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-5">
          {data.recommendations.map((recommendation) => (
            <article
              key={recommendation.recommendationId}
              className="grid gap-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getPriorityClasses(recommendation.priority)}`}
                  >
                    {recommendation.priority} priority
                  </span>
                  {recommendation.eyebrow ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      {recommendation.eyebrow}
                    </span>
                  ) : null}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {recommendation.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{recommendation.description}</p>
                  {recommendation.supportSummary ? (
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {recommendation.supportSummary}
                    </p>
                  ) : null}
                  {recommendation.supportPreferenceChips?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendation.supportPreferenceChips.map((chip) => (
                        <span
                          key={chip}
                          className="border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-700"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-end justify-start lg:justify-end">
                <Link
                  href={recommendation.href}
                  className="inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-900"
                >
                  {recommendation.actionLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Support-aware rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-700">
              {support.routeGuidance.find((guidance) => guidance.routeId === "/recommendations")?.message}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-700">{support.safetyReview.escalationGuidance}</p>
            <Link
              href="/support"
              className="mt-4 inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-300"
            >
              Open support hub
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
