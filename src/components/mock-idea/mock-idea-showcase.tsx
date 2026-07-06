import Link from "next/link";

import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { MarketingSiteHeader } from "@/components/mock-idea/marketing-site-header";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import type { DashboardHomeData } from "@/modules/dashboard/types";

interface MockIdeaShowcaseProps {
  dashboardData: DashboardHomeData;
  displayName?: string;
}

export function MockIdeaShowcase({ dashboardData, displayName = "Student" }: MockIdeaShowcaseProps) {
  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 1 · Marketing</p>
        <div className="overflow-x-auto border border-stone-300 shadow-xl">
          <MarketingSiteHeader />
          <div className="bg-stone-100 px-6 py-16">
            <p className="text-sm text-stone-600">Homepage hero area preview</p>
          </div>
          <MarketingSiteFooter />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 2 · Signed-in dashboard</p>
        <div className="overflow-hidden border border-stone-300 shadow-xl">
          <StudentAppShell displayName={displayName} supportChips={dashboardData.supportPreferenceChips}>
            <div className="space-y-6">
              <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Interactive preview</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                  Open the preview apps directly from here.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                  The gallery now links into a working preview namespace, so you can click through dashboard, subjects,
                  exams, progress, and profile without being pushed into the signed-in route gate.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/preview/dashboard" className="rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900">
                    Open app preview
                  </Link>
                  <Link href="/preview/subjects" className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50">
                    Subjects
                  </Link>
                  <Link href="/preview/exams" className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50">
                    Exams
                  </Link>
                  <Link href="/preview/progress" className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50">
                    Progress
                  </Link>
                </div>
              </div>
              <PlannerPromptCard />
              <SendSupportRail
                summary={dashboardData.supportSnapshotSummary}
                chips={dashboardData.supportPreferenceChips}
              />
            </div>
          </StudentAppShell>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Mockup 3 · Onboarding strip</p>
        <div className="border border-stone-300 bg-stone-950 px-6 py-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-300">
            {MOCK_IDEA_BRAND.name} guided setup · The Switch Platform
          </p>
        </div>
        <p className="text-sm text-stone-600">
          Full 8-step flow at{" "}
          <Link href="/onboarding" className="font-semibold text-teal-800 underline">
            /onboarding
          </Link>
          — account type, qualification, profile, school, subjects, support, guardian, consent.
        </p>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
          Mockup 4 · MVP SEND colour overlays
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEND_COLOUR_CHIPS.map((chip) => (
            <div key={chip.id} className="border border-stone-200 bg-white p-4">
              <div className="h-20 border border-stone-200" style={{ backgroundColor: chip.swatch }} />
              <p className="mt-3 text-sm font-semibold text-stone-900">{chip.label}</p>
              <p className="text-xs text-stone-500">{chip.swatch}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
          Mockup 5 · Official site logo
        </p>
        <div className="overflow-hidden border border-stone-300 shadow-xl">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_32%),linear-gradient(180deg,_#ffffff,_#f5f5f4)] px-6 py-10 sm:px-8">
            <SwitchBrandLogo href="/" size="hero" />
            <p className="mt-4 text-sm text-stone-600">Hero + header/footer/login/shell placements</p>
          </div>
          <div className="border-t border-stone-200">
            <MarketingSiteHeader isAuthenticated={false} />
          </div>
        </div>
        <p className="text-sm text-stone-600">
          Full placement gallery at{" "}
          <Link href="/brand-mockup" className="font-semibold text-teal-800 underline">
            /brand-mockup
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
