import Link from "next/link";

import { SavedProgressStatusControls } from "@/components/saved-progress-status-controls";
import { StudentRouteRecovery } from "@/components/student-route-recovery";
import type { SavedProgressOverview, SavedProgressStatus } from "@/modules/saved-progress/types";

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

interface SavedProgressExperienceProps {
  overview: SavedProgressOverview;
}

export function SavedProgressExperience({ overview }: SavedProgressExperienceProps) {
  if (overview.sessionCount === 0) {
    return (
      <StudentRouteRecovery
        eyebrow="Saved progress recovery"
        title="No saved sessions yet"
        description="Start an exam paper or timed assessment and your autosave records will appear here with resume links, support snapshots, and review checkpoints."
        actions={[
          { href: "/exams", label: "Open exam lobby", variant: "primary" },
          { href: "/assessments", label: "Start timed practice", variant: "secondary" },
          { href: "/dashboard", label: "Return to dashboard", variant: "secondary" },
        ]}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
            Saved progress
          </p>
          <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Resume exams and timed assessments from your autosave records
          </h1>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            See what is in progress, where each session resumes, and which access snapshots travel with
            your saved state.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Saved sessions</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{overview.sessionCount}</p>
            <p className="mt-1 text-sm text-stone-600">
              {overview.recoveryReadyCount} resume-ready
            </p>
          </div>
          <div className="border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Access snapshots</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{overview.accessSnapshotCount}</p>
            <p className="mt-1 text-sm text-stone-600">Support settings on saved records</p>
          </div>
          <div className="border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Submitted</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">{overview.reviewReadyCount}</p>
            <p className="mt-1 text-sm text-stone-600">Review-ready completions</p>
          </div>
          <div className="border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Latest activity</p>
            <p className="mt-2 text-lg font-semibold text-stone-950">
              {formatLastActivity(overview.latestActivityAt)}
            </p>
            <p className="mt-1 text-sm text-stone-600">Most recent autosave</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          {overview.sessions.map((session) => (
            <article
              key={session.progressId}
              className="grid gap-5 border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1.2fr_0.8fr]"
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
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{session.title}</h2>
                  <p className="mt-1 text-sm text-stone-600">{session.subtitle}</p>
                </div>
                <div className="space-y-2 text-sm text-stone-700">
                  <p>{session.currentQuestionLabel}</p>
                  <p>{session.timeRemainingLabel}</p>
                  <p>{session.reviewSummary}</p>
                  <p>{session.supportSummary}</p>
                </div>
                {session.supportPreferenceChips.length ? (
                  <div className="flex flex-wrap gap-2">
                    {session.supportPreferenceChips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
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
                  className="inline-flex items-center justify-center bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  {session.actionLabel}
                </Link>
                <SavedProgressStatusControls
                  entityId={session.entityId}
                  entityType={session.entityType}
                  recoveryState={session.recoveryState}
                  status={session.status}
                />
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="space-y-3 border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
              Next best action
            </h2>
            <p className="text-sm leading-6 text-stone-700">{overview.recommendedAction}</p>
            <Link
              href={overview.recommendedActionHref}
              className="inline-flex items-center justify-center bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Open next saved step
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
