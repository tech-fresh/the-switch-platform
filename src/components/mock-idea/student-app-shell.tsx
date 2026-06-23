"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS, STUDENT_NAV_ITEMS } from "@/components/mock-idea/brand-tokens";

interface StudentAppShellProps {
  children: ReactNode;
  displayName?: string;
  supportChips?: string[];
}

function navItemClasses(active: boolean, accent: "sky" | "violet" | "amber" | "rose"): string {
  if (!active) {
    return "rounded-2xl px-2 py-3 text-slate-600 transition hover:bg-white/80";
  }

  if (accent === "violet") {
    return "rounded-2xl bg-violet-100 px-2 py-3 text-violet-800";
  }
  if (accent === "amber") {
    return "rounded-2xl bg-amber-100 px-2 py-3 text-amber-900";
  }
  if (accent === "rose") {
    return "rounded-2xl bg-rose-100 px-2 py-3 text-rose-900";
  }

  return "rounded-2xl bg-sky-100 px-2 py-3 text-sky-800";
}

export function StudentAppShell({ children, displayName, supportChips = [] }: StudentAppShellProps) {
  const pathname = usePathname();
  const firstName = displayName?.trim().split(/\s+/)[0] ?? "Student";

  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        <aside className="hidden w-24 shrink-0 flex-col border-r border-slate-200/80 bg-[#f4f8ff] px-2 py-4 lg:flex">
          <Link
            href="/dashboard"
            className="mb-4 flex flex-col items-center gap-1 text-indigo-700"
            aria-label={MOCK_IDEA_BRAND.name}
          >
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-indigo-100 text-lg">
              {MOCK_IDEA_BRAND.logoGlyph}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Mock</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {STUDENT_NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 text-center text-[11px] font-medium ${navItemClasses(active, item.accent)}`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-2 border-t border-slate-200/80 pt-3">
            {SEND_COLOUR_CHIPS.slice(0, 2).map((chip) => (
              <Link
                key={chip.id}
                href={chip.href}
                className={`block rounded-lg border px-1 py-1 text-center text-[9px] font-semibold leading-tight ${chip.className}`}
              >
                {chip.label.split(" ")[0]}
              </Link>
            ))}
            <Link
              href="/account"
              className="mx-auto flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm"
              aria-label={`${firstName} account`}
            >
              🙂
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-amber-100 text-xl lg:hidden">
                  🙂
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">Welcome to {MOCK_IDEA_BRAND.name}</p>
                  <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Good morning, {firstName}
                  </h1>
                  <p className="text-xs text-slate-500">100 XP to Level 1 · Study Pulse active</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {supportChips.slice(0, 3).map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-800"
                  >
                    {chip}
                  </span>
                ))}
                <Link
                  href="/accessibility"
                  className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-800"
                >
                  Access settings
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 sm:px-6">{children}</div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        {STUDENT_NAV_ITEMS.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-medium ${
                active ? "bg-sky-100 text-sky-800" : "text-slate-600"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
