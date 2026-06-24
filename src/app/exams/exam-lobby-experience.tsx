"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { buildExamFocusHref } from "@/lib/exams/focus-mode";
import type { ExamPaper, ExamSession } from "@/modules/exam-engine/types";

interface ExamLobbyExperienceProps {
  papers: ExamPaper[];
  sessionSeeds: Record<string, ExamSession>;
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

function getSessionAction(session: ExamSession): { label: string; questionId?: string } {
  if (session.status === "submitted") {
    return { label: "Review submitted paper" };
  }

  const answered = session.questionResponses.filter((response) => response.selectedOptionId).length;
  const firstOpen =
    session.questionResponses.find((response) => !response.selectedOptionId)?.questionId ??
    session.questionResponses[0]?.questionId;

  if (answered > 0) {
    return { label: "Continue exam", questionId: firstOpen };
  }

  return { label: "Start exam", questionId: session.questionResponses[0]?.questionId };
}

export function ExamLobbyExperience({ papers, sessionSeeds }: ExamLobbyExperienceProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Exams</p>
          <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Full papers with timing, autosave, and access support
          </h1>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            Pick a paper to open focus mode — no study navigation during the attempt. Resume in-progress
            sessions from here or saved progress.
          </p>
        </div>

        <div className="border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Focus mode</p>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Active papers hide the study rail so you can concentrate. Exit anytime to return to this lobby.
          </p>
          <Link
            href="/saved-progress"
            className="mt-4 inline-flex border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
          >
            Open saved progress
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {papers.map((paper) => {
          const session = sessionSeeds[paper.examId];
          const answered = session?.questionResponses.filter((response) => response.selectedOptionId).length ?? 0;
          const total = session?.questionResponses.length ?? paper.questions.length;
          const completion = Math.round((answered / Math.max(total, 1)) * 100);
          const action = session ? getSessionAction(session) : { label: "Start exam" };

          return (
            <article
              key={paper.examId}
              className="flex flex-col justify-between gap-4 border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  {paper.board} • {paper.qualificationType}
                </p>
                <h2 className="text-xl font-semibold text-stone-950">{paper.title}</h2>
                <p className="text-sm text-stone-600">
                  {paper.paperName} • {paper.durationMinutes} mins • {getPaperModeLabel(paper.paperMode)}
                </p>
                <p className="text-sm leading-6 text-stone-600">{paper.studentContextSummary}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Progress</p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">{completion}%</p>
                  <p className="text-xs text-stone-500">
                    {session?.status === "submitted" ? "Submitted" : `${answered}/${total} answered`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(buildExamFocusHref(paper.examId, action.questionId))}
                  className="bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  {action.label}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
