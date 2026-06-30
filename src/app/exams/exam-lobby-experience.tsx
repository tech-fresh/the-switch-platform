"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Mark32ExamPaperCard } from "@/components/streamlined/mark32-exam-paper-card";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
import type { ExamPaper, ExamSession } from "@/modules/exam-engine/types";

interface ExamLobbyExperienceProps {
  papers: ExamPaper[];
  sessionSeeds: Record<string, ExamSession>;
}

function groupPapersBySubject(papers: ExamPaper[]): Map<string, ExamPaper[]> {
  const grouped = new Map<string, ExamPaper[]>();

  for (const paper of papers) {
    const existing = grouped.get(paper.subject) ?? [];
    existing.push(paper);
    grouped.set(paper.subject, existing);
  }

  return grouped;
}

export function ExamLobbyExperience({ papers, sessionSeeds }: ExamLobbyExperienceProps) {
  const groupedPapers = useMemo(() => groupPapersBySubject(papers), [papers]);
  const inProgressCount = papers.filter((paper) => {
    const session = sessionSeeds[paper.examId];
    if (!session || session.status === "submitted") {
      return false;
    }

    return session.questionResponses.some((response) => response.selectedOptionId);
  }).length;

  return (
    <div className="flex flex-col gap-8">
      <Mark32PageHeader
        eyebrow="Exams"
        title="Choose a full paper, then enter focus mode."
        description="Pick subject, board, tier, and duration — then start or continue with autosave and access support intact."
        aside={
          <div className={`${mark32Ui.statCard} space-y-3`}>
            <p className={mark32Ui.eyebrowSm}>Exam center</p>
            <p className="text-sm leading-6 text-stone-700">
              {papers.length} paper{papers.length === 1 ? "" : "s"} available
              {inProgressCount ? ` · ${inProgressCount} in progress` : ""}
            </p>
            <p className="text-sm leading-6 text-stone-600">
              Active papers hide the study rail so you can concentrate. Exit anytime to return here.
            </p>
            <Link href="/saved-progress" className={mark32Ui.secondaryBtn}>
              Open saved progress
            </Link>
          </div>
        }
      />

      <section className={`${mark32Ui.cardMuted} flex flex-wrap items-center gap-3 text-sm text-stone-700`}>
        <span className={mark32Ui.eyebrowSm}>Selection path</span>
        <ol className="flex flex-wrap items-center gap-2">
          {["Subject", "Board", "Tier", "Duration", "Start"].map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800">
                {step}
              </span>
              {index < 4 ? <span className="text-stone-400">→</span> : null}
            </li>
          ))}
        </ol>
      </section>

      {[...groupedPapers.entries()].map(([subject, subjectPapers]) => (
        <section key={subject} className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={mark32Ui.eyebrow}>{subject}</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
                {subjectPapers.length} paper{subjectPapers.length === 1 ? "" : "s"}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {subjectPapers.map((paper) => (
              <Mark32ExamPaperCard key={paper.examId} paper={paper} session={sessionSeeds[paper.examId]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
