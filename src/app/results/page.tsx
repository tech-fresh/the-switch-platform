import { getResultsOverview } from "@/modules/results/service";

function getTrendTone(trend: "improving" | "stable" | "needs-attention"): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

export default async function ResultsPage() {
  const results = await getResultsOverview();

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
              Results
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Session outcome summaries that turn completed work into review decisions.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route closes the loop. It shows what the student scored, what looked strongest,
                what still needs attention, and where to go next.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Overall score</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {results.overallScorePercentage}%
              </p>
              <p className={`mt-1 text-sm capitalize ${getTrendTone(results.overallTrend)}`}>
                {results.overallTrend}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Exam average</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{results.averageExamScore}%</p>
              <p className="mt-1 text-sm text-stone-600">{results.examResults.length} exam result views</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Assessment average</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {results.averageAssessmentScore}%
              </p>
              <p className="mt-1 text-sm text-stone-600">{results.assessmentResults.length} checkpoint result views</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Exam results
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {results.examResults.map((result) => (
                  <div key={result.resultId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-stone-950">{result.title}</h2>
                      <span className={`text-sm font-medium capitalize ${getTrendTone(result.trend)}`}>
                        {result.trend}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{result.subtitle}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Score</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">
                          {result.scorePercentage}%
                        </p>
                      </div>
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">
                          {result.answeredCount}/{result.totalCount}
                        </p>
                      </div>
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Flags</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">{result.flaggedCount}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-700">
                      Strengths: {result.strengths.join(", ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{result.nextStep}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Timed assessment results
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {results.assessmentResults.map((result) => (
                  <div key={result.resultId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-stone-950">{result.title}</h2>
                      <span className={`text-sm font-medium capitalize ${getTrendTone(result.trend)}`}>
                        {result.trend}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{result.subtitle}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Score</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">
                          {result.scorePercentage}%
                        </p>
                      </div>
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">
                          {result.answeredCount}/{result.totalCount}
                        </p>
                      </div>
                      <div className="border border-stone-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Review marks</p>
                        <p className="mt-2 text-xl font-semibold text-stone-950">{result.flaggedCount}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-700">
                      Strengths: {result.strengths.join(", ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{result.nextStep}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Strongest area
              </h2>
              <p className="mt-4 text-lg font-semibold text-stone-950">{results.strongestArea}</p>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Next priority
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-700">{results.nextPriority}</p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
