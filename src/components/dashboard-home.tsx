import Link from "next/link";
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { Mark32DailyQuote } from "@/components/streamlined/mark32-daily-quote";
import { getStudyDaysThisWeek } from "@/components/streamlined/mark32-dashboard-utils";
import { Mark32DevicePreview } from "@/components/streamlined/mark32-device-preview";
import { Mark32HeroRow } from "@/components/streamlined/mark32-hero-row";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { Mark32MarketingSections } from "@/components/streamlined/mark32-marketing-sections";
import { Mark32WeakestTopics } from "@/components/streamlined/mark32-weakest-topics";
import type {
  DashboardHomeData,
  DashboardRouteCard,
  DashboardSessionCard,
} from "@/modules/dashboard/types";

interface DashboardHomeProps {
  data: DashboardHomeData;
  mode: "home" | "dashboard";
  isAuthenticated?: boolean;
  displayName?: string;
}

const STUDY_ROUTE_PREFIXES = ["/subjects", "/exams", "/progress", "/saved-progress"];

function getToneClasses(tone: DashboardRouteCard["tone"]): string {
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
      return "border-violet-300 bg-violet-50 text-violet-950";
  }
}

function getMarketingToneClasses(tone: "violet" | "amber" | "emerald"): string {
  if (tone === "violet") return "border-teal-200 bg-teal-50 text-teal-950";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function pickStudyRouteCards(cards: DashboardRouteCard[], limit = 3): DashboardRouteCard[] {
  const studyCards = cards.filter((card) =>
    STUDY_ROUTE_PREFIXES.some((prefix) => card.href === prefix || card.href.startsWith(`${prefix}?`)),
  );

  if (studyCards.length >= limit) {
    return studyCards.slice(0, limit);
  }

  return cards.slice(0, limit);
}

function pickRecentSessions(data: DashboardHomeData, limit = 2): DashboardSessionCard[] {
  return [...data.examSessions, ...data.assessmentSessions]
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "in-progress" ? -1 : 1;
      }

      return right.completionPercentage - left.completionPercentage;
    })
    .slice(0, limit);
}

function StreamlinedRouteCards({ cards }: { cards: DashboardRouteCard[] }) {
  if (!cards.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{card.eyebrow}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{card.title}</h3>
          <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
          <p className="mt-4 text-sm font-semibold text-teal-900">{card.stat}</p>
        </Link>
      ))}
    </div>
  );
}

function CompactRecentSessions({ sessions }: { sessions: DashboardSessionCard[] }) {
  if (!sessions.length) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm leading-6 text-stone-600">No saved sessions yet.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/assessments"
            className="rounded-2xl bg-teal-800 px-4 py-2 text-sm font-bold text-white hover:bg-teal-900"
          >
            Start practice
          </Link>
          <Link
            href="/exams"
            className="rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-sky-300 hover:bg-sky-50"
          >
            Open exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Link
          key={session.sessionId}
          href={session.href}
          className="block rounded-2xl border border-stone-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-stone-950">{session.title}</h3>
            <span className="text-xs font-semibold text-stone-500">{session.completionPercentage}%</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">{session.subtitle}</p>
          <p className="mt-2 text-sm font-semibold text-teal-900">{session.actionLabel}</p>
        </Link>
      ))}
    </div>
  );
}

function HomeMarketingContent({ data, isAuthenticated }: { data: DashboardHomeData; isAuthenticated: boolean }) {
  const studyDaysThisWeek = getStudyDaysThisWeek(data.weeklyPlanner);

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_30%),linear-gradient(180deg,_#ffffff,_#f5f5f4)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <SwitchBrandLogo href="/" size="hero" />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800">
                Mark 4 direction
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                GCSE revision with a clearer next step on every screen.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                Smart practice, clear progress, and inclusive learning for GCSE students who need the interface to feel calm, focused, and easy to trust.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
                  className="rounded-2xl bg-teal-800 px-6 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-900"
                >
                  {isAuthenticated ? "Open dashboard" : "Get started free"}
                </Link>
                <Link
                  href="#features"
                  className="rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Study streak", value: `${studyDaysThisWeek} study day${studyDaysThisWeek === 1 ? "" : "s"} this week` },
                  { label: "Exam readiness", value: `${data.summary.examReadinessScore}% current readiness` },
                  { label: "Progress system", value: `Power Grid level ${data.summary.overallLevel}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-stone-200 bg-stone-50/90 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Know what to do next", detail: "One clear action instead of a crowded dashboard." },
                  { title: "Build confidence steadily", detail: "Revision, practice, and exams stay connected." },
                  { title: "Study with support built in", detail: "Accessibility and SEND choices stay visible when needed." },
                ].map((item) => (
                  <article key={item.title} className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-stone-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <Mark32DevicePreview />
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50/80">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
            {[
              { eyebrow: "For students", title: "One calm revision home", detail: "Learning, practice, and full exams now feel connected instead of scattered.", tone: "violet" as const },
              { eyebrow: "For parents", title: "Support stays visible", detail: "Accessibility and SEND-aware routes are easier to find without adding clutter.", tone: "amber" as const },
              { eyebrow: "For schools", title: "A clearer product story", detail: "The platform is easier to explain, demo, and trust from the first screen.", tone: "emerald" as const },
            ].map((item) => (
              <article key={item.title} className={`rounded-2xl border p-5 shadow-sm ${getMarketingToneClasses(item.tone)}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-80">{item.eyebrow}</p>
                <h2 className="mt-3 text-xl font-bold tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 opacity-85">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="space-y-10">
        <Mark32MarketingSections
          powerGridLevel={data.summary.overallLevel}
          readinessScore={data.summary.examReadinessScore}
        />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Core study routes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Jump straight into study</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
            Start with the route that matches your next task, then let the platform keep progress, planning, and support connected behind the scenes.
          </p>
        </div>
        <StreamlinedRouteCards cards={pickStudyRouteCards(data.routeCards)} />
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Ready to start</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Start with one sign-in and go straight to the next useful screen.
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              The Switch keeps revision, exams, support, and progress in one calmer flow so students do not need to work out the product before they can start learning.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
              className="rounded-2xl bg-teal-800 px-5 py-3 text-sm font-bold text-white hover:bg-teal-900"
            >
              {isAuthenticated ? "Open dashboard" : "Start learning free"}
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
            >
              Explore the platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DashboardStudentContent({ data }: { data: DashboardHomeData }) {
  const topRoutes = pickStudyRouteCards(data.routeCards);
  const topFocus = data.focusCards.slice(0, 3);
  const recentSessions = pickRecentSessions(data);
  const primaryRoute = topRoutes[0];
  const supportRoutes = topRoutes.slice(1);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mission Control</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">What should you do next?</h2>
        {data.onboardingPersonalization.isActive ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            <p className="text-sm font-semibold text-teal-950">{data.onboardingPersonalization.setupSummary}</p>
            <p className="text-sm leading-7 text-teal-900">{data.onboardingPersonalization.studyGoalMessage}</p>
            <p className="text-sm leading-7 text-teal-800">{data.onboardingPersonalization.examAvailabilitySummary}</p>
            <Link
              href={data.onboardingPersonalization.primarySubjectHref}
              className="inline-flex rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Open your first subject
            </Link>
          </div>
        ) : (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
            Start with one clear action, keep today&apos;s goal visible, and use saved progress only when it helps you continue smoothly.
          </p>
        )}
      </section>

      <Mark32HeroRow data={data} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Mark32DailyQuote motivation={data.dailyMotivation} />
        <Mark32WeakestTopics data={data} />
      </div>

      <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Continue learning</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          {data.recommendedAction}
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">{data.continuityDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={data.continuityHref}
            className="inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-900"
          >
            {data.continuityActionLabel}
          </Link>
          <Link
            href="/progress"
            className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
          >
            Open weekly plan
          </Link>
          <Link
            href="/saved-progress"
            className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-900 hover:border-stone-400 hover:bg-stone-50"
          >
            Saved progress
          </Link>
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PlannerPromptCard initialDismissed={data.plannerPromptDismissed} />

        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Focus right now</p>
          <div className="mt-4 space-y-3">
            {topFocus.length ? (
              topFocus.map((card) => (
                <Link
                  key={card.subject}
                  href={card.subjectId ? `/subjects?subjectId=${encodeURIComponent(card.subjectId)}` : "/subjects"}
                  className="block rounded-2xl border border-stone-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-stone-950">{card.subject}</h3>
                    <span className="text-xs font-semibold text-stone-500">{card.readinessScore}/100</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{card.recommendedFocus}</p>
                  <p className="mt-3 text-sm font-semibold text-teal-900">Open subject</p>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-6 text-stone-600">Start a practice session to build subject focus cards.</p>
            )}
          </div>
        </article>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">If you need something else</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">Keep the next move simple</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Use one route for your main study step, then come back here if you need planning, saved work, or a different study mode.
          </p>
          {primaryRoute ? (
            <Link
              href={primaryRoute.href}
              className="mt-5 block rounded-3xl border border-teal-200 bg-teal-50 p-5 hover:border-teal-300 hover:bg-teal-100/70"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-700">{primaryRoute.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">{primaryRoute.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">{primaryRoute.description}</p>
              <p className="mt-3 text-sm font-semibold text-teal-900">{primaryRoute.stat}</p>
            </Link>
          ) : null}
          {supportRoutes.length ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Other routes</p>
              <div className="mt-3">
                <StreamlinedRouteCards cards={supportRoutes} />
              </div>
            </div>
          ) : null}
        </article>

        <div className="space-y-6">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Resume recent work</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Return without losing momentum</h2>
              </div>
              <Link href="/saved-progress" className="text-sm font-semibold text-teal-800 hover:opacity-80">
                View all
              </Link>
            </div>
            <div className="mt-4">
              <CompactRecentSessions sessions={recentSessions} />
            </div>
          </article>

          <div>
            <SendSupportRail summary={data.supportSnapshotSummary} chips={data.supportPreferenceChips} />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DashboardHome({ data, mode, isAuthenticated = false, displayName }: DashboardHomeProps) {
  const isHome = mode === "home";

  if (!isHome) {
    const studyDaysThisWeek = getStudyDaysThisWeek(data.weeklyPlanner);

    return (
      <StudentAppShell
        displayName={displayName}
        supportChips={data.supportPreferenceChips}
        showSendSideRail={false}
        studyDaysThisWeek={studyDaysThisWeek}
        powerGridLevel={data.summary.overallLevel}
      >
        <div className="flex flex-col gap-8 pb-20 lg:pb-8">
          <DashboardStudentContent data={data} />
        </div>
      </StudentAppShell>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-slate-950">
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <HomeMarketingContent data={data} isAuthenticated={isAuthenticated} />
      </div>
      <MarketingSiteFooter />
    </main>
  );
}
