import { ExamExperience } from "./exam-experience";
import Link from "next/link";
import {
  getExamPapersApiData,
  getExamSessionApiData,
  getReadAloudSessionApiData,
} from "@/lib/api/server";

interface ExamsPageProps {
  searchParams?: Promise<{
    examId?: string;
    questionId?: string;
  }>;
}

function ExamsRecoveryState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            Exam Engine Recovery
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            {description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">What to try</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Open saved progress first to recover the safest stored resume path.
              </p>
            </div>
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Fallback route</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Use the dashboard to pick a different live study route while exam data is unavailable.
              </p>
            </div>
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Support state</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Accessibility settings and saved support preferences still remain available elsewhere in the MVP.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/saved-progress"
              className="inline-flex items-center justify-center border border-teal-700 bg-teal-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              Open saved progress
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
            >
              Return to dashboard
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
            >
              Open support hub
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  try {
    const [papers, readAloudSession] = await Promise.all([
      getExamPapersApiData(),
      getReadAloudSessionApiData("question"),
    ]);

    if (papers.length === 0) {
      return (
        <ExamsRecoveryState
          title="No exam papers are available right now."
          description="The exam route loaded without any paper definitions, so the safest option is to route the student back into saved progress or another working study flow instead of showing a broken paper screen."
        />
      );
    }

    const seededEntries = await Promise.all(
      papers.map(async (paper) => [paper.examId, await getExamSessionApiData(paper.examId)] as const),
    );
    const sessionSeeds = Object.fromEntries(seededEntries);
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const initialExamId =
      resolvedSearchParams?.examId && sessionSeeds[resolvedSearchParams.examId]
        ? resolvedSearchParams.examId
        : papers[0]?.examId;

    if (!initialExamId || !sessionSeeds[initialExamId]) {
      return (
        <ExamsRecoveryState
          title="Exam session data is incomplete for the selected paper."
          description="The exam papers loaded, but the matching seeded session could not be prepared safely. This recovery state keeps the route usable without pretending the paper is ready when it is not."
        />
      );
    }

    return (
      <ExamExperience
        papers={papers}
        sessionSeeds={sessionSeeds}
        readAloudSession={readAloudSession}
        initialExamId={initialExamId}
        initialQuestionId={resolvedSearchParams?.questionId}
      />
    );
  } catch {
    return (
      <ExamsRecoveryState
        title="The exam route could not finish loading."
        description="A paper or saved exam session failed while the route was preparing the live exam experience. The route now falls back to a recovery screen so the student can move into a safer saved-progress or dashboard path instead of losing context."
      />
    );
  }
}
