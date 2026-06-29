import Link from "next/link";

import { Mark32PowerGridJourney } from "@/components/streamlined/mark32-power-grid-journey";
import type { PowerGridLevel } from "@/modules/power-grid/types";

interface Mark32MarketingSectionsProps {
  powerGridLevel?: PowerGridLevel;
  readinessScore?: number;
}

const FEATURE_ICONS = [
  { title: "Focused revision", detail: "Subject topics with clear revision guidance and practice bridges.", href: "/subjects" },
  { title: "Timed assessments", detail: "Practice under exam-style timing with autosave and access support.", href: "/assessments" },
  { title: "Track progress", detail: "Readiness scores, weekly planner, and Power Grid levels.", href: "/progress" },
  { title: "Accessible for all", detail: "Extra time, read-aloud, reader mode, and colour overlays.", href: "/accessibility" },
] as const;

const KEY_FEATURES = [
  { title: "Revision & learning", detail: "Topic content, editorial gates, and GCSE bridge context.", href: "/subjects" },
  { title: "Timed assessments", detail: "Configurable duration, question navigation, and saved attempts.", href: "/assessments" },
  { title: "Full GCSE exams", detail: "Paper lobby, focus mode, countdown timer, and mark-scheme review.", href: "/exams" },
  { title: "Progress tracking", detail: "Subject readiness, trends, and weakest-topic signals.", href: "/progress" },
  { title: "Power Grid", detail: "Nine-level journey that rewards consistent study.", href: "/progress" },
  { title: "Accessibility first", detail: "Support settings persist across study routes.", href: "/accessibility" },
] as const;

const ACCESSIBILITY_FEATURES = [
  "Extra time on timed routes",
  "Text-to-speech on questions",
  "Reader mode for calmer reading",
  "Colour overlay preferences",
  "Large text scaling",
  "Keyboard navigation and focus rings",
] as const;

export function Mark32MarketingSections({
  powerGridLevel = "Voltage Rising",
  readinessScore = 0,
}: Mark32MarketingSectionsProps) {
  return (
    <>
      <section className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Why Switch</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Built for real GCSE study</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURE_ICONS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:bg-stone-50"
            >
              <h3 className="text-base font-semibold text-stone-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Key features</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Everything in one study home</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {KEY_FEATURES.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:bg-stone-50"
            >
              <h3 className="text-lg font-semibold text-stone-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.detail}</p>
              <p className="mt-3 text-sm font-semibold text-teal-800">Explore</p>
            </Link>
          ))}
        </div>
      </section>

      <Mark32PowerGridJourney currentLevel={powerGridLevel} readinessScore={readinessScore} compact />

      <section className="border border-teal-800 bg-gradient-to-br from-teal-900 to-teal-800 p-6 text-white shadow-sm sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">Mission</p>
        <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 tracking-tight sm:text-2xl">
          Empower every student to unlock their potential through smart practice, clear progress, and inclusive
          learning experiences.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Accessibility</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              Inclusive learning built in
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              We support a wide range of access arrangements. Preferences save to your account and apply across
              exams, assessments, and revision routes.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {ACCESSIBILITY_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm"
              >
                <span className="mt-0.5 text-teal-700" aria-hidden>
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/accessibility"
            className="inline-flex bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Open accessibility settings
          </Link>
        </div>

        <aside className="space-y-4">
          <article className="border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Roadmap</p>
            <h3 className="mt-3 text-lg font-semibold text-stone-950">MVP (Mark 3.2)</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {["Auth & onboarding", "Practice & exams", "Progress & planner", "Accessibility"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-emerald-700">✓</span> {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">Next (v4.0)</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              <li>AI tutor & smart recommendations</li>
              <li>Performance insights & leaderboards</li>
            </ul>
          </article>
          <article className="border border-stone-200 bg-stone-50 p-5">
            <h3 className="text-lg font-semibold text-stone-950">Future</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              More subjects, mobile app, live classes, and parent/teacher dashboards.
            </p>
          </article>
        </aside>
      </section>
    </>
  );
}
