"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { QuizQuestion, SubmitQuizAnswerResult } from "@/modules/quiz/types";
import { PremiumAccessibilityToolbar } from "@/components/premium/premium-accessibility-toolbar";
import { premiumUi } from "@/components/premium/premium-ui";

interface PremiumQuizCardProps {
  quiz: QuizQuestion;
  topicId: string;
  selectedOptionId: string;
  feedback: SubmitQuizAnswerResult | null | undefined;
  submitState: "idle" | "saving" | "error";
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  questionIndex?: number;
  questionTotal?: number;
}

export function PremiumQuizCard({
  quiz,
  topicId,
  selectedOptionId,
  feedback,
  submitState,
  onSelectOption,
  onSubmit,
  questionIndex = 1,
  questionTotal = 1,
}: PremiumQuizCardProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [topicId]);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const progressPct = Math.round((questionIndex / questionTotal) * 100);

  return (
    <section className="space-y-4" aria-label="Quick check quiz">
      <div className={`${premiumUi.card} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className={premiumUi.eyebrowAccent}>Quick check</p>
            <p className="mt-1 text-sm font-semibold text-white">
              Question {questionIndex} of {questionTotal}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-white/10 bg-[#0B0F17] px-3 py-1.5 font-mono text-sm text-[#00BFFF]">
              {minutes}:{secs}
            </span>
            <span className="rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
              {submitState === "saving" ? "Saving…" : "Auto-save on"}
            </span>
          </div>
        </div>

        <div className={premiumUi.progressTrack}>
          <div className={premiumUi.progressFill} style={{ width: `${progressPct}%` }} />
        </div>

        <h2 className="text-xl font-bold leading-8 text-white sm:text-2xl">{quiz.prompt}</h2>

        <div className="space-y-3">
          {quiz.options.map((option, index) => {
            const isSelected = selectedOptionId === option.optionId;
            const isCorrect = feedback?.correctOptionId === option.optionId;
            const isWrong = feedback && isSelected && !feedback.isCorrect;

            return (
              <button
                key={option.optionId}
                type="button"
                onClick={() => onSelectOption(option.optionId)}
                disabled={submitState === "saving"}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                  isCorrect
                    ? "border-[#22C55E]/50 bg-[#22C55E]/10"
                    : isWrong
                      ? "border-[#EF4444]/50 bg-[#EF4444]/10"
                      : isSelected
                        ? "border-[#6C4EFF]/50 bg-[#6C4EFF]/10"
                        : "border-white/10 bg-[#0F1420] hover:border-[#6C4EFF]/30"
                }`}
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm leading-7 text-[#E5E7EB]">
                  <span className="font-semibold text-white">{option.label}</span> {option.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedOptionId || submitState === "saving"}
            className={`${premiumUi.primaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {submitState === "saving" ? "Checking answer…" : feedback ? "Next question →" : "Check answer"}
          </button>
          {feedback ? (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                feedback.isCorrect
                  ? "border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]"
                  : "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]"
              }`}
            >
              {feedback.isCorrect ? "Correct" : "Try again"}
            </span>
          ) : null}
          {submitState === "error" ? (
            <p className="text-sm text-[#EF4444]">Could not save — try again.</p>
          ) : null}
        </div>

        {feedback ? (
          <div className={`${premiumUi.cardMuted} space-y-3`}>
            <p className="text-sm font-semibold text-white">
              {feedback.isCorrect
                ? `Yes — ${feedback.correctOptionLabel} is correct.`
                : `The correct answer is ${feedback.correctOptionLabel}.`}
            </p>
            <p className={`${premiumUi.body}`}>{feedback.explanation}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: "Attempts", value: feedback.attemptsCount },
                { label: "Correct", value: feedback.correctCount },
                { label: "Accuracy", value: `${feedback.accuracyPercentage}%` },
              ].map((stat) => (
                <div key={stat.label} className={premiumUi.statCard}>
                  <p className={premiumUi.eyebrow}>{stat.label}</p>
                  <p className="mt-2 text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={premiumUi.body}>
            Seneca-style flow — pick an answer, get instant feedback, and feed your Power Grid voltage.
          </p>
        )}
      </div>

      <PremiumAccessibilityToolbar />
    </section>
  );
}
