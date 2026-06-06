import Link from "next/link";
import { getMockExamPapers } from "@/modules/exam-engine/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";

export default async function DashboardPage() {
  const summary = await getMockPowerGridSummary();
  const exams = getMockExamPapers();
  const assessments = getMockTimedAssessments();

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-700">
              Student Dashboard
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                A working launch surface for session status, next revision move, and exam readiness.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This dashboard starts tying the platform together. It now pulls from exams,
                timed assessments, and Power Grid progress instead of sitting as a blank placeholder.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Power Grid</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{summary.overallLevel}</p>
              <p className="mt-1 text-sm capitalize text-stone-600">{summary.overallTrend}</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {summary.examReadinessScore} / 100
              </p>
              <p className="mt-1 text-sm text-stone-600">Live from active sessions</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Active sessions</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{summary.activeSessionCount}</p>
              <p className="mt-1 text-sm text-stone-600">{summary.completedSessionCount} fully complete</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Next move
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {summary.nextBestAction}
                  </h2>
                </div>
                <Link
                  href="/progress"
                  className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
                >
                  Open progress
                </Link>
              </div>
            </article>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Exam sessions
                  </h2>
                  <Link href="/exams" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                    Open
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {exams.map((exam) => (
                    <div key={exam.examId} className="border border-stone-200 bg-stone-50 p-4">
                      <p className="text-sm font-semibold text-stone-950">{exam.title}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {exam.board} {exam.paperName} • {exam.durationMinutes} mins
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Timed assessments
                  </h2>
                  <Link
                    href="/assessments"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Open
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.assessmentId}
                      className="border border-stone-200 bg-stone-50 p-4"
                    >
                      <p className="text-sm font-semibold text-stone-950">{assessment.title}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {assessment.subject} • cap {assessment.officialDurationMinutes} mins
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Subject watch
              </h2>
              <div className="space-y-3">
                {summary.subjectProgress.map((subject) => (
                  <div key={subject.subject} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-stone-950">{subject.subject}</p>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                        {subject.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {subject.readinessScore} / 100 • {subject.recommendedFocus}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
