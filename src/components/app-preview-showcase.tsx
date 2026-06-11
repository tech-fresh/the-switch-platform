import Link from "next/link";
import type { MvpCatalogSubject } from "@/modules/content/types";
import type { DashboardHomeData } from "@/modules/dashboard/types";
import type { PowerGridSummary } from "@/modules/power-grid/types";

interface AppPreviewShowcaseProps {
  dashboardData: DashboardHomeData;
  summary: PowerGridSummary;
  subjects: MvpCatalogSubject[];
}

function getReadinessClasses(score: number): string {
  if (score >= 75) {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (score >= 55) {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-rose-300 bg-rose-50 text-rose-950";
}

function getReadinessBarClasses(score: number): string {
  if (score >= 75) {
    return "bg-emerald-500";
  }

  if (score >= 55) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}

function getTrendLabel(trend: PowerGridSummary["overallTrend"]): string {
  if (trend === "improving") {
    return "Momentum rising";
  }

  if (trend === "stable") {
    return "Momentum holding";
  }

  return "Momentum needs support";
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

export function AppPreviewShowcase({
  dashboardData,
  summary,
  subjects,
}: AppPreviewShowcaseProps) {
  const coverageCards = subjects.slice(0, 6).map((subject) => {
    const matchingProgress = summary.subjectProgress.find(
      (item) => normalizeLabel(item.subject) === normalizeLabel(subject.name),
    );

    return {
      ...subject,
      readinessScore: matchingProgress?.readinessScore ?? subject.examReadinessScore,
      trend: matchingProgress?.trend ?? summary.overallTrend,
      recommendedFocus: matchingProgress?.recommendedFocus ?? subject.nextTopicToRevise,
      activityCount:
        (matchingProgress?.activeSessionCount ?? 0) + (matchingProgress?.completedSessionCount ?? 0),
    };
  });

  const mobileFocusCards = summary.subjectProgress.slice(0, 3);
  const primaryRouteCards = dashboardData.routeCards.slice(0, 4);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#f6efe6_35%,#efe3d3_100%)] text-stone-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300/80 pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
              The Switch Platform Preview
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Website and app mockup built from the real learner data model.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-700 sm:text-base">
              This route turns the existing dashboard, Power Grid, and subject coverage signals into a
              launch-style preview so you can show both the website direction and a mobile-first app
              concept from the same platform foundation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-900">
              Local link: http://localhost:3000/app-preview
            </span>
            <Link
              href="/dashboard"
              className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
            >
              Open dashboard
            </Link>
            <Link
              href="/how-it-works"
              className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
            >
              Open website guide
            </Link>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
          <article className="overflow-hidden border border-stone-300 bg-white shadow-sm">
            <div className="border-b border-stone-200 bg-stone-950 px-5 py-3 text-stone-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Website concept</p>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-6">
              <section className="rounded-[2rem] bg-[linear-gradient(135deg,#9a3412,#1c1917)] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-100/90">
                  Learner launch experience
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  Keep revision, readiness, and next steps in one calm front door.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-orange-50/85">
                  The website concept keeps the learner focused on what is active, what is improving,
                  and what to do next, without forcing them to jump between disconnected tools.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {dashboardData.metrics.slice(0, 3).map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-100/75">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight">{metric.value}</p>
                      <p className="mt-2 text-sm text-orange-50/80">{metric.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-4 md:grid-cols-2">
                  {primaryRouteCards.map((routeCard) => (
                    <Link
                      key={`${routeCard.href}-${routeCard.title}`}
                      href={routeCard.href}
                      className="border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-white"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        {routeCard.eyebrow}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
                        {routeCard.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {routeCard.description}
                      </p>
                      <p className="mt-4 text-sm font-medium text-orange-700">{routeCard.stat}</p>
                    </Link>
                  ))}
                </div>

                <aside className="border border-stone-200 bg-[#1c1917] p-5 text-stone-50">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Study signal
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    {summary.nextBestAction}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    {dashboardData.continuityDescription}
                  </p>

                  <div className="mt-5 grid gap-3 border-y border-stone-800 py-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Readiness</p>
                      <p className="mt-1 text-lg font-medium text-stone-50">
                        {summary.examReadinessScore} / 100
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Trend</p>
                      <p className="mt-1 text-lg font-medium text-stone-50">
                        {getTrendLabel(summary.overallTrend)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Support view</p>
                      <p className="mt-1 text-sm leading-6 text-stone-300">
                        {dashboardData.supportSnapshotSummary}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={summary.nextBestActionHref ?? dashboardData.continuityHref}
                    className="mt-5 inline-flex w-full items-center justify-center border border-orange-400 bg-orange-400 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-300"
                  >
                    Open next best route
                  </Link>
                </aside>
              </section>
            </div>
          </article>

          <aside className="overflow-hidden border border-stone-300 bg-[#1c1917] p-4 text-white shadow-sm">
            <div className="mx-auto flex min-h-[44rem] w-full max-w-[22rem] flex-col rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,#292524_0%,#111827_100%)] p-4 shadow-[0_24px_90px_rgba(28,25,23,0.45)]">
              <div className="mx-auto h-1.5 w-24 rounded-full bg-white/20" />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-200/80">Switch app</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Today</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-orange-100">
                  {summary.overallLevel}
                </div>
              </div>

              <section className="mt-4 rounded-[1.75rem] bg-[linear-gradient(145deg,#f97316,#fb923c)] p-4 text-stone-950">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-900/70">
                  Next move
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-7">
                  {dashboardData.continuityActionLabel}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-900/75">
                  {dashboardData.continuityDescription}
                </p>
                <div className="mt-4 h-2 rounded-full bg-stone-900/15">
                  <div
                    className="h-2 rounded-full bg-stone-950"
                    style={{ width: `${Math.max(summary.examReadinessScore, 12)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-900/65">
                  Readiness {summary.examReadinessScore} / 100
                </p>
              </section>

              <section className="mt-4 grid gap-3">
                {mobileFocusCards.map((subject) => (
                  <div key={subject.subject} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{subject.subject}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-orange-100/70">
                          {subject.recommendedFocus}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-orange-100">
                        {subject.readinessScore}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full ${getReadinessBarClasses(subject.readinessScore)}`}
                        style={{ width: `${Math.max(subject.readinessScore, 8)}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-300">{subject.evidence}</p>
                  </div>
                ))}
              </section>

              <div className="mt-auto grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center text-[11px] uppercase tracking-[0.18em] text-stone-300">
                <span className="rounded-full bg-white/5 px-2 py-2 text-orange-100">Home</span>
                <span className="rounded-full bg-white/5 px-2 py-2">Focus</span>
                <span className="rounded-full bg-white/5 px-2 py-2">Results</span>
                <span className="rounded-full bg-white/5 px-2 py-2">Support</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coverageCards.map((subject) => (
            <article
              key={subject.subjectId}
              className={`border p-5 shadow-sm ${getReadinessClasses(subject.readinessScore)}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-75">
                {subject.qualificationType} • {subject.yearGroups.join(" / ")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{subject.name}</h2>
              <p className="mt-2 text-sm leading-6 opacity-85">{subject.description}</p>

              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span>Readiness</span>
                  <strong>{subject.readinessScore} / 100</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Topics</span>
                  <strong>{subject.topicCount}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Resources</span>
                  <strong>{subject.revisionResourceCount}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Activity seen</span>
                  <strong>{subject.activityCount}</strong>
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-black/10">
                <div
                  className={`h-2 rounded-full ${getReadinessBarClasses(subject.readinessScore)}`}
                  style={{ width: `${Math.max(subject.readinessScore, 10)}%` }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 opacity-90">
                Next focus: <strong>{subject.recommendedFocus}</strong>
              </p>
              <p className="mt-2 text-sm leading-6 opacity-80">{subject.gcsePreparationGoal}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
