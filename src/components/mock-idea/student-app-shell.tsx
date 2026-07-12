"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  MOBILE_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  isNavItemActive,
} from "@/components/mock-idea/brand-tokens";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { premiumUi } from "@/components/premium/premium-ui";
import { getPowerGridRankPresentation } from "@/lib/power-grid/rank-presentation";
import { prefixPreviewHref } from "@/lib/preview/links";

interface StudentAppShellProps {
  children: ReactNode;
  displayName?: string;
  supportChips?: string[];
  isAuthenticated?: boolean;
  showSendSideRail?: boolean;
  studyDaysThisWeek?: number;
  powerGridLevel?: string;
  xpTotal?: number;
  hrefPrefix?: string;
  showUtilityLinks?: boolean;
  accountHref?: string;
}

export function StudentAppShell({
  children,
  displayName,
  isAuthenticated = true,
  studyDaysThisWeek,
  powerGridLevel = "Voltage Rising",
  xpTotal,
  hrefPrefix = "",
  showUtilityLinks = true,
  accountHref = "/account",
}: StudentAppShellProps) {
  const pathname = usePathname();
  const firstName = displayName?.trim().split(/\s+/)[0] ?? "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const rankPresentation = xpTotal !== undefined ? getPowerGridRankPresentation(xpTotal) : null;
  const sidebarRankLabel = rankPresentation ? `${rankPresentation.rank.icon} ${rankPresentation.rank.label}` : powerGridLevel;
  const sidebarProgress = rankPresentation?.powerLevelProgressPercentage ?? 24;
  const withPrefix = (href: string) => prefixPreviewHref(href, hrefPrefix);

  return (
    <div className={`min-h-screen ${premiumUi.shellBg}`}>
      <div className="flex min-h-screen">
        {/* Linear-style sidebar — desktop */}
        <aside
          className={`hidden w-64 shrink-0 flex-col lg:flex ${premiumUi.sidebarBg}`}
          aria-label="Study navigation"
        >
          <div className="border-b border-[#ddd3c6] p-5">
            <Link href={withPrefix("/dashboard")} className="block">
              <SwitchBrandLogo href={undefined} size="md" />
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {STUDENT_NAV_ITEMS.map((item) => {
              const active = isNavItemActive(pathname, item);
              const key = `${item.href}-${item.label}`;

              return (
                <Link
                  key={key}
                  href={withPrefix(item.href)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active ? premiumUi.navActive : premiumUi.navIdle
                  }`}
                >
                  <span
                    className={`inline-flex size-8 items-center justify-center rounded-lg text-sm ${
                      active ? "bg-[#0f766e]/12 text-[#0f766e]" : "bg-[#f4ede2] text-[#6f7b77]"
                    }`}
                    aria-hidden="true"
                  >
                    {item.short}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#ddd3c6] p-4">
            <div className={`${premiumUi.cardMuted} space-y-3`}>
              <p className={premiumUi.eyebrowAccent}>Power Grid</p>
              <p className="text-sm font-bold text-[#163038]">{sidebarRankLabel}</p>
              {rankPresentation ? (
                <p className="text-xs text-[#6f7b77]">
                  Power Level {rankPresentation.powerLevel} · {rankPresentation.xpTotal.toLocaleString()} XP
                </p>
              ) : null}
              <div className={premiumUi.progressTrack}>
                <div className={premiumUi.progressFill} style={{ width: `${sidebarProgress}%` }} />
              </div>
            </div>
            {isAuthenticated ? (
              <Link
                href={accountHref}
                className="mt-4 flex items-center gap-3 rounded-xl border border-[#ddd3c6] bg-white px-3 py-2.5 transition hover:border-[#0f766e]/35"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-sm font-bold text-white">
                  {firstName.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#163038]">{firstName}</span>
                  <span className="block text-xs text-[#6f7b77]">Account</span>
                </span>
              </Link>
            ) : null}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile / tablet top bar */}
          <header className="sticky top-0 z-20 border-b border-[#ddd3c6] bg-[#fbf7f0]/95 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <Link href={withPrefix("/dashboard")}>
                <SwitchBrandLogo href={undefined} size="sm" />
              </Link>
              <div className="flex items-center gap-2">
                {showUtilityLinks ? (
                  <Link href={withPrefix("/support")} className="text-xs font-semibold text-[#52646a] hover:text-[#163038]">
                    Support
                  </Link>
                ) : null}
                {isAuthenticated ? (
                  <Link
                    href={accountHref}
                    className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-sm font-bold text-white"
                    aria-label={`${firstName} account`}
                  >
                    {firstName.slice(0, 1).toUpperCase()}
                  </Link>
                ) : (
                  <Link href="/login?reauth=1" className={premiumUi.primaryBtn}>
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard greeting — desktop main area */}
          <div className="hidden border-b border-[#ddd3c6] px-6 py-5 lg:block">
            <p className={premiumUi.eyebrowAccent}>Command centre</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#163038]">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-[#52646a]">
              {studyDaysThisWeek && studyDaysThisWeek > 0
                ? `${studyDaysThisWeek} study day${studyDaysThisWeek === 1 ? "" : "s"} this week — keep the streak alive.`
                : "One clear next step. Your progress, planner, and support tools in one place."}
            </p>
          </div>

          <main className="mx-auto min-w-0 w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom dock */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ddd3c6] bg-[#fbf7f0]/95 px-2 py-2 backdrop-blur-xl lg:hidden"
        aria-label="Mobile study dock"
      >
        <div className="mx-auto flex max-w-lg justify-between gap-1">
          {MOBILE_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const key = `${item.href}-${item.label}`;

            return (
              <Link
                key={key}
                href={withPrefix(item.href)}
                className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-bold ${
                  active ? "text-[#0f766e]" : "text-[#6f7b77]"
                }`}
              >
                <span
                  className={`inline-flex size-8 items-center justify-center rounded-xl text-sm ${
                    active ? "bg-[#0f766e]/12 text-[#0f766e]" : "bg-[#f4ede2] text-[#6f7b77]"
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
