"use client";

import { useState } from "react";
import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "@/modules/timed-assessment/types";

interface AssessmentExperienceProps {
  assessments: TimedAssessmentDefinition[];
  attemptSeeds: Record<string, Record<string, TimedAssessmentAttemptSeed>>;
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
}: AssessmentExperienceProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    assessments[0]?.assessmentId ?? "",
  );
  const [selectedDurationKey, setSelectedDurationKey] = useState(
    Object.keys(attemptSeeds[assessments[0]?.assessmentId ?? ""] ?? {})[0] ?? "",
  );

  const assessment =
    assessments.find((item) => item.assessmentId === selectedAssessmentId) ?? assessments[0];
  const availableDurations = Object.keys(attemptSeeds[assessment.assessmentId] ?? {}).map(Number);
  const seed =
    attemptSeeds[assessment.assessmentId]?.[selectedDurationKey] ??
    attemptSeeds[assessment.assessmentId]?.[String(availableDurations[0])];

  const answeredCount = seed.selectedAnswerIds.length;
  const completion = Math.round((answeredCount / assessment.questionCount) * 100);

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
                      onClick={() => setSelectedDurationKey(String(duration))}
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
            </div>

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
