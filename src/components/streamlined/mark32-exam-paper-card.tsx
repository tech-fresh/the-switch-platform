"use client";

import { useRouter } from "next/navigation";

import { mark32Ui } from "@/components/streamlined/mark32-ui";
import { buildExamFocusHref } from "@/lib/exams/focus-mode";
import type { ExamPaper, ExamSession } from "@/modules/exam-engine/types";

interface Mark32ExamPaperCardProps {
  paper: ExamPaper;
  session?: ExamSession;
}

function getPaperModeLabel(mode: ExamPaper["paperMode"]): string {
  if (mode === "year-10-end-of-year") {
    return "Year 10 end-of-year";
  }

  if (mode === "year-10-gcse-bridge") {
    return "Year 10 GCSE bridge";
  }

  if (mode === "year-11-mock") {
    return "Year 11 mock";
  }

  if (mode === "igcse-full-course") {
    return "Full iGCSE";
  }

  return "Full GCSE";
}

function getSessionState(session: ExamSession | undefined): {
  badge: string;
  badgeClass: string;
  actionLabel: string;
  questionId?: string;
  completion: number;
  answered: number;
  total: number;
  detail: string;
} {
  const total = session?.questionResponses.length ?? 0;
  const answered = session?.questionResponses.filter((response) => response.selectedOptionId).length ?? 0;
  const completion = Math.round((answered / Math.max(total, 1)) * 100);
  const firstOpen =
    session?.questionResponses.find((response) => !response.selectedOptionId)?.questionId ??
    session?.questionResponses[0]?.questionId;

  if (session?.status === "submitted") {
    return {
      badge: "Submitted",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
      actionLabel: "Review paper",
      questionId: firstOpen,
      completion: 100,
      answered,
      total,
      detail: "Ready to review your answers",
    };
  }

  if (answered > 0) {
    return {
      badge: "In progress",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-900",
      actionLabel: "Continue exam",
      questionId: firstOpen,
      completion,
      answered,
      total,
      detail: `${answered} of ${total} answered`,
    };
  }

  return {
    badge: "Not started",
    badgeClass: "border-stone-200 bg-stone-50 text-stone-700",
    actionLabel: "Start exam",
    questionId: session?.questionResponses[0]?.questionId,
    completion: 0,
    answered: 0,
    total,
    detail: total ? `${total} questions · ready when you are` : "Open to begin",
  };
}

export function Mark32ExamPaperCard({ paper, session }: Mark32ExamPaperCardProps) {
  const router = useRouter();
  const state = getSessionState(session);

  return (
    <article className={`${mark32Ui.cardHover} flex h-full flex-col gap-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-700">
              {paper.board}
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-700">
              {paper.tier}
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800">
              {paper.durationMinutes} mins
            </span>
          </div>
          <h3 className="text-xl font-semibold text-stone-950">{paper.title}</h3>
          <p className="text-sm text-stone-600">
            {paper.paperName} · {getPaperModeLabel(paper.paperMode)} · {paper.qualificationType}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${state.badgeClass}`}
        >
          {state.badge}
        </span>
      </div>

      <p className="text-sm leading-6 text-stone-600">{paper.studentContextSummary}</p>

      <div className="mt-auto space-y-3 border-t border-stone-100 pt-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-stone-600">
            <span>Paper progress</span>
            <span className="font-semibold text-stone-950">{state.completion}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className={`h-full rounded-full transition-all ${
                state.badge === "Submitted" ? "bg-emerald-500" : state.badge === "In progress" ? "bg-amber-400" : "bg-teal-700"
              }`}
              style={{ width: `${Math.max(state.completion, state.badge === "Not started" ? 0 : 4)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-stone-500">{state.detail}</p>
        </div>

        <button
          type="button"
          onClick={() => router.push(buildExamFocusHref(paper.examId, state.questionId))}
          className={
            state.badge === "Submitted"
              ? mark32Ui.secondaryBtn
              : state.badge === "In progress"
                ? "inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-400"
                : mark32Ui.primaryBtn
          }
        >
          {state.actionLabel}
        </button>
      </div>
    </article>
  );
}
