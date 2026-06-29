import Link from "next/link";
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getStudyDaysThisWeek } from "@/components/streamlined/mark32-dashboard-utils";
import { Mark32HeroRow } from "@/components/streamlined/mark32-hero-row";
import { Mark32SubjectGrid } from "@/components/streamlined/mark32-subject-grid";
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

const STUDY_ROUTE_PREFIXES = ["/exams", "/assessments", "/progress", "/subjects", "/saved-progress"];

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
      return "border-teal-300 bg-teal-50 text-teal-950";
  }
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
          className="border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:bg-stone-50"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{card.eyebrow}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{card.title}</h3>
          <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
          <p className="mt-4 text-sm font-semibold text-teal-800">{card.stat}</p>
        </Link>
      ))}
    </div>
  );
}

function HomeMarketingContent({ data, isAuthenticated }: { data: DashboardHomeData; isAuthenticated: boolean }) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/login?reauth=1";
  const primaryLabel = isAuthenticated ? "Open dashboard" : "Start your setup";

  return (
    <>
      <section className="overflow-hidden border border-stone-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_30%),linear-gradient(180deg,_#fffcf7,_#f5f5f4)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:gap-10">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700">
                GCSE revision · Study Atelier
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Revision, practice, and exam readiness — one clear next step at a time.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                Sign in to open your study home, resume saved work, and follow a calmer path through practice,
                full papers, and weekly planning.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  {primaryLabel}
                </Link>
                {!isAuthenticated ? (
                  <Link
                    href="/login?reauth=1"
                    className="border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:border-teal-400"
                  >
                    Log in
                  </Link>
                ) : (
                  <Link
                    href="/how-it-works"
                    className="border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:border-teal-400"
                  >
                    How it works
                  </Link>
                )}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "One clear promise",
                    detail: "Practice, full papers, and planning in one study home — not five competing messages.",
                  },
                  {
                    title: "Trust before decoration",
                    detail: "Accessibility, support, and school scope stay visible without crowding the hero.",
                  },
                  {
                    title: "Resume where you left off",
                    detail: "Saved exams and checkpoints open from the dashboard with the right deep links.",
                  },
                ].map((item) => (
                  <article key={item.title} className="border border-stone-200 bg-white/90 p-4 shadow-sm">
                    <h2 className="text-base font-semibold tracking-tight text-stone-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="mt-8 space-y-4 lg:mt-0">
              <div className="border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Recommended now
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{data.recommendedAction}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">{data.continuityDescription}</p>
                <Link
                  href={data.continuityHref}
                  className="mt-4 inline-flex bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  {data.continuityActionLabel}
                </Link>
              </div>

              <div className="border border-amber-200 bg-[#fff8c4] p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-950">
                  Secondary school · GCSE England + iGCSE
                </p>
                <p className="mt-3 text-sm leading-7 text-amber-950/80">
                  Wales and Northern Ireland qualification paths are coming later. Onboarding still builds your
                  dashboard from your chosen subjects and support settings.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
            {[
              {
                eyebrow: "For students",
                title: "Know what to do next",
                detail: "One dashboard action, one focus block, and direct links into exams and practice.",
                tone: "teal" as const,
              },
              {
                eyebrow: "For parents",
                title: "See a safer learning path",
                detail: "Support and access are visible without overcrowding the interface.",
                tone: "amber" as const,
              },
              {
                eyebrow: "For schools",
                title: "Launch with confidence",
                detail: "Cleaner structure makes the platform easier to explain and navigate.",
                tone: "emerald" as const,
              },
            ].map((item) => (
              <article key={item.title} className={`border p-5 shadow-sm ${getToneClasses(item.tone)}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-80">{item.eyebrow}</p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 opacity-85">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Core study routes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Jump straight into study</h2>
        </div>
        <StreamlinedRouteCards cards={pickStudyRouteCards(data.routeCards)} />
      </section>
    </>
  );
}

function DashboardStudentContent({ data }: { data: DashboardHomeData }) {
  const topRoutes = pickStudyRouteCards(data.routeCards);
  const topFocus = data.focusCards.slice(0, 3);
  const recentSessions = pickRecentSessions(data);

  return (
    <div className="space-y-8">
      <Mark32HeroRow data={data} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Mark32SubjectGrid subjects={data.focusCards} />
        <Mark32WeakestTopics data={data} />
      </div>

      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Recommended now</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          {data.recommendedAction}
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">{data.continuityDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={data.continuityHref}
            className="bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            {data.continuityActionLabel}
          </Link>
          <Link
            href="/progress"
            className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
          >
            Open weekly plan
          </Link>
          <Link
            href="/saved-progress"
            className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
          >
            Saved progress
          </Link>
        </div>
      </article>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Quick routes</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Open practice, exams, or planning</h2>
        </div>
        <StreamlinedRouteCards cards={topRoutes} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PlannerPromptCard initialDismissed={data.plannerPromptDismissed} />

        <article className="border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Focus right now</p>
          <div className="mt-4 space-y-3">
            {topFocus.length ? (
              topFocus.map((card) => (
                <Link
                  key={card.subject}
                  href={card.subjectId ? `/subjects?subjectId=${encodeURIComponent(card.subjectId)}` : "/subjects"}
                  className="block border border-stone-200 bg-stone-50 p-4 hover:border-teal-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-stone-950">{card.subject}</h3>
                    <span className="text-xs font-semibold text-stone-500">{card.readinessScore}/100</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{card.recommendedFocus}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-6 text-stone-600">Start a practice session to build subject focus cards.</p>
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Resume recent work</p>
            <Link href="/saved-progress" className="text-sm font-semibold text-teal-800 hover:opacity-80">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentSessions.length ? (
              recentSessions.map((session) => (
                <Link
                  key={session.sessionId}
                  href={session.href}
                  className="block border border-stone-200 bg-stone-50 p-4 hover:border-teal-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-stone-950">{session.title}</h3>
                    <span className="text-xs font-semibold text-stone-500">{session.completionPercentage}%</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{session.subtitle}</p>
                  <p className="mt-2 text-sm font-semibold text-teal-800">{session.actionLabel}</p>
                </Link>
              ))
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-stone-600">No saved sessions yet.</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/assessments"
                    className="bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900"
                  >
                    Start practice
                  </Link>
                  <Link
                    href="/exams"
                    className="border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-teal-400"
                  >
                    Open exams
                  </Link>
                </div>
              </div>
            )}
          </div>
        </article>

        <SendSupportRail summary={data.supportSnapshotSummary} chips={data.supportPreferenceChips} />
      </div>
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
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <HomeMarketingContent data={data} isAuthenticated={isAuthenticated} />
      </div>
      <MarketingSiteFooter />
    </main>
  );
}
