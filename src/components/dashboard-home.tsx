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

function getProgressBarClasses(score: number): string {
  if (score >= 75) {
    return "bg-emerald-500";
  }

  if (score >= 55) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
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
                    href={data.examSessions[0]?.href ?? "/exams"}
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

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,24rem)]">
            <article className="overflow-hidden border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 bg-stone-950 px-5 py-3 text-stone-50 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
                    Website preview
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div className="rounded-3xl bg-[linear-gradient(135deg,_#0f766e,_#0f172a)] p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/90">
                      Student launchpad
                    </p>
                    <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                      See everything that matters before a session starts.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50/85">
                      The website preview keeps dashboard guidance, saved progress, accessibility-aware support, and exam routes in one place without moving business rules into the UI.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {data.metrics.slice(0, 3).map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-teal-100/70">
                            {metric.label}
                          </p>
                          <p className="mt-3 text-2xl font-semibold tracking-tight">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-sm text-teal-50/80">{metric.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-4">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Next action
                      </p>
                      <p className="mt-3 text-lg font-semibold text-stone-950">
                        {data.recommendedAction}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-stone-950 p-4 text-stone-50">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                        Live support state
                      </p>
                      <p className="mt-3 text-sm leading-7 text-stone-200">
                        {data.supportSnapshotSummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                          Website modules
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
                          Key routes available from the first screen
                        </h3>
                      </div>
                      <span className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700">
                        Mobile-first
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {data.routeCards.slice(0, 6).map((card) => (
                        <div key={card.href} className="rounded-2xl border border-stone-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            {card.eyebrow}
                          </p>
                          <h4 className="mt-2 text-base font-semibold text-stone-950">
                            {card.title}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-stone-600">
                            {card.description}
                          </p>
                          <p className="mt-4 text-sm font-medium text-stone-900">
                            {card.stat}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      Readiness by subject
                    </p>
                    <div className="mt-4 space-y-4">
                      {data.focusCards.slice(0, 4).map((focus) => (
                        <div key={focus.subject} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-sm font-semibold text-stone-950">{focus.subject}</h4>
                            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                              {focus.level}
                            </span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                            <div
                              className={`h-full rounded-full ${getProgressBarClasses(focus.readinessScore)}`}
                              style={{ width: `${focus.readinessScore}%` }}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-stone-900">
                              {focus.readinessScore} / 100
                            </span>
                            <span className="capitalize text-stone-500">{focus.trend}</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-stone-600">
                            {focus.recommendedFocus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden border border-stone-200 bg-[linear-gradient(180deg,_#111827,_#0f172a)] p-5 text-white shadow-sm sm:p-6">
              <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.3),_transparent_55%)]" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
                  App mockup
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  A future mobile shell built from the same module contracts.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  This mockup stays faithful to the platform rules: autosave, clean API boundaries, and support settings that move with the learner across routes.
                </p>

                <div className="mx-auto mt-8 w-full max-w-[19rem] rounded-[2.5rem] border border-white/10 bg-stone-950 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.6)]">
                  <div className="rounded-[2rem] bg-[linear-gradient(180deg,_#ecfeff,_#f8fafc_28%,_#f8fafc)] p-4 text-stone-950">
                    <div className="mx-auto h-1.5 w-16 rounded-full bg-stone-300" />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          The Switch
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-tight">
                          Study today
                        </h3>
                      </div>
                      <div className="rounded-2xl bg-teal-600 px-3 py-2 text-right text-white">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-teal-50/80">
                          Readiness
                        </p>
                        <p className="text-lg font-semibold">
                          {data.summary.examReadinessScore}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl bg-stone-950 p-4 text-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Resume now
                      </p>
                      <h4 className="mt-2 text-lg font-semibold">
                        {data.examSessions[0]?.title ?? "Exam session ready"}
                      </h4>
                      <p className="mt-2 text-sm text-stone-300">
                        {data.examSessions[0]?.timeLabel ?? "Timing available"}
                      </p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-teal-400"
                          style={{ width: `${data.examSessions[0]?.completionPercentage ?? 0}%` }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-teal-200">
                        {data.examSessions[0]?.statusLabel ?? "Flags and timing sync here"}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-stone-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          Access support
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-700">
                          {data.supportSnapshotSummary}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-stone-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                              Quick routes
                            </p>
                            <p className="mt-2 text-sm font-medium text-stone-900">
                              Dashboard, exams, progress, saved
                            </p>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                            Synced
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2 rounded-3xl bg-stone-100 p-2 text-center text-[0.7rem] font-medium text-stone-600">
                      <span className="rounded-2xl bg-white px-2 py-2 text-stone-950">Home</span>
                      <span className="rounded-2xl px-2 py-2">Exams</span>
                      <span className="rounded-2xl px-2 py-2">Grid</span>
                      <span className="rounded-2xl px-2 py-2">Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
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
                  <Link
                    href={data.examSessions[0]?.href ?? "/exams"}
                    className="text-sm font-medium text-teal-700 hover:text-teal-800"
                  >
                    Open exam route
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {data.examSessions.map((session) => (
                    <Link
                      key={session.sessionId}
                      href={session.href}
                      className="block border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-white"
                    >
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
                    </Link>
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
                  <Link
                    href={data.assessmentSessions[0]?.href ?? "/assessments"}
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Open assessment route
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {data.assessmentSessions.map((session) => (
                    <Link
                      key={session.sessionId}
                      href={session.href}
                      className="block border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-white"
                    >
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
                    </Link>
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
