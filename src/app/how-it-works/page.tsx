import Link from "next/link";
import { getWebsiteGuideApiData } from "@/lib/api/server";

export default async function HowItWorksPage() {
  const guide = await getWebsiteGuideApiData();

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Website Guide
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {guide.title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                {guide.description}
              </p>
            </div>
          </div>

          <div className="border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Suggested first click</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">Start from the dashboard</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              The dashboard is the quickest way to understand what is saved, what needs attention,
              and where to go next.
            </p>
            <Link
              href={guide.suggestedFirstRoute}
              className="mt-4 inline-flex items-center justify-center border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Open dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            {guide.steps.map((step) => (
              <article key={step.stepId} className="border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                      Step {step.stepNumber}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                      {step.title}
                    </h2>
                    <p className="max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                    {step.routeLabel}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Why this matters</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{step.whyItMatters}</p>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-stone-900">What to check</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                        {step.quickChecks.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Try this route</p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      Open the route directly and compare what you see on the page with this guide.
                    </p>
                    <Link
                      href={step.href}
                      className="mt-4 inline-flex items-center justify-center border border-stone-950 bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                      {step.actionLabel}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Important meanings
              </h2>
              <div className="mt-4 space-y-4">
                {guide.glossary.map((item) => (
                  <article key={item.termId} className="border border-stone-200 bg-stone-50 p-3">
                    <p className="text-sm font-semibold text-stone-950">{item.term}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.meaning}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Best use of this page
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Open this page the first time you use the site.</li>
                <li>Use the step buttons to move through the routes in order.</li>
                <li>Come back when a term like Power Grid or autosave feels unclear.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
