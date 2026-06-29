"use client";

import type { ReactNode } from "react";

import { MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface OnboardingShellProps {
  stepIndex: number;
  totalSteps: number;
  title: ReactNode;
  subtitle?: ReactNode;
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export function OnboardingShell({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  error,
  children,
  footer,
}: OnboardingShellProps) {
  const progress = Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));

  return (
    <main className={mark32Ui.publicMain}>
      <div className="border-b border-violet-200 bg-violet-950 px-4 py-3 text-center sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">
          {MOCK_IDEA_BRAND.name} guided setup · The Switch Platform
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[10rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <ol className="sticky top-8 space-y-2">
            {Array.from({ length: totalSteps }, (_, index) => {
              const done = index < stepIndex;
              const current = index === stepIndex;
              return (
                <li
                  key={index}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    current
                      ? "border-violet-400 bg-violet-50 text-violet-900"
                      : done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-violet-100 bg-white text-slate-500"
                  }`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-lg text-[10px] ${
                      current ? "bg-violet-700 text-white" : done ? "bg-emerald-700 text-white" : "bg-slate-200"
                    }`}
                  >
                    {index + 1}
                  </span>
                  Step {index + 1}
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>
                Step {stepIndex + 1} of {totalSteps}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            {subtitle ? <p className="text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p> : null}
          </header>

          {error ? (
            <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          <div className="flex-1">{children}</div>
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-violet-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 lg:pl-[calc(10rem+2rem)]">
          {footer}
        </div>
      </footer>
    </main>
  );
}

export function OnboardingBackButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border-2 border-violet-700 bg-white px-6 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-50 disabled:opacity-50"
    >
      Back
    </button>
  );
}

export function OnboardingContinueButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200/50 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-400"
    >
      {label}
    </button>
  );
}
