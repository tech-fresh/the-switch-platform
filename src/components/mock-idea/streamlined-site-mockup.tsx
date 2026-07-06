import Link from "next/link";

import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { MarketingSiteHeader } from "@/components/mock-idea/marketing-site-header";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import type { DashboardHomeData } from "@/modules/dashboard/types";

interface StreamlinedSiteMockupProps {
  dashboardData: DashboardHomeData;
  displayName?: string;
  isAuthenticated?: boolean;
}

function getToneClasses(tone: "teal" | "emerald" | "amber" | "sky" | "rose") {
  switch (tone) {
    case "emerald":
      return "border-emerald-300 bg-emerald-50 text-emerald-950";
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

export function StreamlinedSiteMockup({
  dashboardData,
  displayName = "Lloyd",
  isAuthenticated = true,
}: StreamlinedSiteMockupProps) {
  const topRoutes = dashboardData.routeCards.slice(0, 3);
  const topFocus = dashboardData.focusCards.slice(0, 3);
  const recentSessions = [...dashboardData.examSessions, ...dashboardData.assessmentSessions].slice(0, 2);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <section className="overflow-hidden border border-stone-300 bg-white shadow-xl">
        <MarketingSiteHeader isAuthenticated={isAuthenticated} />

        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_30%),linear-gradient(180deg,_#fffcf7,_#f5f5f4)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:grid lg:grid-cols-[minmax(0,1.15fr)_24rem] lg:gap-10">
            <div className="max-w-3xl">
              <SwitchBrandLogo href="/" size="hero" />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700">
                Streamlined concept
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                A calmer study website with one clear next step at a time.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                This direction strips the app back to one promise on the public site and one action on the student
                dashboard. Fewer competing blocks, more whitespace, and stronger trust signals.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login?reauth=1"
                  className="bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  Start your setup
                </Link>
                <Link
                  href="/dashboard"
                  className="border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:border-teal-400"
                >
                  View live dashboard
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "One clear promise",
                    detail: "Revision, practice, and exam readiness in one path instead of five competing messages.",
                  },
                  {
                    title: "Trust before decoration",
                    detail: "Accessibility, school scope, and support are visible early without taking over the hero.",
                  },
                  {
                    title: "Less above-the-fold noise",
                    detail: "Only the top message, one CTA pair, and three proof cards stay visible at first glance.",
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
                  What stays above the fold
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Clear headline",
                    "One primary CTA",
                    "One secondary CTA",
                    "Three trust points",
                    "No long feature wall",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border border-stone-200 bg-stone-50 px-3 py-2">
                      <span className="inline-flex size-6 items-center justify-center bg-teal-700 text-xs font-bold text-white">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-stone-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-amber-200 bg-[#fff8c4] p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-950">
                  What gets pushed down
                </p>
                <p className="mt-3 text-sm leading-7 text-amber-950/80">
                  Deep explanation, edge-case support notes, extra product variants, and multiple “coming later”
                  messages should move below the first decision point.
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
                detail: "One dashboard action, one focus block, one resume block.",
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
                title: "Feel launch confidence",
                detail: "Cleaner structure makes the product feel more credible and easier to explain.",
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

        <MarketingSiteFooter />
      </section>

      <section className="mt-16 overflow-hidden border border-stone-300 shadow-xl">
        <StudentAppShell displayName={displayName} showSendSideRail={false}>
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_22rem]">
              <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
                  Recommended now
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  {dashboardData.recommendedAction}
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  The streamlined dashboard starts with one action, not a wall of cards. Everything else supports
                  that single study decision.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={dashboardData.continuityHref}
                    className="bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                  >
                    Continue this step
                  </Link>
                  <Link
                    href="/progress"
                    className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
                  >
                    Open weekly plan
                  </Link>
                </div>
              </article>

              <article className="border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Calm dashboard rules
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "One hero decision",
                    "Three route cards max",
                    "Two resume cards max",
                    "Support rail grouped together",
                    "No duplicate motivational copy",
                  ].map((item) => (
                    <div key={item} className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {topRoutes.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="border border-stone-200 bg-white p-5 shadow-sm hover:border-teal-400"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
                  <p className="mt-4 text-sm font-semibold text-teal-800">{card.stat}</p>
                </Link>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <PlannerPromptCard />

              <article className="border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Focus right now</p>
                <div className="mt-4 space-y-3">
                  {topFocus.map((card) => (
                    <div key={card.subject} className="border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-stone-950">{card.subject}</h3>
                        <span className="text-xs font-semibold text-stone-500">{card.readinessScore}/100</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{card.recommendedFocus}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <article className="border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Resume recent work
                </p>
                <div className="mt-4 space-y-3">
                  {recentSessions.map((session: DashboardHomeData["examSessions"][number] | DashboardHomeData["assessmentSessions"][number]) => (
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
                    </Link>
                  ))}
                </div>
              </article>

              <SendSupportRail
                summary={dashboardData.supportSnapshotSummary}
                chips={dashboardData.supportPreferenceChips}
              />
            </div>
          </div>
        </StudentAppShell>
      </section>
    </div>
  );
}
