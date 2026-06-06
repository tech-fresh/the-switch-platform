import { getMockPowerGridSummary } from "@/modules/power-grid/service";

function getTrendTone(trend: "improving" | "stable" | "declining"): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

export default async function ProgressPage() {
  const summary = await getMockPowerGridSummary();

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Power Grid Progress
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Readiness, trend, and next-step signals gathered from active exam and assessment sessions.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route is the first real progress surface. It pulls activity from the exam and
                timed assessment modules and translates it into Power Grid language the student can act on.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Overall level</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{summary.overallLevel}</p>
              <p className={`mt-1 text-sm font-medium capitalize ${getTrendTone(summary.overallTrend)}`}>
                {summary.overallTrend}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness score</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {summary.examReadinessScore} / 100
              </p>
              <p className="mt-1 text-sm text-stone-600">Built from active revision signals.</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Sessions live</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{summary.activeSessionCount}</p>
              <p className="mt-1 text-sm text-stone-600">
                {summary.completedSessionCount} completed, the rest still in motion
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            {summary.subjectProgress.map((subject) => (
              <article
                key={subject.subject}
                className="grid gap-5 border border-stone-200 bg-white p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                      {subject.subject}
                    </h2>
                    <span className="border border-stone-300 bg-stone-50 px-2 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-700">
                      {subject.level}
                    </span>
                    <span className={`text-sm font-medium capitalize ${getTrendTone(subject.trend)}`}>
                      {subject.trend}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-stone-600">{subject.evidence}</p>
                  <div className="border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                    Recommended next focus: {subject.recommendedFocus}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {subject.readinessScore} / 100
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {subject.completionScore}%
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Next best action
              </h2>
              <p className="text-sm leading-6 text-stone-700">{summary.nextBestAction}</p>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>Progress calculations can live in the Power Grid module.</li>
                <li>Exam and assessment activity can feed one readiness summary.</li>
                <li>Students can be told what to revise next in product language.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
