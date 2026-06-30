"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  MOCK_IDEA_BRAND,
  MOBILE_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  badgeAccentClasses,
  isNavItemActive,
  navAccentClasses,
} from "@/components/mock-idea/brand-tokens";
import {
  getPowerGridLevelIndex,
  POWER_GRID_LEVELS,
} from "@/components/streamlined/mark32-dashboard-utils";

interface StudentAppShellProps {
  children: ReactNode;
  displayName?: string;
  supportChips?: string[];
  isAuthenticated?: boolean;
  showSendSideRail?: boolean;
  studyDaysThisWeek?: number;
  powerGridLevel?: string;
}

export function StudentAppShell({
  children,
  displayName,
  isAuthenticated = true,
  studyDaysThisWeek,
  powerGridLevel = "Voltage Rising",
}: StudentAppShellProps) {
  const pathname = usePathname();
  const firstName = displayName?.trim().split(/\s+/)[0] ?? "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const levelIndex = getPowerGridLevelIndex(powerGridLevel as (typeof POWER_GRID_LEVELS)[number]);
  const levelProgress = Math.max(8, Math.min(100, Math.round((levelIndex / POWER_GRID_LEVELS.length) * 100)));

  return (
    <div className="min-h-screen bg-stone-100 text-slate-950">
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-100/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-teal-800 text-2xl text-white shadow-sm">
                    {MOCK_IDEA_BRAND.logoGlyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black tracking-tight text-stone-950">THE SWITCH</span>
                    <span className="block text-[10px] font-semibold tracking-[0.32em] text-stone-500">
                      PLATFORM
                    </span>
                  </span>
                </Link>
                <div className="hidden h-10 w-px bg-stone-300 lg:block" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
                    Mission Control
                  </p>
                  <h1 className="truncate text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                    {greeting}, {firstName}
                  </h1>
                  <p className="mt-1 text-sm text-stone-600">
                    {studyDaysThisWeek && studyDaysThisWeek > 0 ? (
                      <>
                        {studyDaysThisWeek} study day{studyDaysThisWeek === 1 ? "" : "s"} this week. Keep the next
                        step simple.
                      </>
                    ) : (
                      "One clear next step, your saved work, and your support tools in one place."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/support"
                  className="hidden rounded-2xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-sky-300 hover:text-sky-900 sm:inline-flex"
                >
                  Support
                </Link>
                <Link
                  href="/accessibility"
                  className="hidden rounded-2xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-teal-300 hover:text-teal-900 sm:inline-flex"
                >
                  Access settings
                </Link>
                <div className="hidden rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-right sm:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">Power Grid</p>
                  <p className="text-sm font-semibold text-stone-950">
                    Level {levelIndex} of {POWER_GRID_LEVELS.length}
                  </p>
                </div>
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="inline-flex size-10 items-center justify-center rounded-2xl bg-teal-800 text-sm font-bold text-white shadow-sm"
                    aria-label={`${firstName} account`}
                  >
                    {firstName.slice(0, 1).toUpperCase()}
                  </Link>
                ) : (
                  <Link
                    href="/login?reauth=1"
                    className="rounded-2xl bg-teal-800 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-900"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden items-center justify-between gap-4 lg:flex">
              <nav className="flex flex-wrap items-center gap-2" aria-label="Student navigation">
                {STUDENT_NAV_ITEMS.map((item) => {
                  const active = isNavItemActive(pathname, item);
                  const key = `${item.href}-${item.label}`;

                  return (
                    <Link
                      key={key}
                      href={item.href}
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${navAccentClasses(item.accent, active)}`}
                    >
                      <span className="text-base" aria-hidden="true">
                        {item.short}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Current level
                  </p>
                  <p className="truncate text-sm font-semibold text-stone-950">{powerGridLevel}</p>
                </div>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${levelProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto min-w-0 max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile study dock"
      >
        <div className="mx-auto flex max-w-lg justify-between gap-1">
          {MOBILE_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const key = `${item.href}-${item.label}`;

            return (
              <Link
                key={key}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-bold ${
                  active ? "text-teal-900" : "text-slate-500"
                }`}
              >
                <span
                  className={`inline-flex size-8 items-center justify-center rounded-xl text-sm ${
                    active ? badgeAccentClasses(item.accent) : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {item.short}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
