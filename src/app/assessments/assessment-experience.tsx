"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildAccessibilityPreferenceChips, formatColourSchemeLabel } from "@/modules/accessibility/presentation";
import type { ReadAloudSession } from "@/modules/read-aloud/types";
import type {
  TimedAssessmentAttemptSeed,
  TimedAssessmentDefinition,
  TimedAssessmentQuestion,
} from "@/modules/timed-assessment/types";

interface AssessmentExperienceProps {
  assessments: TimedAssessmentDefinition[];
  attemptSeeds: Record<string, Record<string, TimedAssessmentAttemptSeed>>;
  readAloudSession: ReadAloudSession;
  initialAssessmentId?: string;
  initialDurationKey?: string;
  initialQuestionId?: string;
}

function cloneSeed(seed: TimedAssessmentAttemptSeed): TimedAssessmentAttemptSeed {
  return {
    ...seed,
    attempt: { ...seed.attempt },
    questions: seed.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    })),
    selectedAnswerIds: [...seed.selectedAnswerIds],
    writtenAnswers: { ...seed.writtenAnswers },
    notes: { ...seed.notes },
    bookmarkedQuestionIds: [...seed.bookmarkedQuestionIds],
  };
}

function cloneSeedWithInitialQuestion(
  seed: TimedAssessmentAttemptSeed,
  initialQuestionId?: string,
): TimedAssessmentAttemptSeed {
  const clonedSeed = cloneSeed(seed);

  if (initialQuestionId && clonedSeed.questions.some((question) => question.questionId === initialQuestionId)) {
    clonedSeed.currentQuestionId = initialQuestionId;
  }

  return clonedSeed;
}

function formatTimer(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`;
}

function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatSavedAt(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function buildAutosaveSignature(seed: TimedAssessmentAttemptSeed): string {
  return JSON.stringify({
    attemptId: seed.attempt.attemptId,
    status: seed.attempt.status,
    currentQuestionId: seed.currentQuestionId,
    selectedDurationMinutes: seed.attempt.selectedDurationMinutes,
    selectedAnswerIds: seed.selectedAnswerIds,
    writtenAnswers: seed.writtenAnswers,
    notes: seed.notes,
    bookmarkedQuestionIds: seed.bookmarkedQuestionIds,
    timeRemainingMinutes: seed.attempt.timeRemainingMinutes,
  });
}

function getQuestionIndex(seed: TimedAssessmentAttemptSeed): number {
  if (!seed.currentQuestionId) {
    return 0;
  }

  const explicitIndex = seed.questions.findIndex((question) => question.questionId === seed.currentQuestionId);

  return explicitIndex >= 0 ? explicitIndex : 0;
}

function getQuestionIndexWithOverride(
  seed: TimedAssessmentAttemptSeed,
  initialQuestionId?: string,
): number {
  if (initialQuestionId) {
    const explicitIndex = seed.questions.findIndex((question) => question.questionId === initialQuestionId);

    if (explicitIndex >= 0) {
      return explicitIndex;
    }
  }

  return getQuestionIndex(seed);
}

function getSelectedOptionId(seed: TimedAssessmentAttemptSeed, questionId: string): string | undefined {
  return seed.selectedAnswerIds.find((answerId) => answerId.startsWith(`${questionId}:`))?.split(":")[1];
}

function buildQuestionReadAloudText(
  question: TimedAssessmentQuestion | undefined,
  totalQuestions: number,
): string {
  if (!question) {
    return "";
  }

  return `Question ${question.number} of ${totalQuestions}. ${question.prompt} Options. ${question.options
    .map((option) => `${option.label}. ${option.text}`)
    .join(" ")}${question.guidance ? ` Guidance. ${question.guidance}` : ""}`;
}

export function AssessmentExperience({
  assessments,
  attemptSeeds,
  readAloudSession,
  initialAssessmentId,
  initialDurationKey,
  initialQuestionId,
}: AssessmentExperienceProps) {
  const initialSeedCache: Record<string, Record<string, TimedAssessmentAttemptSeed>> = Object.fromEntries(
    Object.entries(attemptSeeds).map(([assessmentId, seeds]) => [
      assessmentId,
      Object.fromEntries(
        Object.entries(seeds).map(([durationKey, seed]) => [durationKey, cloneSeed(seed)]),
      ),
    ]),
  );
  const startingAssessmentId =
    (initialAssessmentId && initialSeedCache[initialAssessmentId] ? initialAssessmentId : undefined) ??
    assessments[0]?.assessmentId ??
    "";
  const startingDurationKey =
    (initialDurationKey && initialSeedCache[startingAssessmentId]?.[initialDurationKey]
      ? initialDurationKey
      : undefined) ??
    Object.keys(initialSeedCache[startingAssessmentId] ?? {})[0] ??
    "";
  const fallbackSeed =
    initialSeedCache[startingAssessmentId]?.[startingDurationKey] ??
    Object.values(initialSeedCache[startingAssessmentId] ?? {})[0];
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(startingAssessmentId);
  const [selectedDurationKey, setSelectedDurationKey] = useState(startingDurationKey);
  const [seedCache, setSeedCache] = useState(initialSeedCache);
  const [seed, setSeed] = useState(() => cloneSeedWithInitialQuestion(fallbackSeed, initialQuestionId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() =>
    getQuestionIndexWithOverride(seed, initialQuestionId),
  );
  const [viewMode, setViewMode] = useState<"question" | "review" | "submitted">(
    seed.attempt.status === "submitted" ? "submitted" : "question",
  );
  const [voiceId, setVoiceId] = useState(readAloudSession.selectedVoiceId);
  const [speed, setSpeed] = useState(readAloudSession.speed);
  const [previewState, setPreviewState] = useState<"idle" | "playing" | "paused">("idle");
  const [autosaveState, setAutosaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(seed.attempt.timeRemainingMinutes * 60);
  const autosaveSignatureRef = useRef(buildAutosaveSignature(seed));
  const autoSubmitTriggeredRef = useRef(seed.attempt.status === "submitted");

  const assessment =
    assessments.find((item) => item.assessmentId === selectedAssessmentId) ?? assessments[0];
  const availableDurations = useMemo(
    () =>
      Object.keys(seedCache[assessment.assessmentId] ?? {})
        .map(Number)
        .sort((left, right) => left - right),
    [assessment.assessmentId, seedCache],
  );
  const currentQuestion = seed.questions[currentQuestionIndex] ?? seed.questions[0];
  const currentSelectedOptionId = currentQuestion
    ? getSelectedOptionId(seed, currentQuestion.questionId)
    : undefined;
  const answeredCount = seed.selectedAnswerIds.length;
  const completion = Math.round((answeredCount / Math.max(seed.questions.length, 1)) * 100);
  const noteCount = Object.values(seed.notes).filter((note) => note.trim()).length;
  const readAloudEnabled =
    seed.attempt.accessArrangements?.accessArrangementApplication.readAloud.enabled ??
    readAloudSession.accessArrangementConfig?.enabled ??
    false;
  const readAloudSource =
    seed.attempt.accessArrangements?.accessArrangementApplication.readAloud.source ??
    readAloudSession.accessArrangementConfig?.source ??
    "disabled";
  const currentReadAloudText = buildQuestionReadAloudText(currentQuestion, seed.questions.length);
  const supportSnapshot = seed.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot;
  const supportPreferenceChips = buildAccessibilityPreferenceChips(supportSnapshot);
  const extraTimePercentage =
    seed.attempt.accessArrangements?.accessArrangementApplication.duration.extraTimePercentage ?? 0;
  const timerAlertTone =
    timeRemainingSeconds <= 300
      ? "text-rose-700"
      : timeRemainingSeconds <= 900
        ? "text-amber-700"
        : "text-stone-950";

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPreviewState("idle");
  }, [selectedAssessmentId, selectedDurationKey, currentQuestionIndex]);

  useEffect(() => {
    setTimeRemainingSeconds(seed.attempt.timeRemainingMinutes * 60);
    autoSubmitTriggeredRef.current = seed.attempt.status === "submitted";
  }, [seed.attempt.attemptId, seed.attempt.status, seed.attempt.timeRemainingMinutes]);

  useEffect(() => {
    if (seed.attempt.status === "submitted") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemainingSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [seed.attempt.attemptId, seed.attempt.status]);

  useEffect(() => {
    if (seed.attempt.status === "submitted") {
      return;
    }

    const nextTimeRemainingMinutes = Math.ceil(timeRemainingSeconds / 60);

    if (nextTimeRemainingMinutes === seed.attempt.timeRemainingMinutes) {
      return;
    }

    setSeed((previous) => {
      const nextSeed = {
        ...previous,
        attempt: {
          ...previous.attempt,
          lastSavedAt: new Date().toISOString(),
          timeRemainingMinutes: nextTimeRemainingMinutes,
        },
      };

      setSeedCache((cache) => ({
        ...cache,
        [selectedAssessmentId]: {
          ...(cache[selectedAssessmentId] ?? {}),
          [selectedDurationKey]: nextSeed,
        },
      }));

      return nextSeed;
    });
  }, [seed.attempt.status, seed.attempt.timeRemainingMinutes, selectedAssessmentId, selectedDurationKey, timeRemainingSeconds]);

  useEffect(() => {
    if (seed.attempt.status === "submitted") {
      autosaveSignatureRef.current = buildAutosaveSignature(seed);
      setAutosaveState("idle");
      return;
    }

    const nextSignature = buildAutosaveSignature(seed);

    if (nextSignature === autosaveSignatureRef.current) {
      return;
    }

    setAutosaveState("saving");

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/assessments/seed/${encodeURIComponent(selectedAssessmentId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              attemptId: seed.attempt.attemptId,
              currentQuestionId: seed.currentQuestionId,
              selectedDurationMinutes: seed.attempt.selectedDurationMinutes,
              selectedAnswerIds: seed.selectedAnswerIds,
              writtenAnswers: seed.writtenAnswers,
              notes: seed.notes,
              bookmarkedQuestionIds: seed.bookmarkedQuestionIds,
              timeRemainingMinutes: seed.attempt.timeRemainingMinutes,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Timed assessment autosave request failed.");
        }

        autosaveSignatureRef.current = nextSignature;
        setAutosaveState("saved");
      } catch {
        setAutosaveState("error");
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [seed, selectedAssessmentId]);

  useEffect(() => {
    if (
      timeRemainingSeconds > 0 ||
      seed.attempt.status === "submitted" ||
      submitState === "submitting" ||
      autoSubmitTriggeredRef.current
    ) {
      return;
    }

    autoSubmitTriggeredRef.current = true;
    void handleSubmitAttempt();
  }, [seed.attempt.status, submitState, timeRemainingSeconds]);

  function resetSeed(assessmentId: string, durationKey: string) {
    const nextSeedSource =
      seedCache[assessmentId]?.[durationKey] ?? Object.values(seedCache[assessmentId] ?? {})[0];

    if (!nextSeedSource) {
      return;
    }

    const nextSeed = cloneSeed(nextSeedSource);

    setSelectedAssessmentId(assessmentId);
    setSelectedDurationKey(durationKey);
    setSeed(nextSeed);
    setCurrentQuestionIndex(getQuestionIndex(nextSeed));
    setViewMode(nextSeed.attempt.status === "submitted" ? "submitted" : "question");
    setAutosaveState("idle");
    setSubmitState("idle");
    setTimeRemainingSeconds(nextSeed.attempt.timeRemainingMinutes * 60);
    autosaveSignatureRef.current = buildAutosaveSignature(nextSeed);
    autoSubmitTriggeredRef.current = nextSeed.attempt.status === "submitted";
  }

  function syncSeed(nextSeed: TimedAssessmentAttemptSeed, nextViewMode?: "question" | "review" | "submitted") {
    const clonedSeed = cloneSeed(nextSeed);

    setSeedCache((cache) => ({
      ...cache,
      [nextSeed.attempt.assessmentId]: {
        ...(cache[nextSeed.attempt.assessmentId] ?? {}),
        [String(nextSeed.attempt.selectedDurationMinutes)]: clonedSeed,
      },
    }));
    setSeed(clonedSeed);
    setSelectedAssessmentId(nextSeed.attempt.assessmentId);
    setSelectedDurationKey(String(nextSeed.attempt.selectedDurationMinutes));
    setCurrentQuestionIndex(getQuestionIndex(clonedSeed));
    setViewMode(nextViewMode ?? (clonedSeed.attempt.status === "submitted" ? "submitted" : "question"));
    setAutosaveState("idle");
    setTimeRemainingSeconds(clonedSeed.attempt.timeRemainingMinutes * 60);
    autosaveSignatureRef.current = buildAutosaveSignature(clonedSeed);
    autoSubmitTriggeredRef.current = clonedSeed.attempt.status === "submitted";
  }

  function updateSeed(updater: (previous: TimedAssessmentAttemptSeed) => TimedAssessmentAttemptSeed) {
    setSeed((previous) => {
      const nextSeed = updater(previous);

      setSeedCache((cache) => ({
        ...cache,
        [previous.attempt.assessmentId]: {
          ...(cache[previous.attempt.assessmentId] ?? {}),
          [String(previous.attempt.selectedDurationMinutes)]: nextSeed,
        },
      }));

      return nextSeed;
    });
  }

  function handleSelectOption(optionId: string) {
    if (!currentQuestion) {
      return;
    }

    updateSeed((previous) => ({
      ...previous,
      attempt: {
        ...previous.attempt,
        lastSavedAt: new Date().toISOString(),
      },
      currentQuestionId: currentQuestion.questionId,
      selectedAnswerIds: [
        ...previous.selectedAnswerIds.filter((answerId) => !answerId.startsWith(`${currentQuestion.questionId}:`)),
        `${currentQuestion.questionId}:${optionId}`,
      ],
    }));
  }

  function handleToggleBookmark() {
    if (!currentQuestion) {
      return;
    }

    updateSeed((previous) => {
      const bookmarked = previous.bookmarkedQuestionIds.includes(currentQuestion.questionId);

      return {
        ...previous,
        attempt: {
          ...previous.attempt,
          lastSavedAt: new Date().toISOString(),
        },
        currentQuestionId: currentQuestion.questionId,
        bookmarkedQuestionIds: bookmarked
          ? previous.bookmarkedQuestionIds.filter((questionId) => questionId !== currentQuestion.questionId)
          : [...previous.bookmarkedQuestionIds, currentQuestion.questionId],
      };
    });
  }

  function handleNotesChange(notes: string) {
    if (!currentQuestion) {
      return;
    }

    updateSeed((previous) => ({
      ...previous,
      attempt: {
        ...previous.attempt,
        lastSavedAt: new Date().toISOString(),
      },
      currentQuestionId: currentQuestion.questionId,
      notes: {
        ...previous.notes,
        [currentQuestion.questionId]: notes,
      },
    }));
  }

  function moveQuestion(direction: -1 | 1) {
    const nextIndex = currentQuestionIndex + direction;

    if (nextIndex < 0 || nextIndex >= seed.questions.length) {
      return;
    }

    const nextQuestion = seed.questions[nextIndex];

    updateSeed((currentSeed) => ({
      ...currentSeed,
      currentQuestionId: nextQuestion.questionId,
    }));
    setCurrentQuestionIndex(nextIndex);
  }

  async function handleSubmitAttempt() {
    setSubmitState("submitting");

    try {
      const response = await fetch(`/api/assessments/seed/${encodeURIComponent(selectedAssessmentId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attemptId: seed.attempt.attemptId,
          currentQuestionId: seed.currentQuestionId,
          selectedDurationMinutes: seed.attempt.selectedDurationMinutes,
          selectedAnswerIds: seed.selectedAnswerIds,
          writtenAnswers: seed.writtenAnswers,
          notes: seed.notes,
          bookmarkedQuestionIds: seed.bookmarkedQuestionIds,
          timeRemainingMinutes: seed.attempt.timeRemainingMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error("Timed assessment submission request failed.");
      }

      syncSeed(
        {
          ...seed,
          attempt: {
            ...seed.attempt,
            status: "submitted",
            lastSavedAt: new Date().toISOString(),
          },
        },
        "submitted",
      );
      setSubmitState("idle");
    } catch {
      setSubmitState("error");
    }
  }

  function handleReadAloudAction(nextState: "playing" | "paused" | "idle") {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (nextState === "playing") {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentReadAloudText);
        utterance.rate = speed;
        utterance.lang =
          readAloudSession.availableVoices.find((voice) => voice.voiceId === voiceId)?.language ??
          "en-GB";
        utterance.onend = () => setPreviewState("idle");
        window.speechSynthesis.speak(utterance);
      }

      if (nextState === "paused") {
        window.speechSynthesis.pause();
      }

      if (nextState === "idle") {
        window.speechSynthesis.cancel();
      }
    }

    setPreviewState(nextState);
  }

  if (!assessment || !currentQuestion) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Timed Assessment
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Manual timed checkpoint with live countdown, autosave, resume, and read-aloud support.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route now behaves like a real checkpoint session. Students can move question by
                question, save notes, bookmark review items, and submit from the same timed flow.
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
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Autosave</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                Saved {formatSavedAt(seed.attempt.lastSavedAt)}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {autosaveState === "saving"
                  ? "Saving latest checkpoint work now."
                  : autosaveState === "error"
                    ? "Autosave is temporarily stuck. Keep working and try again shortly."
                    : autosaveState === "saved"
                      ? "Latest answers, notes, and timer state are saved."
                      : "Checkpoint state is ready for resume."}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{completion}% complete</p>
              <p className="mt-1 text-sm text-stone-600">
                {answeredCount} of {seed.questions.length} checkpoint answers drafted
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
                  const defaultDurationKey = Object.keys(seedCache[item.assessmentId] ?? {})[0] ?? "";

                  return (
                    <button
                      key={item.assessmentId}
                      type="button"
                      onClick={() => resetSeed(item.assessmentId, defaultDurationKey)}
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
                  const durationKey = String(duration);
                  const isSelected = selectedDurationKey === durationKey;

                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => resetSeed(assessment.assessmentId, durationKey)}
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
                Presets still come from the timed assessment service, so the UI never bypasses the
                official duration rule.
              </p>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Session facts
                </h2>
                <span className={`text-sm font-semibold ${timerAlertTone}`}>
                  {formatCountdown(timeRemainingSeconds)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-stone-600">
                <p>{assessment.title} keeps the chosen duration within the official assessment cap.</p>
                <p>Adjusted duration still comes through the access-arrangements layer.</p>
              </div>
              <div className="border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
                {timeRemainingSeconds === 0
                  ? "Time has expired. This checkpoint is being submitted automatically."
                  : timeRemainingSeconds <= 300
                    ? "Less than five minutes remain in this checkpoint."
                    : timeRemainingSeconds <= 900
                      ? "Final fifteen minutes: clear the bookmarked items if you can."
                      : `Official cap: ${formatTimer(assessment.officialDurationMinutes)}.`}
              </div>
            </section>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
              <span className="border border-stone-300 bg-white px-2 py-1">{assessment.subject}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">{assessment.examBoard}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                Question {currentQuestion.number} of {seed.questions.length}
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

            {viewMode === "question" ? (
              <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      {currentQuestion.topic}
                    </p>
                    <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentSelectedOptionId === option.optionId;

                    return (
                      <button
                        key={option.optionId}
                        type="button"
                        onClick={() => handleSelectOption(option.optionId)}
                        className={`flex w-full items-start gap-3 border px-4 py-4 text-left transition ${
                          isSelected
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-stone-200 bg-white text-stone-900 hover:bg-stone-50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center border text-sm font-semibold ${
                            isSelected
                              ? "border-white/40 bg-white/10 text-white"
                              : "border-stone-300 bg-stone-50 text-stone-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-sm leading-6 sm:text-base">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {currentQuestion.guidance ? (
                  <div className="border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                    {currentQuestion.guidance}
                  </div>
                ) : null}

                <div className="space-y-3 border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                        Working notes
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        Autosaved scratch space for quick reasoning, evidence, or reminders.
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {seed.notes[currentQuestion.questionId]?.trim() ? "Saved" : "Empty"}
                    </span>
                  </div>
                  <textarea
                    value={seed.notes[currentQuestion.questionId] ?? ""}
                    onChange={(event) => handleNotesChange(event.target.value)}
                    rows={4}
                    className="w-full border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-emerald-700"
                    placeholder="Capture quick reasoning, quotation choices, or checks here."
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleToggleBookmark}
                      className={`border px-4 py-2 text-sm font-medium transition ${
                        seed.bookmarkedQuestionIds.includes(currentQuestion.questionId)
                          ? "border-amber-400 bg-amber-100 text-amber-900"
                          : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {seed.bookmarkedQuestionIds.includes(currentQuestion.questionId)
                        ? "Bookmarked"
                        : "Bookmark question"}
                    </button>
                    <div className="border border-stone-300 bg-stone-50 px-4 py-2 text-sm text-stone-700">
                      Autosave updates every interaction
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => moveQuestion(-1)}
                      disabled={currentQuestionIndex === 0}
                      className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestion(1)}
                      disabled={currentQuestionIndex === seed.questions.length - 1}
                      className="bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                    >
                      Next question
                    </button>
                  </div>
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
                      Check answers, bookmarks, and notes before submitting this attempt.
                    </h2>
                  </div>
                  <div className="grid gap-2 text-sm text-stone-700">
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {answeredCount}/{seed.questions.length} answered
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {seed.bookmarkedQuestionIds.length} bookmarked
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {noteCount} notes saved
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {seed.questions.map((question, index) => {
                    const selectedOptionId = getSelectedOptionId(seed, question.questionId);
                    const hasNotes = Boolean(seed.notes[question.questionId]?.trim());
                    const bookmarked = seed.bookmarkedQuestionIds.includes(question.questionId);

                    return (
                      <button
                        key={question.questionId}
                        type="button"
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          updateSeed((previous) => ({
                            ...previous,
                            currentQuestionId: question.questionId,
                          }));
                          setViewMode("question");
                        }}
                        className="border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-stone-300 hover:bg-white"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                              Question {question.number}
                            </p>
                            <h3 className="mt-2 text-base font-semibold text-stone-950">
                              {question.topic}
                            </h3>
                          </div>
                          <span
                            className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                              selectedOptionId
                                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                : "border-rose-300 bg-rose-50 text-rose-900"
                            }`}
                          >
                            {selectedOptionId ? "answered" : "needs answer"}
                          </span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-stone-700">
                          <p>{bookmarked ? "Bookmarked for review" : "Not bookmarked"}</p>
                          <p>{hasNotes ? "Working note saved" : "No working note saved"}</p>
                          <p>{selectedOptionId ? `Selected option ${selectedOptionId.toUpperCase()}` : "No answer selected yet"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-stone-600">
                    <p>{seed.questions.length - answeredCount} unanswered questions remain.</p>
                    <p>Submission moves this checkpoint into the same saved review flow used by the results route.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode("question")}
                      className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                      Back to questions
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
                    Results and Power Grid can now treat this checkpoint as finished work instead of a live session.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {answeredCount}/{seed.questions.length}
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
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{noteCount}</p>
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Active support snapshot
                </h2>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {supportSnapshot?.activeAccessArrangements.length
                    ? `${supportSnapshot.activeAccessArrangements.length} active`
                    : "preferences ready"}
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-600">
                This checkpoint now shows the saved support profile that is travelling with the live
                attempt, so timing and accessibility settings are visible inside the active route.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Timing</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {formatTimer(seed.attempt.adjustedDurationMinutes)}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {extraTimePercentage
                      ? `${extraTimePercentage}% extra time applied`
                      : "Manual duration unchanged"}
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Profile defaults</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {supportSnapshot ? `${supportSnapshot.preferredFontSize}px / ${supportSnapshot.preferredReadingSpeed.toFixed(1)}x` : "Waiting for profile"}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {supportSnapshot
                      ? `${formatColourSchemeLabel(supportSnapshot.preferredColourScheme)} theme`
                      : "Support preferences will appear here when attached to the attempt."}
                  </p>
                </div>
              </div>
              {supportPreferenceChips.length ? (
                <div className="flex flex-wrap gap-2">
                  {supportPreferenceChips.map((chip) => (
                    <span
                      key={chip}
                      className="border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Read aloud
                </h2>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {readAloudSource}
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-600">
                {readAloudEnabled
                  ? "This checkpoint can read the current question aloud through the access-arrangements layer."
                  : "Read aloud preview is available here even before formal support is switched on."}
              </p>
              <p className="text-sm leading-6 text-stone-600">
                Saved profile default: {supportSnapshot?.preferredReadingSpeed.toFixed(1) ?? readAloudSession.speed.toFixed(1)}x.
                This panel can temporarily preview a different speed without changing the stored support profile.
              </p>
              <label className="space-y-2">
                <span className="text-sm font-medium text-stone-700">Voice</span>
                <select
                  value={voiceId}
                  onChange={(event) => setVoiceId(event.target.value)}
                  className="w-full border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
                >
                  {readAloudSession.availableVoices.map((voice) => (
                    <option key={voice.voiceId} value={voice.voiceId}>
                      {voice.label} ({voice.language})
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-stone-700">Speed</span>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.1"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-stone-600">{speed.toFixed(1)}x</p>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleReadAloudAction("playing")}
                  className="border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-medium text-white"
                >
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => handleReadAloudAction("paused")}
                  className="border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => handleReadAloudAction("idle")}
                  className="border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700"
                >
                  Stop
                </button>
              </div>
              <p className="text-sm text-stone-600 capitalize">{previewState}</p>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Checkpoint signals
              </h2>
              <div className="space-y-2 text-sm text-stone-600">
                <p>Selected answers: {answeredCount}</p>
                <p>Notes captured: {noteCount}</p>
                <p>Bookmarks: {seed.bookmarkedQuestionIds.length}</p>
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
                <li>Saved progress is now a live timed-checkpoint capability, not just a summary card.</li>
                <li>Read aloud can sit inside an active checkpoint without moving its rules into the page.</li>
              </ul>
            </section>
          </aside>
        </section>
    </div>
  );
}
