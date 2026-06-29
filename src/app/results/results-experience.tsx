import Link from "next/link";

import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import type { MarkingConfidence, ResultsOverview } from "@/modules/results/types";

function getTrendTone(trend: "improving" | "stable" | "needs-attention"): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

function getStatusClasses(status: "submitted" | "in-progress"): string {
  return status === "submitted"
    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
    : "border-amber-300 bg-amber-50 text-amber-900";
}

function getConfidenceClasses(confidence: MarkingConfidence): string {
  if (confidence === "high") {
    return "border-emerald-300 bg-emerald-50 text-emerald-900";
  }

  if (confidence === "medium") {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  return "border-rose-300 bg-rose-50 text-rose-900";
}

interface ResultsExperienceProps {
  results: ResultsOverview;
}

export function ResultsExperience({ results }: ResultsExperienceProps) {
  return (
    <div className="flex flex-col gap-8">
      <Mark32PageHeader
        eyebrow="Results"
        title="Scores, strengths, and what to review next"
        description="Exam and timed assessment outcomes from your saved sessions — pick up where you left off."
        stats={[
          {
            label: "Overall score",
            value: `${results.overallScorePercentage}%`,
            detail: results.overallTrend,
          },
          {
            label: "Exam average",
            value: `${results.averageExamScore}%`,
            detail: `${results.examResults.length} exam views`,
          },
          {
            label: "Assessment average",
            value: `${results.averageAssessmentScore}%`,
            detail: `${results.assessmentResults.length} checkpoint views`,
          },
          {
            label: "Ready for review",
            value: String(results.readyForReviewCount),
            detail: `${results.submittedCount} submitted`,
          },
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <article className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">Exam results</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {results.examResults.map((result) => (
                <ResultCard key={result.resultId} result={result} />
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Timed assessment results
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {results.assessmentResults.map((result) => (
                <ResultCard key={result.resultId} result={result} />
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Strongest area
            </h2>
            <p className="mt-4 text-lg font-semibold text-stone-950">{results.strongestArea}</p>
          </section>

          <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Next priority
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-700">{results.nextPriority}</p>
          </section>

          <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Continuity decision
            </h2>
            <p className="mt-4 text-lg font-semibold text-stone-950">{results.continuityTitle}</p>
            <p className="mt-3 text-sm leading-6 text-stone-700">{results.continuityDescription}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">
              {results.continuityStatus === "resume-active-session"
                ? "Resume active work"
                : results.continuityStatus === "review-submitted-session"
                  ? "Review submitted work"
                  : "Start first session"}
            </p>
            <Link
              href={results.continuityHref}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-violet-700"
            >
              {results.continuityActionLabel}
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}

type ResultCardData = ResultsOverview["examResults"][number];

function ResultCard({ result }: { result: ResultCardData }) {
  return (
    <div className="border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">{result.title}</h2>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span
            className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusClasses(result.status)}`}
          >
            {result.status === "submitted" ? "submitted" : "in progress"}
          </span>
          <span className={`text-sm font-medium capitalize ${getTrendTone(result.trend)}`}>
            {result.trend}
          </span>
        </div>
      </div>
      <p className="mt-1 text-sm text-stone-600">{result.subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="border border-stone-200 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Score</p>
          <p className="mt-2 text-xl font-semibold text-stone-950">{result.scorePercentage}%</p>
        </div>
        <div className="border border-stone-200 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
          <p className="mt-2 text-xl font-semibold text-stone-950">
            {result.answeredCount}/{result.totalCount}
          </p>
        </div>
        <div className="border border-stone-200 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Correct</p>
          <p className="mt-2 text-xl font-semibold text-stone-950">{result.correctCount}</p>
        </div>
        <div className="border border-stone-200 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Flags</p>
          <p className="mt-2 text-xl font-semibold text-stone-950">{result.flaggedCount}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getConfidenceClasses(result.markingConfidence)}`}
        >
          {result.markingConfidence} confidence marking
        </span>
        <span className="border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700">
          {result.incorrectCount} incorrect
        </span>
        <span className="border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700">
          {result.unansweredCount} unanswered
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-700">Strengths: {result.strengths.join(", ")}</p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
        {result.reviewPriorities.map((priority) => (
          <p key={priority}>{priority}</p>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        {result.markingNotes.map((note) => (
          <p key={note} className="text-sm leading-6 text-stone-600">
            {note}
          </p>
        ))}
      </div>
      {result.questionReview.length ? (
        <div className="mt-4 grid gap-2">
          {result.questionReview.slice(0, 4).map((item) => (
            <div key={item.questionId} className="border border-stone-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-stone-950">
                  {item.label} • {item.topic}
                </p>
                <span
                  className={`border px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${
                    item.outcome === "correct"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                      : item.outcome === "incorrect"
                        ? "border-rose-300 bg-rose-50 text-rose-900"
                        : "border-amber-300 bg-amber-50 text-amber-900"
                  }`}
                >
                  {item.outcome}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                Student: {item.selectedAnswerLabel} • Correct: {item.correctAnswerLabel}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-stone-600">{result.supportSummary}</p>
      {result.supportPreferenceChips.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.supportPreferenceChips.map((chip) => (
            <span
              key={chip}
              className="border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-stone-700">{result.reviewLabel}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{result.nextStep}</p>
      <div className="mt-4">
        <Link
          href={result.href}
          className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-violet-700"
        >
          {result.actionLabel}
        </Link>
      </div>
    </div>
  );
}
