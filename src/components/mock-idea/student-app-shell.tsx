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
    <div className="min-h-screen bg-[#f7f8ff] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="relative hidden overflow-hidden bg-[#12005f] text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.55),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.45),transparent_32%)]" />
          <div className="relative z-10 flex h-full flex-col p-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-2xl shadow-xl">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              <span>
                <span className="block text-sm font-black tracking-tight">THE SWITCH</span>
                <span className="block text-[10px] font-semibold tracking-[0.32em] text-violet-100">PLATFORM</span>
              </span>
            </Link>

            <nav className="mt-8 space-y-1" aria-label="Student navigation">
              {STUDENT_NAV_ITEMS.map((item) => {
                const active = isNavItemActive(pathname, item);
                const key = "navKey" in item ? item.navKey : `${item.href}-${item.label}`;

                return (
                  <Link
                    key={key}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${navAccentClasses(item.accent, active)}`}
                  >
                    <span className="text-base">{item.short}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <section className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="grid size-12 place-items-center rounded-full bg-violet-500 text-lg font-bold text-white"
                  aria-label={`${firstName} account`}
                >
                  {firstName.slice(0, 1).toUpperCase()}
                </Link>
                <div>
                  <p className="font-black">{firstName}</p>
                  <p className="text-xs text-violet-100">
                    {MOCK_IDEA_BRAND.logoGlyph} {powerGridLevel}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-yellow-300" style={{ width: `${levelProgress}%` }} />
              </div>
              <p className="mt-2 text-xs text-violet-100">
                Level {levelIndex} of {POWER_GRID_LEVELS.length}
                {studyDaysThisWeek && studyDaysThisWeek > 0 ? ` · ${studyDaysThisWeek} study days` : ""}
              </p>
            </section>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:static lg:border-none lg:bg-transparent lg:px-8 lg:pt-6 lg:backdrop-blur-none">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-violet-600 lg:hidden">{MOCK_IDEA_BRAND.logoGlyph} The Switch Platform</p>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {greeting}, {firstName}! {MOCK_IDEA_BRAND.logoGlyph}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {studyDaysThisWeek && studyDaysThisWeek > 0 ? (
                    <>
                      You&apos;re on a <strong className="text-violet-700">{studyDaysThisWeek} day study streak</strong>.
                      Keep going!
                    </>
                  ) : (
                    "Your study home — saved work, next steps, and access tools."
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/accessibility"
                  className="hidden rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 sm:inline-flex"
                >
                  Access settings
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="inline-flex size-10 items-center justify-center rounded-2xl bg-violet-600 text-sm font-bold text-white shadow-lg"
                    aria-label={`${firstName} account`}
                  >
                    {firstName.slice(0, 1).toUpperCase()}
                  </Link>
                ) : (
                  <Link
                    href="/login?reauth=1"
                    className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-violet-700"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-violet-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile study dock"
      >
        <div className="mx-auto flex max-w-lg justify-between gap-1">
          {MOBILE_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const key = "navKey" in item ? item.navKey : `${item.href}-${item.label}`;

            return (
              <Link
                key={key}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-bold ${
                  active ? "text-violet-700" : "text-slate-500"
                }`}
              >
                <span
                  className={`inline-flex size-8 items-center justify-center rounded-xl text-sm ${
                    active ? badgeAccentClasses(item.accent) : "bg-violet-50 text-violet-600"
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
