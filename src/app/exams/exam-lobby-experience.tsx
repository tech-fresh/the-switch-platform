"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
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
      <Mark32PageHeader
        eyebrow="Exams"
        title="Full papers with timing, autosave, and access support"
        description="Pick a paper to open focus mode — no study navigation during the attempt. Resume in-progress sessions from here or saved progress."
        aside={
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Focus mode</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              Active papers hide the study rail so you can concentrate. Exit anytime to return to this lobby.
            </p>
            <Link
              href="/saved-progress"
              className="mt-4 inline-flex rounded-2xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-300 hover:bg-teal-50"
            >
              Open saved progress
            </Link>
          </div>
        }
      />

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
              className="flex flex-col justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
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
                  className="rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-900"
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
