import Link from "next/link";
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { PremiumHeroSection } from "@/components/premium/premium-hero-section";
import { PremiumHomepageMarketing } from "@/components/premium/premium-homepage-marketing";
import { PremiumHomepageSections } from "@/components/premium/premium-homepage-sections";
import { premiumUi } from "@/components/premium/premium-ui";
import { Mark32DailyQuote } from "@/components/streamlined/mark32-daily-quote";
import { getStudyDaysThisWeek } from "@/components/streamlined/mark32-dashboard-utils";
import { Mark32HeroRow } from "@/components/streamlined/mark32-hero-row";
import { Mark32WeakestTopics } from "@/components/streamlined/mark32-weakest-topics";
import { getPublicRouteHref } from "@/lib/public-route";
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

function StreamlinedRouteCards({
  cards,
  isAuthenticated = true,
}: {
  cards: DashboardRouteCard[];
  isAuthenticated?: boolean;
}) {
  if (!cards.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={getPublicRouteHref(card.href, isAuthenticated)}
          className={premiumUi.cardHover}
        >
          <p className={premiumUi.eyebrow}>{card.eyebrow}</p>
          <h3 className="mt-3 text-xl font-bold tracking-tight text-white">{card.title}</h3>
          <p className={`mt-2 ${premiumUi.body}`}>{card.description}</p>
          <p className="mt-4 text-sm font-semibold text-[#6C4EFF]">{card.stat}</p>
        </Link>
      ))}
    </div>
  );
}

function CompactRecentSessions({ sessions }: { sessions: DashboardSessionCard[] }) {
  if (!sessions.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0F1420] p-4">
        <p className={premiumUi.body}>No saved sessions yet.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/assessments" className={premiumUi.primaryBtn}>
            Start practice
          </Link>
          <Link href="/exams" className={premiumUi.secondaryBtn}>
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
          className="block rounded-2xl border border-white/10 bg-[#0F1420] p-4 transition hover:border-[#6C4EFF]/40"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{session.title}</h3>
            <span className="text-xs font-semibold text-[#9CA3AF]">{session.completionPercentage}%</span>
          </div>
          <p className={`mt-2 ${premiumUi.body}`}>{session.subtitle}</p>
          <p className="mt-2 text-sm font-semibold text-[#00BFFF]">{session.actionLabel}</p>
        </Link>
      ))}
    </div>
  );
}

function HomeMarketingContent({ data, isAuthenticated }: { data: DashboardHomeData; isAuthenticated: boolean }) {
  const studyDaysThisWeek = getStudyDaysThisWeek(data.weeklyPlanner);

  return (
    <>
      <PremiumHeroSection
        isAuthenticated={isAuthenticated}
        studyDaysThisWeek={studyDaysThisWeek}
        readinessScore={data.summary.examReadinessScore}
        xpTotal={data.summary.xpTotal}
      />

      <PremiumHomepageSections
        powerGridLevel={data.summary.overallLevel}
        readinessScore={data.summary.examReadinessScore}
        xpTotal={data.summary.xpTotal}
        isAuthenticated={isAuthenticated}
      />

      <PremiumHomepageMarketing />

      <section className="space-y-4">
        <div>
          <p className={premiumUi.eyebrowAccent}>Core study routes</p>
          <h2 className={`mt-2 ${premiumUi.heading}`}>Jump straight into study</h2>
          <p className={`mt-2 max-w-2xl ${premiumUi.body}`}>
            Start with the route that matches your next task — progress, planning, and support stay connected.
          </p>
        </div>
        <StreamlinedRouteCards
          cards={pickStudyRouteCards(data.routeCards)}
          isAuthenticated={isAuthenticated}
        />
      </section>

      <section className={`${premiumUi.card} sm:px-8`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={premiumUi.eyebrowAccent}>Ready to start</p>
            <h2 className={`mt-3 ${premiumUi.heading}`}>One sign-in. One calm revision home.</h2>
            <p className={`mt-3 ${premiumUi.body}`}>
              The Switch keeps revision, exams, support, and progress in one premium flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={isAuthenticated ? "/dashboard" : "/login?reauth=1"} className={premiumUi.primaryBtn}>
              {isAuthenticated ? "Open dashboard" : "Start Learning Free"}
            </Link>
            <Link href="/how-it-works" className={premiumUi.secondaryBtn}>
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
      {data.onboardingPersonalization.isActive ? (
        <section className={premiumUi.card}>
          <p className={premiumUi.eyebrowAccent}>Your setup</p>
          <div className="mt-4 space-y-3 rounded-2xl border border-[#6C4EFF]/30 bg-[#6C4EFF]/10 p-4">
            <p className="text-sm font-semibold text-white">{data.onboardingPersonalization.setupSummary}</p>
            <p className={premiumUi.body}>{data.onboardingPersonalization.studyGoalMessage}</p>
            <Link href={data.onboardingPersonalization.primarySubjectHref} className={premiumUi.primaryBtn}>
              Open your first subject
            </Link>
          </div>
        </section>
      ) : null}

      <Mark32HeroRow data={data} />

      {data.journey ? <JourneyNextStepPanel journey={data.journey} /> : null}

      <details className={`${premiumUi.card} group`}>
        <summary className="cursor-pointer list-none text-lg font-bold tracking-tight text-white marker:content-none [&::-webkit-details-marker]:hidden">
          <span className={premiumUi.eyebrowAccent}>More study tools</span>
          <span className="mt-2 block">Planner, saved work, routes, and support</span>
        </summary>
        <div className="mt-6 space-y-8 border-t border-white/10 pt-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Mark32DailyQuote motivation={data.dailyMotivation} />
            <Mark32WeakestTopics data={data} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <PlannerPromptCard initialDismissed={data.plannerPromptDismissed} />

            <article className={premiumUi.card}>
              <p className={premiumUi.eyebrowAccent}>Focus right now</p>
              <div className="mt-4 space-y-3">
                {topFocus.length ? (
                  topFocus.map((card) => (
                    <Link
                      key={card.subject}
                      href={card.subjectId ? `/subjects?subjectId=${encodeURIComponent(card.subjectId)}` : "/subjects"}
                      className="block rounded-2xl border border-white/10 bg-[#0F1420] p-4 transition hover:border-[#6C4EFF]/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">{card.subject}</h3>
                        <span className="text-xs font-semibold text-[#9CA3AF]">{card.readinessScore}/100</span>
                      </div>
                      <p className={`mt-2 ${premiumUi.body}`}>{card.recommendedFocus}</p>
                    </Link>
                  ))
                ) : (
                  <p className={premiumUi.body}>Start a practice session to build subject focus cards.</p>
                )}
              </div>
            </article>
          </div>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <article className={premiumUi.card}>
              <p className={premiumUi.eyebrow}>Other routes</p>
              {primaryRoute ? (
                <Link
                  href={primaryRoute.href}
                  className="mt-5 block rounded-2xl border border-[#6C4EFF]/30 bg-[#6C4EFF]/10 p-5 transition hover:border-[#6C4EFF]/50"
                >
                  <p className={premiumUi.eyebrowAccent}>{primaryRoute.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-white">{primaryRoute.title}</h3>
                  <p className={`mt-2 ${premiumUi.body}`}>{primaryRoute.description}</p>
                </Link>
              ) : null}
              {supportRoutes.length ? (
                <div className="mt-5">
                  <StreamlinedRouteCards cards={supportRoutes} />
                </div>
              ) : null}
            </article>

            <div className="space-y-6">
              <article className={premiumUi.card}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className={premiumUi.eyebrowAccent}>Resume recent work</p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-white">Return without losing momentum</h2>
                  </div>
                  <Link href="/saved-progress" className={premiumUi.linkAccent}>
                    View all
                  </Link>
                </div>
                <div className="mt-4">
                  <CompactRecentSessions sessions={recentSessions} />
                </div>
              </article>

              <SendSupportRail summary={data.supportSnapshotSummary} chips={data.supportPreferenceChips} />
            </div>
          </section>
        </div>
      </details>
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
        xpTotal={data.summary.xpTotal}
      >
        <div className="flex flex-col gap-8 pb-20 lg:pb-8">
          <DashboardStudentContent data={data} />
        </div>
      </StudentAppShell>
    );
  }

  return (
    <main className={premiumUi.publicMain}>
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <HomeMarketingContent data={data} isAuthenticated={isAuthenticated} />
      </div>
      <MarketingSiteFooter />
    </main>
  );
}
