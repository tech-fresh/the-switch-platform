import Link from "next/link";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import type { SavedProgressStatus } from "@/modules/saved-progress/types";

function formatLastActivity(timestamp?: string): string {
  if (!timestamp) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}

function getStatusClasses(status: SavedProgressStatus): string {
  if (status === "submitted") {
    return "border-sky-300 bg-sky-50 text-sky-900";
  }

  if (status === "paused") {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  return "border-emerald-300 bg-emerald-50 text-emerald-900";
}

export default async function SavedProgressPage() {
  const overview = await getSavedProgressOverview();

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Saved Progress
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Resume-ready autosave records gathered across exams and timed assessments.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route makes the MVP autosave rule visible. Students can see what is still in
                motion, where each session will resume, and whether access support snapshots are
                already traveling with the saved state.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Saved sessions</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{overview.sessionCount}</p>
              <p className="mt-1 text-sm text-stone-600">
                {overview.activeCount} still active across the student flow
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Access snapshots</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{overview.accessSnapshotCount}</p>
              <p className="mt-1 text-sm text-stone-600">
                Saved support settings ready for future resume flows
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Submitted</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{overview.submittedCount}</p>
              <p className="mt-1 text-sm text-stone-600">Completed records remain visible here</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Latest activity</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {formatLastActivity(overview.latestActivityAt)}
              </p>
              <p className="mt-1 text-sm text-stone-600">Most recent autosave touchpoint</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            {overview.sessions.map((session) => (
              <article
                key={session.progressId}
                className="grid gap-5 border border-stone-200 bg-white p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusClasses(session.status)}`}
                    >
                      {session.status}
                    </span>
                    <span className="border border-stone-300 bg-stone-50 px-2 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-700">
                      {session.entityType === "exam-session" ? "Exam session" : "Timed assessment"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                      {session.title}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">{session.subtitle}</p>
                  </div>
                  <div className="space-y-2 text-sm text-stone-700">
                    <p>{session.currentQuestionLabel}</p>
                    <p>{session.timeRemainingLabel}</p>
                    <p>{session.reviewSummary}</p>
                    <p>{session.supportSummary}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="border border-stone-200 bg-stone-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
                      <p className="mt-2 text-2xl font-semibold text-stone-950">
                        {session.completionPercentage}%
                      </p>
                    </div>
                    <div className="border border-stone-200 bg-stone-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Last saved</p>
                      <p className="mt-2 text-lg font-semibold text-stone-950">
                        {formatLastActivity(session.lastActivityAt)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={session.href}
                    className="inline-flex items-center justify-center border border-teal-700 bg-teal-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
                  >
                    Open and resume
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Next best action
              </h2>
              <p className="text-sm leading-6 text-stone-700">{overview.recommendedAction}</p>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>Autosave is now a student-facing capability, not just background plumbing.</li>
                <li>Exam and timed assessment records can be resumed from one shared module.</li>
                <li>Access arrangement snapshots travel with saved progress across modules.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
