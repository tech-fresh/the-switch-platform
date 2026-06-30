"use client";

import type { ReactNode } from "react";

import { MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface OnboardingShellProps {
  stepIndex: number;
  totalSteps: number;
  stepLabels?: string[];
  title: ReactNode;
  subtitle?: ReactNode;
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export function OnboardingShell({
  stepIndex,
  totalSteps,
  stepLabels,
  title,
  subtitle,
  error,
  children,
  footer,
}: OnboardingShellProps) {
  const progress = Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));

  return (
    <main className={mark32Ui.publicMain}>
      <div className="border-b border-teal-900 bg-teal-950 px-4 py-3 text-center sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">
          {MOCK_IDEA_BRAND.name} dashboard creation · The Switch Platform
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <ol className="sticky top-8 space-y-2">
            {Array.from({ length: totalSteps }, (_, index) => {
              const done = index < stepIndex;
              const current = index === stepIndex;
              const label = stepLabels?.[index] ?? `Step ${index + 1}`;
              return (
                <li
                  key={index}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                    current
                      ? "border-teal-400 bg-teal-50 text-teal-900"
                      : done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-stone-200 bg-white text-stone-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded-lg text-[10px] ${
                        current ? "bg-teal-800 text-white" : done ? "bg-emerald-700 text-white" : "bg-stone-200"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="leading-tight">{label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>
                Dashboard setup · {stepLabels?.[stepIndex] ?? `Step ${stepIndex + 1}`} ({stepIndex + 1} of{" "}
                {totalSteps})
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-800 to-teal-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">{title}</h1>
            {subtitle ? <p className="text-sm leading-7 text-stone-600 sm:text-base">{subtitle}</p> : null}
          </header>

          {error ? (
            <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          <div className="flex-1">{children}</div>
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 lg:pl-[calc(11rem+2rem)]">
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
      className={mark32Ui.secondaryBtn}
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
      className={`${mark32Ui.primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {label}
    </button>
  );
}
