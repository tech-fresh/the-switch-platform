import Link from "next/link";
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SubjectToneChip, subjectToneBlockClasses } from "@/components/subject-tone-chip";
import { WeeklyPlannerGrid } from "@/components/weekly-planner-grid";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import type {
  DashboardHomeData,
  DashboardMetric,
  DashboardRouteCard,
  DashboardSessionCard,
} from "@/modules/dashboard/types";

interface DashboardHomeProps {
  data: DashboardHomeData;
  mode: "home" | "dashboard";
  isAuthenticated?: boolean;
  displayName?: string;
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

function getSessionStatusClasses(status: DashboardSessionCard["status"]): string {
  return status === "submitted"
    ? "border-sky-300 bg-sky-50 text-sky-900"
    : "border-amber-300 bg-amber-50 text-amber-900";
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

function getMotivationClasses(colour: DashboardHomeData["dailyMotivation"]["colour"]): string {
  switch (colour) {
    case "amber":
      return "border-amber-300 bg-amber-50 text-amber-950";
    case "sky":
      return "border-sky-300 bg-sky-50 text-sky-950";
    case "rose":
      return "border-rose-300 bg-rose-50 text-rose-950";
    default:
      return "border-teal-300 bg-teal-50 text-teal-950";
  }
}

function MetricStrip({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className={`border p-4 ${getToneClasses(metric.tone)}`}>
          <p className="text-xs uppercase tracking-[0.2em] opacity-75">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
          <p className="mt-1 text-sm opacity-80">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}

function RouteCardGrid({ cards }: { cards: DashboardRouteCard[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
        >
          <div
            className={`inline-flex border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getToneClasses(card.tone)}`}
          >
            {card.eyebrow}
          </div>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-stone-950">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{card.description}</p>
          <p className="mt-4 text-sm font-medium text-stone-900">{card.stat}</p>
        </Link>
      ))}
    </section>
  );
}

function SessionList({
  title,
  eyebrowClass,
  linkHref,
  linkLabel,
  sessions,
}: {
  title: string;
  eyebrowClass: string;
  linkHref: string;
  linkLabel: string;
  sessions: DashboardSessionCard[];
}) {
  if (!sessions.length) {
    return null;
  }

  return (
    <article className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${eyebrowClass}`}>{title}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Pick up where you left off</h2>
        </div>
        <Link href={linkHref} className={`text-sm font-medium ${eyebrowClass} hover:opacity-80`}>
          {linkLabel}
        </Link>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {sessions.map((session) => (
          <Link
            key={session.sessionId}
            href={session.href}
            className="block border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${getSessionKindClasses(session.kind)}`}
                >
                  {session.kind}
                </span>
                <span
                  className={`border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${getSessionStatusClasses(session.status)}`}
                >
                  {session.status === "submitted" ? "submitted" : "live"}
                </span>
              </div>
              <span className="text-sm font-medium text-stone-700">{session.completionPercentage}%</span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-stone-950">{session.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{session.subtitle}</p>
            <p className="mt-3 text-sm text-stone-700">{session.timeLabel}</p>
            <p className="mt-2 text-sm font-medium text-teal-700">{session.actionLabel}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}

function SubjectFocusGrid({ cards }: { cards: DashboardHomeData["focusCards"] }) {
  if (!cards.length) {
    return null;
  }

  return (
    <section className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Subject focus</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.slice(0, 4).map((focus) => (
          <div
            key={focus.subject}
            className={`border p-4 ${subjectToneBlockClasses(focus.tone ?? "teal")}`}
          >
            <div className="flex items-center justify-between gap-3">
              <SubjectToneChip label={focus.subject} tone={focus.tone ?? "teal"} />
              <span className="text-xs uppercase tracking-[0.2em] opacity-80">{focus.level}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className={`h-full rounded-full ${getProgressBarClasses(focus.readinessScore)}`}
                style={{ width: `${focus.readinessScore}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-stone-800">{focus.readinessScore} / 100</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{focus.recommendedFocus}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeMarketingContent({ data, isAuthenticated }: { data: DashboardHomeData; isAuthenticated: boolean }) {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_20rem]">
        <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal-700">
                Study Atelier · The Switch
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Revision, practice, and exam readiness in one place.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                Open the dashboard to see what is saved, what needs attention, and what to do next — with
                accessibility and access support built in.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
                className="inline-flex items-center justify-center border border-teal-700 bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
              >
                {isAuthenticated ? "Open dashboard" : "Get started"}
              </Link>
              {!isAuthenticated ? (
                <Link
                  href="/login?reauth=1"
                  className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-teal-400 hover:bg-stone-50"
                >
                  Log in
                </Link>
              ) : null}
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
              >
                How it works
              </Link>
            </div>

            <MetricStrip metrics={data.metrics} />
          </div>
        </article>

        <aside className="space-y-4 border border-stone-200 bg-stone-950 p-5 text-stone-50 shadow-sm sm:p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Next step</p>
            <h2 className="text-xl font-semibold tracking-tight">{data.recommendedAction}</h2>
          </div>
          <div className="grid gap-3 border-y border-stone-800 py-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Trend</p>
              <p className={`mt-1 font-medium capitalize ${getTrendClasses(data.summary.overallTrend)}`}>
                {data.summary.overallTrend}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Strongest</p>
              <p className="mt-1 font-medium">{data.strongestSubject?.subject ?? "Not enough activity yet"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Watch next</p>
              <p className="mt-1 font-medium">{data.weakestSubject?.subject ?? "Start a first session"}</p>
            </div>
          </div>
          <Link
            href={data.continuityHref}
            className="inline-flex w-full items-center justify-center border border-teal-500 bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
          >
            {data.continuityActionLabel}
          </Link>
        </aside>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Platform routes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Everything in one study home</h2>
        </div>
        <RouteCardGrid cards={data.routeCards} />
      </section>

      <article className={`border p-5 shadow-sm sm:p-6 ${getMotivationClasses(data.dailyMotivation.colour)}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-75">Daily motivation</p>
            <blockquote className="mt-3 max-w-3xl text-lg font-medium leading-8 sm:text-xl">
              “{data.dailyMotivation.quote}”
            </blockquote>
          </div>
          <span className="border border-current/20 bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {data.dailyMotivation.focusLabel}
          </span>
        </div>
      </article>
    </>
  );
}

function DashboardStudentContent({ data }: { data: DashboardHomeData }) {
  return (
    <>
      <div className="space-y-4">
        <PlannerPromptCard initialDismissed={data.plannerPromptDismissed} />
        <WeeklyPlannerGrid planner={data.weeklyPlanner} compact />
        <SendSupportRail summary={data.supportSnapshotSummary} chips={data.supportPreferenceChips} />
      </div>

      <section className="grid gap-4 border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Recommended now</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">{data.recommendedAction}</h2>
          <p className="mt-2 text-sm text-stone-600">{data.continuityDescription}</p>
        </div>
        <Link
          href={data.continuityHref}
          className="inline-flex shrink-0 items-center justify-center border border-teal-700 bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          {data.continuityActionLabel}
        </Link>
      </section>

      <MetricStrip metrics={data.metrics} />

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Quick routes</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Jump back into study</h2>
        </div>
        <RouteCardGrid cards={data.routeCards} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SessionList
          title="Exam sessions"
          eyebrowClass="text-teal-700"
          linkHref={data.examSessions[0]?.href ?? "/exams"}
          linkLabel="All exams"
          sessions={data.examSessions}
        />
        <SessionList
          title="Timed assessments"
          eyebrowClass="text-emerald-700"
          linkHref={data.assessmentSessions[0]?.href ?? "/assessments"}
          linkLabel="All assessments"
          sessions={data.assessmentSessions}
        />
      </div>

      <SubjectFocusGrid cards={data.focusCards} />
    </>
  );
}

export function DashboardHome({ data, mode, isAuthenticated = false, displayName }: DashboardHomeProps) {
  const isHome = mode === "home";

  if (!isHome) {
    return (
      <StudentAppShell
        displayName={displayName}
        supportChips={data.supportPreferenceChips}
        showSendSideRail={false}
      >
        <div className="flex flex-col gap-8 pb-20 lg:pb-8">
          <DashboardStudentContent data={data} />
        </div>
      </StudentAppShell>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <HomeMarketingContent data={data} isAuthenticated={isAuthenticated} />
      </div>
      <MarketingSiteFooter />
    </main>
  );
}
