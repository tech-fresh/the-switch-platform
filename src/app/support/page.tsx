import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { PublicMarketingPage } from "@/components/public-marketing-page";
import { getSupportHubApiData } from "@/lib/api/server";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const support = await getSupportHubApiData();

  return (
    <PublicMarketingPage>
        <Mark32PageHeader
          eyebrow="Support"
          title={support.title}
          description={support.description}
          aside={
            <div className="border border-rose-200 bg-rose-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-700">Important</p>
              <p className="mt-3 text-sm leading-6 text-rose-900">{support.safetyNotice}</p>
            </div>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                    Safety review
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                    Reviewed support rules for younger learners
                  </h2>
                </div>
                <p className="text-sm text-stone-700">
                  Reviewed {support.safetyReview.reviewedAt} by {support.safetyReview.reviewedBy}
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-700">
                {support.safetyReview.policySummary}
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                {support.safetyReview.escalationGuidance}
              </p>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
                  Need support right now?
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Urgent help routes for young people
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {support.urgentHelp.map((option) => (
                  <a
                    key={option.optionId}
                    href={option.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-rose-200 bg-rose-50 p-4 transition hover:bg-white"
                  >
                    <p className="text-lg font-semibold text-stone-950">{option.name}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{option.actionText}</p>
                    <p className="mt-4 text-sm font-medium text-rose-700">{option.contactLabel}</p>
                  </a>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
                  Exam stress support
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Reputable guides worth opening during exam pressure
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {support.examSupportGuides.map((guide) => (
                  <a
                    key={guide.guideId}
                    href={guide.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-stone-200 bg-stone-50 p-4 transition hover:bg-white"
                  >
                    <p className="text-lg font-semibold text-stone-950">{guide.title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{guide.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {guide.topicsCovered.map((topic) => (
                        <span
                          key={topic}
                          className="border border-stone-300 bg-white px-2 py-1 text-xs uppercase tracking-[0.2em] text-stone-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-medium text-teal-800">{guide.organisation}</p>
                  </a>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Trusted support services
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  UK services and charities for young people
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {support.trustedResources.map((resource) => (
                  <a
                    key={resource.resourceId}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-stone-200 bg-stone-50 p-4 transition hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-stone-950">{resource.name}</p>
                      {resource.urgent ? (
                        <span className="border border-rose-300 bg-rose-50 px-2 py-1 text-xs uppercase tracking-[0.2em] text-rose-700">
                          urgent help available
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{resource.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                      {resource.providerType === "nhs" ? "NHS" : "Registered charity"} • young people
                    </p>
                    {resource.contactLabel ? (
                      <p className="mt-4 text-sm font-medium text-teal-800">{resource.contactLabel}</p>
                    ) : null}
                  </a>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Route guidance
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  How support should appear across the product
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {support.routeGuidance.map((guidance) => (
                  <div key={guidance.routeId} className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-lg font-semibold text-stone-950">{guidance.title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{guidance.message}</p>
                    <p className="mt-4 text-sm font-medium text-teal-800">{guidance.actionLabel}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route is
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Trusted signposting for young people.</li>
                <li>Links to NHS services and established UK charities.</li>
                <li>Exam stress help without pretending to be therapy or counselling.</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route is not
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Not a live counselling service.</li>
                <li>Not a chatbot or wellbeing assistant.</li>
                <li>Not a place where personal mental health details are stored.</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Reviewed safeguards
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Urgent help stays visible without adding panic to normal study routes.</li>
                <li>Support copy stays age-appropriate and non-clinical.</li>
                <li>Escalation points always move students toward trusted adults and established services.</li>
              </ul>
            </section>
          </aside>
        </section>
    </PublicMarketingPage>
  );
}
