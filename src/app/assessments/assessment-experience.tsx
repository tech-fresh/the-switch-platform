"use client";

import { useState } from "react";
import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "@/modules/timed-assessment/types";

interface AssessmentExperienceProps {
  assessments: TimedAssessmentDefinition[];
  attemptSeeds: Record<string, Record<string, TimedAssessmentAttemptSeed>>;
  initialAssessmentId?: string;
  initialDurationKey?: string;
}

function formatTimer(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`;
}

function formatSavedAt(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function AssessmentExperience({
  assessments,
  attemptSeeds,
  initialAssessmentId,
  initialDurationKey,
}: AssessmentExperienceProps) {
  const startingAssessmentId =
    (initialAssessmentId && attemptSeeds[initialAssessmentId] ? initialAssessmentId : undefined) ??
    assessments[0]?.assessmentId ??
    "";
  const startingDurationKey =
    (initialDurationKey && attemptSeeds[startingAssessmentId]?.[initialDurationKey]
      ? initialDurationKey
      : undefined) ??
    Object.keys(attemptSeeds[startingAssessmentId] ?? {})[0] ??
    "";
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    startingAssessmentId,
  );
  const [selectedDurationKey, setSelectedDurationKey] = useState(
    startingDurationKey,
  );
  const [viewMode, setViewMode] = useState<"summary" | "review" | "submitted">(
    attemptSeeds[startingAssessmentId]?.[startingDurationKey]?.attempt.status === "submitted"
      ? "submitted"
      : "summary",
  );
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");

  const assessment =
    assessments.find((item) => item.assessmentId === selectedAssessmentId) ?? assessments[0];
  const availableDurations = Object.keys(attemptSeeds[assessment.assessmentId] ?? {}).map(Number);
  const seed =
    attemptSeeds[assessment.assessmentId]?.[selectedDurationKey] ??
    attemptSeeds[assessment.assessmentId]?.[String(availableDurations[0])];

  const answeredCount = seed.selectedAnswerIds.length;
  const completion = Math.round((answeredCount / assessment.questionCount) * 100);

  const handleSubmitAttempt = async () => {
    setSubmitState("submitting");

    try {
      const response = await fetch(
        `/api/assessments/seed/${encodeURIComponent(selectedAssessmentId)}?durationMinutes=${encodeURIComponent(
          selectedDurationKey,
        )}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Timed assessment submission request failed.");
      }

      seed.attempt.status = "submitted";
      setViewMode("submitted");
      setSubmitState("idle");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Timed Assessment
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Manual timed assessment flow with capped duration, autosave state, and resume-ready progress.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This slice builds the student practice loop: choose a checkpoint, set a duration
                within the official limit, and resume from the last saved state.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Assessment</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{assessment.title}</p>
              <p className="mt-1 text-sm text-stone-600">
                {assessment.subject} • {assessment.examBoard}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Session state</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                Saved {formatSavedAt(seed.attempt.lastSavedAt)}
              </p>
              <p className="mt-1 text-sm text-stone-600">Resume state comes from Saved Progress.</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{completion}% complete</p>
              <p className="mt-1 text-sm text-stone-600">
                {answeredCount} of {assessment.questionCount} checkpoint answers drafted
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Checkpoints
                </h2>
              </div>
              <div className="divide-y divide-stone-200">
                {assessments.map((item) => {
                  const isSelected = item.assessmentId === assessment.assessmentId;

                  return (
                    <button
                      key={item.assessmentId}
                      type="button"
                      onClick={() => {
                        setSelectedAssessmentId(item.assessmentId);
                        setSelectedDurationKey(
                          Object.keys(attemptSeeds[item.assessmentId] ?? {})[0] ?? "",
                        );
                        setViewMode(
                          attemptSeeds[item.assessmentId]?.[Object.keys(attemptSeeds[item.assessmentId] ?? {})[0] ?? ""]
                            ?.attempt.status === "submitted"
                            ? "submitted"
                            : "summary",
                        );
                        setSubmitState("idle");
                      }}
                      className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                        isSelected
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">{item.title}</span>
                        <span
                          className={`text-xs uppercase tracking-[0.2em] ${
                            isSelected ? "text-emerald-100" : "text-stone-500"
                          }`}
                        >
                          {item.tier ?? "All tiers"}
                        </span>
                      </div>
                      <p className={`text-sm ${isSelected ? "text-emerald-50" : "text-stone-600"}`}>
                        Official cap {item.officialDurationMinutes} mins • {item.questionCount} questions
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Duration presets
                </h2>
                <span className="text-sm font-semibold text-emerald-700">
                  Cap {assessment.officialDurationMinutes}m
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableDurations.map((duration) => {
                  const isSelected = selectedDurationKey === String(duration);

                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => {
                        const nextDurationKey = String(duration);
                        setSelectedDurationKey(nextDurationKey);
                        setViewMode(
                          attemptSeeds[assessment.assessmentId]?.[nextDurationKey]?.attempt.status === "submitted"
                            ? "submitted"
                            : "summary",
                        );
                        setSubmitState("idle");
                      }}
                      className={`border px-3 py-3 text-sm font-medium transition ${
                        isSelected
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {duration}m
                    </button>
                  );
                })}
              </div>
              <p className="text-sm leading-6 text-stone-600">
                Presets are created by the timed assessment service, so the UI never bypasses the
                official duration rules.
              </p>
            </section>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
              <span className="border border-stone-300 bg-white px-2 py-1">{assessment.subject}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">{assessment.examBoard}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                {assessment.questionCount} checkpoint questions
              </span>
              <button
                type="button"
                onClick={() => setViewMode("review")}
                disabled={seed.attempt.status === "submitted"}
                className="border border-stone-300 bg-white px-2 py-1 text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Review screen
              </button>
            </div>

            {viewMode === "summary" ? (
            <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
              <div className="grid gap-4 border-b border-stone-200 pb-5 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Chosen duration
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                    {seed.attempt.selectedDurationMinutes}m
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Adjusted duration
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                    {formatTimer(seed.attempt.adjustedDurationMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Time remaining
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                    {formatTimer(seed.attempt.timeRemainingMinutes)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Resume state
                  </p>
                  <div className="space-y-2 text-sm text-stone-700">
                    <p>Current question: {seed.currentQuestionId ?? "Not started"}</p>
                    <p>Saved answers: {seed.selectedAnswerIds.length}</p>
                    <p>Bookmarked questions: {seed.bookmarkedQuestionIds.length}</p>
                    <p>Working notes: {Object.keys(seed.notes).length}</p>
                  </div>
                </div>

                <div className="space-y-3 border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Access support
                  </p>
                  <div className="space-y-2 text-sm text-stone-700">
                    <p>
                      Active arrangements:{" "}
                      {seed.attempt.accessArrangements?.accessArrangementApplication.activeAccessArrangements
                        .length
                        ? seed.attempt.accessArrangements.accessArrangementApplication.activeAccessArrangements.join(
                            ", ",
                          )
                        : "None active in this seed"}
                    </p>
                    <p>
                      Read aloud:{" "}
                      {seed.attempt.accessArrangements?.accessArrangementApplication.readAloud.enabled
                        ? "enabled"
                        : "not enabled"}
                    </p>
                    <p>
                      Snapshot ready for save/resume:{" "}
                      {seed.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot
                        ? "yes"
                        : "no"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-stone-300 bg-white px-4 py-4 text-sm leading-6 text-stone-700">
                This route now proves the timed assessment module can own duration rules, pass
                access arrangements through the service layer, and restore a student practice
                attempt without forcing the UI to calculate the logic itself.
              </div>
            </article>
            ) : null}

            {viewMode === "review" ? (
              <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      End of checkpoint review
                    </p>
                    <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                      Check saved answers, bookmarks, and notes before submitting this attempt.
                    </h2>
                  </div>
                  <div className="grid gap-2 text-sm text-stone-700">
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {seed.selectedAnswerIds.length}/{assessment.questionCount} answered
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {seed.bookmarkedQuestionIds.length} bookmarked
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {Object.keys(seed.notes).length} notes saved
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                      Attempt coverage
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-stone-700">
                      <p>Current question: {seed.currentQuestionId ?? "Not started"}</p>
                      <p>Selected answers: {seed.selectedAnswerIds.length}</p>
                      <p>Written answers: {Object.keys(seed.writtenAnswers).length}</p>
                      <p>Time remaining: {seed.attempt.timeRemainingMinutes} mins</p>
                    </div>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                      Support carry-over
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-stone-700">
                      <p>
                        Read aloud:{" "}
                        {seed.attempt.accessArrangements?.accessArrangementApplication.readAloud.enabled
                          ? "enabled"
                          : "not enabled"}
                      </p>
                      <p>
                        Access snapshot:{" "}
                        {seed.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot
                          ? "saved"
                          : "not saved"}
                      </p>
                      <p>Attempt status: {seed.attempt.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-stone-600">
                    <p>{assessment.questionCount - seed.selectedAnswerIds.length} unanswered questions remain.</p>
                    <p>Submission here is a real saved-progress state change for the MVP prototype.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode("summary")}
                      className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                      Back to summary
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitAttempt}
                      disabled={submitState === "submitting"}
                      className="border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitState === "submitting" ? "Submitting..." : "Submit attempt"}
                    </button>
                  </div>
                </div>
                {submitState === "error" ? (
                  <p className="text-sm text-rose-700">
                    The timed assessment could not be submitted just yet. Try again.
                  </p>
                ) : null}
              </article>
            ) : null}

            {viewMode === "submitted" ? (
              <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
                <div className="space-y-3 border-b border-stone-200 pb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Checkpoint submitted
                  </p>
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                    This timed assessment is now marked as completed in the saved-progress flow.
                  </h2>
                  <p className="text-sm leading-6 text-stone-600">
                    The MVP can now move a timed assessment from active work into a completed review state,
                    just like the exam route.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {seed.selectedAnswerIds.length}/{assessment.questionCount}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Bookmarked</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {seed.bookmarkedQuestionIds.length}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Notes</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {Object.keys(seed.notes).length}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode("review")}
                    className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    Reopen review
                  </button>
                  <a
                    href="/results"
                    className="inline-flex items-center justify-center border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                  >
                    Open results route
                  </a>
                </div>
              </article>
            ) : null}
          </section>

          <aside className="space-y-6">
            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Checkpoint signals
              </h2>
              <div className="space-y-2 text-sm text-stone-600">
                <p>Selected answers: {seed.selectedAnswerIds.length}</p>
                <p>Written answers: {Object.keys(seed.writtenAnswers).length}</p>
                <p>Notes captured: {Object.keys(seed.notes).length}</p>
                <p>Attempt status: {seed.attempt.status}</p>
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>Manual timing is capped by official assessment duration.</li>
                <li>Access arrangements can extend the allowed session length.</li>
                <li>Saved progress is a module concern, not just a UI indicator.</li>
                <li>Checkpoint practice can feed later Power Grid progress summaries.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
