"use client";

import type { ReactNode } from "react";

import { MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

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
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <div className="border-b border-stone-200 bg-stone-950 px-4 py-3 text-center sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-300">
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
                  className={`flex items-center gap-2 border px-3 py-2 text-xs font-semibold ${
                    current
                      ? "border-teal-400 bg-teal-50 text-teal-900"
                      : done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-stone-200 bg-white text-stone-500"
                  }`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center text-[10px] ${
                      current ? "bg-teal-800 text-white" : done ? "bg-emerald-700 text-white" : "bg-stone-200"
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
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>
                Step {stepIndex + 1} of {totalSteps}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden bg-stone-200">
              <div className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">{title}</h1>
            {subtitle ? <p className="text-sm leading-7 text-stone-600 sm:text-base">{subtitle}</p> : null}
          </header>

          {error ? (
            <div className="mb-6 border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div>
          ) : null}

          <div className="flex-1">{children}</div>
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
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
      className="border-2 border-teal-700 bg-white px-6 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 disabled:opacity-50"
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
      className="bg-teal-800 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-teal-400"
    >
      {label}
    </button>
  );
}
