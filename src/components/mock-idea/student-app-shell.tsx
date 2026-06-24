"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  MOCK_IDEA_BRAND,
  SEND_COLOUR_CHIPS,
  STUDENT_NAV_ITEMS,
  badgeAccentClasses,
  navAccentClasses,
} from "@/components/mock-idea/brand-tokens";

interface StudentAppShellProps {
  children: ReactNode;
  displayName?: string;
  supportChips?: string[];
  /** Hide desktop SEND column when the page already renders SendSupportRail */
  showSendSideRail?: boolean;
}

export function StudentAppShell({
  children,
  displayName,
  showSendSideRail = true,
}: StudentAppShellProps) {
  const pathname = usePathname();
  const firstName = displayName?.trim().split(/\s+/)[0] ?? "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center bg-teal-800 text-sm font-bold text-white shadow-md shadow-teal-900/20">
              {MOCK_IDEA_BRAND.logoGlyph}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-stone-950">{MOCK_IDEA_BRAND.name}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-teal-700">Study Atelier</p>
            </div>
          </Link>

          <nav className="hidden flex-wrap items-center gap-1.5 lg:flex" aria-label="Student study rail">
            {STUDENT_NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${navAccentClasses(item.accent, active)}`}
                >
                  <span
                    className={`inline-flex size-5 items-center justify-center text-[10px] font-bold ${badgeAccentClasses(item.accent)}`}
                  >
                    {item.short}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/accessibility"
              className="hidden rounded-full border border-amber-300 bg-[#fff8c4] px-3 py-1.5 text-[11px] font-semibold text-amber-950 sm:inline-flex"
            >
              SEND colours
            </Link>
            <Link
              href="/account"
              className="inline-flex size-9 items-center justify-center border-2 border-teal-700 bg-teal-700 text-xs font-bold text-white"
              aria-label={`${firstName} account`}
            >
              {firstName.slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-stone-200/70 bg-gradient-to-r from-white via-stone-50 to-teal-50/40">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
              {MOCK_IDEA_BRAND.tagline}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              {greeting}, {firstName}
            </h1>
            <p className="text-sm text-stone-600">Your study home — saved work, next steps, and access tools.</p>
          </div>

          <Link
            href="/accessibility"
            className="border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:border-teal-400"
          >
            Access settings
          </Link>
        </div>

        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
          {STUDENT_NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 border px-3 py-1.5 text-[11px] font-semibold ${navAccentClasses(item.accent, active)}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div
        className={`mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 ${
          showSendSideRail ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_11rem]" : ""
        }`}
      >
        <main className="min-w-0 pb-20 lg:pb-8">{children}</main>

        {showSendSideRail ? (
          <aside className="hidden xl:block">
            <div className="sticky top-28 border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                SEND overlays
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {SEND_COLOUR_CHIPS.map((chip) => (
                  <Link
                    key={chip.id}
                    href={chip.href}
                    className="group flex flex-col items-center gap-1 border border-stone-200 p-2 text-center hover:border-teal-400"
                  >
                    <span
                      className="size-8 border border-stone-300 shadow-inner"
                      style={{ backgroundColor: chip.swatch }}
                      aria-hidden
                    />
                    <span className="text-[9px] font-semibold leading-tight text-stone-700 group-hover:text-teal-800">
                      {chip.label.split(" ")[0]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-300 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile study dock"
      >
        <div className="mx-auto flex max-w-lg justify-between gap-1">
          {STUDENT_NAV_ITEMS.slice(0, 5).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-semibold ${
                  active ? "text-teal-800" : "text-stone-500"
                }`}
              >
                <span
                  className={`inline-flex size-7 items-center justify-center text-[10px] font-bold ${
                    active ? badgeAccentClasses(item.accent) : "border border-stone-200 bg-stone-50 text-stone-600"
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
