import Link from "next/link";
import type { DashboardHomeData, DashboardMetric, DashboardRouteCard, DashboardSessionCard } from "@/modules/dashboard/types";

interface DashboardHomeProps {
  data: DashboardHomeData;
  mode: "home" | "dashboard";
}

function getToneClasses(tone: DashboardMetric["tone"] | DashboardRouteCard["tone"]): string {
  switch (tone) {
    case "rose":
      return "border-rose-300 bg-rose-50 text-rose-950";
    case "emerald":
      return "border-emerald-300 bg-emerald-50 text-emerald-950";
    case "amber":
      return "border-amber-300 bg-amber-50 text-amber-950";
    case "sky":
      return "border-sky-300 bg-sky-50 text-sky-950";
    default:
      return "border-teal-300 bg-teal-50 text-teal-950";
  }
}

function getTrendClasses(trend: DashboardHomeData["summary"]["overallTrend"]): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

function getSessionKindClasses(kind: DashboardSessionCard["kind"]): string {
  return kind === "exam"
    ? "border-teal-300 bg-teal-50 text-teal-900"
    : "border-emerald-300 bg-emerald-50 text-emerald-900";
}

export function DashboardHome({ data, mode }: DashboardHomeProps) {
  const isHome = mode === "home";
  const heroEyebrow = isHome ? "The Switch Mark 3.2" : "Student Dashboard";
  const heroTitle = isHome
    ? "Revision, timed practice, and exam readiness now have a proper front door."
    : "Your working home screen for what is saved, what needs attention, and what to do next.";
  const heroDescription = isHome
    ? "This home screen is now wired into the real MVP slice. It pulls live mock data from the dashboard, exam engine, timed assessment, saved progress, and Power Grid modules so the platform finally feels connected."
    : "The dashboard now acts like a real student home surface. It shows live readiness, route launch points, session summaries, and subject focus without hiding the logic inside the page.";

  return (
    <main className="min-h-screen overflow-hidden bg-stone-100 text-stone-950">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_38%),linear-gradient(to_bottom,_#fafaf9,_#f5f5f4)]" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
                The Switch Platform
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Modular MVP for GCSE revision, exam practice, and saved progress.
              </p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/">
                Home
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/dashboard">
                Dashboard
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/account">
                Account
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/exams">
                Exams
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/assessments">
                Assessments
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/progress">
                Progress
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/saved-progress">
                Saved Progress
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/support">
                Support Hub
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/recommendations">
                Recommendations
              </Link>
              <Link className="border border-stone-300 bg-white px-3 py-2 text-stone-800 transition hover:bg-stone-50" href="/results">
                Results
              </Link>
            </nav>
          </header>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_22rem]">
            <article className="relative overflow-hidden border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-100 blur-3xl" />
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal-700">
                    {heroEyebrow}
                  </p>
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    {heroTitle}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
                    {heroDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center border border-teal-700 bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
                  >
                    Open student dashboard
                  </Link>
                  <Link
                    href="/exams"
                    className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
                  >
                    Resume exam sessions
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {data.metrics.map((metric) => (
                    <div key={metric.label} className={`border p-4 ${getToneClasses(metric.tone)}`}>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-75">{metric.label}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight">{metric.value}</p>
                      <p className="mt-2 text-sm opacity-80">{metric.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-4 border border-stone-200 bg-stone-950 p-5 text-stone-50 shadow-sm sm:p-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                  Study pulse
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {data.recommendedAction}
                </h2>
              </div>

              <div className="grid gap-3 border-y border-stone-800 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Trend</p>
                  <p className={`mt-1 text-base font-medium capitalize ${getTrendClasses(data.summary.overallTrend)}`}>
                    {data.summary.overallTrend}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Strongest subject</p>
                  <p className="mt-1 text-base font-medium text-stone-50">
                    {data.strongestSubject?.subject ?? "Not enough activity yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Watch next</p>
                  <p className="mt-1 text-base font-medium text-stone-50">
                    {data.weakestSubject?.subject ?? "Start a first session"}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-stone-300">{data.supportSnapshotSummary}</p>
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {data.routeCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
              >
                <div className={`inline-flex border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getToneClasses(card.tone)}`}>
                  {card.eyebrow}
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{card.description}</p>
                <p className="mt-5 text-sm font-medium text-stone-900">{card.stat}</p>
              </Link>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-6">
              <article className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                      Live exam sessions
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                      Full paper work that can be resumed immediately
                    </h2>
                  </div>
                  <Link href="/exams" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                    Open exam route
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {data.examSessions.map((session) => (
                    <div key={session.sessionId} className="border border-stone-200 bg-stone-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getSessionKindClasses(session.kind)}`}>
                          {session.kind}
                        </span>
                        <span className="text-sm font-medium text-stone-700">
                          {session.completionPercentage}% complete
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-stone-950">{session.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{session.subtitle}</p>
                      <div className="mt-4 space-y-2 text-sm text-stone-700">
                        <p>{session.timeLabel}</p>
                        <p>{session.statusLabel}</p>
                        <p>Primary focus: {session.focusLabel}</p>
                        <p>{session.supportLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                      Timed assessments
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                      Shorter checkpoints with capped duration and saved resume state
                    </h2>
                  </div>
                  <Link href="/assessments" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                    Open assessment route
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {data.assessmentSessions.map((session) => (
                    <div key={session.sessionId} className="border border-stone-200 bg-stone-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getSessionKindClasses(session.kind)}`}>
                          {session.kind}
                        </span>
                        <span className="text-sm font-medium text-stone-700">
                          {session.completionPercentage}% complete
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-stone-950">{session.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{session.subtitle}</p>
                      <div className="mt-4 space-y-2 text-sm text-stone-700">
                        <p>{session.timeLabel}</p>
                        <p>{session.statusLabel}</p>
                        <p>{session.focusLabel}</p>
                        <p>{session.supportLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="space-y-6">
              <section className="border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Subject watch
                </p>
                <div className="mt-4 space-y-4">
                  {data.focusCards.map((focus) => (
                    <div key={focus.subject} className="border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-stone-950">{focus.subject}</h3>
                        <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          {focus.level}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-stone-800">
                        {focus.readinessScore} / 100
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {focus.recommendedFocus}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-stone-500">{focus.evidence}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-dashed border-stone-300 bg-white p-5 text-sm leading-7 text-stone-700 shadow-sm">
                This screen now proves a clean architecture rule: the UI renders a single dashboard
                view model, while exam, progress, assessment, and support rules stay inside their
                own modules.
              </section>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
