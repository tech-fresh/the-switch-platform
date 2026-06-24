import Link from "next/link";

import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { MarketingSiteHeader } from "@/components/mock-idea/marketing-site-header";
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";
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
        <div className="overflow-hidden border border-stone-300 shadow-xl">
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
              <PlannerPromptCard />
              <SendSupportRail
                summary={dashboardData.supportSnapshotSummary}
                chips={dashboardData.supportPreferenceChips}
              />
              <div className="border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
                Live dashboard cards render here on `/dashboard` — this gallery shows the Mock Idea shell and
                access/SEND surfaces only.
              </div>
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
    </div>
  );
}
