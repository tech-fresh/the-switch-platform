"use client";

import type { ReactNode } from "react";

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
    <main className="flex min-h-screen flex-col bg-[#eef6ff] text-slate-800">
      <div className="px-4 pt-6 sm:px-8">
        <div className="relative mx-auto h-2 max-w-4xl overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-sky-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 size-7 -translate-y-1/2 rounded-full border-2 border-white bg-amber-300 text-center text-sm leading-7 shadow-sm"
            style={{ left: `calc(${progress}% - 14px)` }}
            aria-hidden
          >
            🙂
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10 sm:px-8">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500 sm:text-base">{subtitle}</p> : null}
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}

        <div className="flex-1">{children}</div>
      </div>

      <footer className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">{footer}</div>
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
      className="rounded-xl border-2 border-sky-500 bg-white px-6 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 disabled:opacity-50"
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
      className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-300"
    >
      {label}
    </button>
  );
}
