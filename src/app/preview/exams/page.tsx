import Link from "next/link";

import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";
import { getMockExamSession } from "@/modules/exam-engine/service";
import { listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";

const PREVIEW_PREFIX = "/preview";

interface PreviewExamsPageProps {
  searchParams?: Promise<{
    examId?: string;
  }>;
}

export default async function PreviewExamsPage({ searchParams }: PreviewExamsPageProps) {
  const dashboardData = buildMockPreviewDashboardData();
  const papers = listStudentVisibleExamPapers();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedExamId =
    resolvedSearchParams?.examId && papers.some((paper) => paper.examId === resolvedSearchParams.examId)
      ? resolvedSearchParams.examId
      : papers[0]?.examId;
  const selectedPaper = papers.find((paper) => paper.examId === selectedExamId) ?? papers[0];
  const selectedSession = selectedPaper
    ? await getMockExamSession(selectedPaper.examId, { userId: "guest-preview" })
    : null;

  return (
    <StudentAppShell
      displayName="Preview student"
      powerGridLevel={dashboardData.summary.overallLevel}
      hrefPrefix={PREVIEW_PREFIX}
      showUtilityLinks={false}
      accountHref="/preview/account"
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Exams preview</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Browse the paper lobby and inspect a live paper structure.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Pick a paper card to load its preview details, question list, and saved-progress status without jumping
            into the signed-in exam runtime.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {papers.map((paper) => {
            const isSelected = paper.examId === selectedPaper?.examId;

            return (
              <Link
                key={paper.examId}
                href={`/preview/exams?examId=${encodeURIComponent(paper.examId)}`}
                className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected
                    ? "border-teal-300 bg-teal-50/60"
                    : "border-stone-200 bg-white hover:border-teal-300"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-700">
                    {paper.board}
                  </span>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-700">
                    {paper.tier}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{paper.title}</h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{paper.studentContextSummary}</p>
                <p className="mt-4 text-sm font-semibold text-teal-900">
                  {isSelected ? "Open in preview below" : "Preview this paper"}
                </p>
              </Link>
            );
          })}
        </section>

        {selectedPaper && selectedSession ? (
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Selected paper</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">{selectedPaper.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {selectedPaper.paperName} · {selectedPaper.durationMinutes} minutes · {selectedPaper.totalMarks} marks
              </p>
              <div className="mt-6 space-y-3">
                {selectedSession.questions.map((question, index) => (
                  <div key={question.questionId} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Question {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">{question.prompt}</p>
                    <p className="mt-2 text-sm text-stone-600">
                      {(question.options?.length ?? 0)} options · mark scheme preview available in the full exam route
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Saved state</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Status: {selectedSession.status} · {selectedSession.questionResponses.length} seeded questions ready
                </p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Next app</p>
                <Link
                  href="/preview/progress"
                  className="mt-3 inline-flex rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  Open progress preview
                </Link>
              </div>
            </aside>
          </section>
        ) : null}
      </div>
    </StudentAppShell>
  );
}
