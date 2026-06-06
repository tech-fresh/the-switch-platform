import Link from "next/link";
import { getRecommendationsPageData } from "@/modules/recommendations/service";

function getPriorityClasses(priority: "high" | "medium" | "low"): string {
  if (priority === "high") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (priority === "medium") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-stone-300 bg-stone-50 text-stone-800";
}

export default async function RecommendationsPage() {
  const data = await getRecommendationsPageData("student-demo");

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
              Recommendations
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {data.title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                {data.description}
              </p>
            </div>
          </div>

          <div className="space-y-3 border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Route purpose</p>
            <p className="text-lg font-semibold text-stone-950">{data.nextBestAction}</p>
            <p className="text-sm leading-6 text-stone-600">{data.routeSummary}</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {data.insights.map((insight) => (
            <article key={insight.label} className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{insight.label}</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">{insight.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{insight.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-5">
            {data.recommendations.map((recommendation) => (
              <article
                key={recommendation.recommendationId}
                className="grid gap-5 border border-stone-200 bg-white p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
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
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {recommendation.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-start lg:justify-end">
                  <Link
                    href={recommendation.href}
                    className="inline-flex items-center justify-center border border-rose-700 bg-rose-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-800"
                  >
                    {recommendation.actionLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Recommendation logic lives in the module layer, not in page components.</li>
                <li>Recommendations can combine progress, support, results, and autosave signals.</li>
                <li>Language-ready route metadata can support future mobile and API clients.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
