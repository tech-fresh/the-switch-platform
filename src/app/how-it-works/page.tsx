import Link from "next/link";

import { PublicMarketingPage } from "@/components/public-marketing-page";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
import { getPublicRouteHref } from "@/lib/public-route";
import { getRequestAuthSession } from "@/modules/auth/request";
import { getWebsiteGuideData } from "@/modules/website-guide/service";

export const dynamic = "force-dynamic";

export default async function HowItWorksPage() {
  const [guide, session] = await Promise.all([getWebsiteGuideData(), getRequestAuthSession()]);
  const isAuthenticated = session.status === "authenticated";

  return (
    <PublicMarketingPage isAuthenticated={isAuthenticated}>
      <Mark32PageHeader
        eyebrow="Resources"
        title={guide.title}
        description={guide.description}
        aside={
          <div className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Suggested first click</p>
            <p className="mt-2 text-lg font-bold text-slate-950">Start from the dashboard</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The dashboard is the quickest way to understand what is saved, what needs attention, and
              where to go next.
            </p>
            <Link
              href={getPublicRouteHref(guide.suggestedFirstRoute, isAuthenticated)}
              className={`mt-4 ${mark32Ui.primaryBtn}`}
            >
              Open dashboard
            </Link>
          </div>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          {guide.steps.map((step) => (
            <article key={step.stepId} className={mark32Ui.card}>
              <div className="flex flex-col gap-4 border-b border-[#D7D0C7] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <p className={mark32Ui.eyebrowSm}>Step {step.stepNumber}</p>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">{step.title}</h2>
                  <p className={mark32Ui.body}>{step.description}</p>
                </div>
                <div className="rounded-2xl border border-[#D7D0C7] bg-[#F1ECE5] px-4 py-3 text-sm text-slate-700">
                  {step.routeLabel}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div>
                  <p className="text-sm font-bold text-slate-900">Why this matters</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.whyItMatters}</p>
                  <div className="mt-5">
                    <p className="text-sm font-bold text-slate-900">What to check</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                      {step.quickChecks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#D7D0C7] bg-[#F1ECE5] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Try this route</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Open the route directly and compare what you see on the page with this guide.
                  </p>
                  <Link
                    href={getPublicRouteHref(step.href, isAuthenticated)}
                    className={`mt-4 ${mark32Ui.primaryBtn}`}
                  >
                    {step.actionLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <section className={mark32Ui.statCard}>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Important meanings</h2>
            <div className="mt-4 space-y-4">
              {guide.glossary.map((item) => (
                <article key={item.termId} className="rounded-xl border border-[#D7D0C7] bg-[#F1ECE5] p-3">
                  <p className="text-sm font-bold text-slate-950">{item.term}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.meaning}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={mark32Ui.statCard}>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Best use of this page</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <li>Open this page the first time you use the site.</li>
              <li>Use the step buttons to move through the routes in order.</li>
              <li>Come back when a term like Power Grid or autosave feels unclear.</li>
            </ul>
          </section>
        </aside>
      </section>
    </PublicMarketingPage>
  );
}
