"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildAccessibilityPreferenceChips, formatColourSchemeLabel } from "@/modules/accessibility/presentation";
import type { ExamPaper, ExamQuestion, ExamQuestionResponse, ExamSession } from "@/modules/exam-engine/types";
import type { ReadAloudSession } from "@/modules/read-aloud/types";

interface ExamExperienceProps {
  papers: ExamPaper[];
  sessionSeeds: Record<string, ExamSession>;
  readAloudSession: ReadAloudSession;
  initialExamId?: string;
  initialQuestionId?: string;
}

function cloneSession(session: ExamSession): ExamSession {
  return {
    ...session,
    questions: session.questions.map((question) => ({
      ...question,
      options: question.options?.map((option) => ({ ...option })),
    })),
    questionResponses: session.questionResponses.map((response) => ({ ...response })),
    generationSummary: {
      ...session.generationSummary,
      questionSourceKeys: [...session.generationSummary.questionSourceKeys],
    },
  };
}

function formatTimer(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours}h ${minutes.toString().padStart(2, "0")}m`
    : `${minutes}m`;
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

function getPaperModeLabel(mode: ExamPaper["paperMode"]): string {
  if (mode === "year-10-end-of-year") {
    return "Year 10 end-of-year";
  }

  if (mode === "year-10-gcse-bridge") {
    return "Year 10 GCSE bridge";
  }

  if (mode === "year-11-mock") {
    return "Year 11 mock";
  }

  if (mode === "igcse-full-course") {
    return "Full iGCSE";
  }

  return "Full GCSE";
}

function getStudentStageLabel(stage: ExamPaper["studentStage"]): string {
  if (stage === "year-10") {
    return "Year 10";
  }

  if (stage === "year-11") {
    return "Year 11";
  }

  return "GCSE";
}

function getResponseStatusTone(response: ExamQuestionResponse): string {
  if (response.selectedOptionId) {
    return "border-emerald-300 bg-emerald-50 text-emerald-900";
  }

  if (response.flagged) {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  if (response.status === "in-progress") {
    return "border-sky-300 bg-sky-50 text-sky-900";
  }

  return "border-stone-200 bg-white text-stone-700";
}

function buildQuestionReadAloudText(questions: ExamQuestion[], currentQuestionIndex: number): string {
  const question = questions[currentQuestionIndex];

  if (!question) {
    return "";
  }

  const optionText = question.options?.length
    ? ` Options. ${question.options
        .map((option) => `${option.label}. ${option.text}`)
        .join(" ")}`
    : "";
  const guidanceText = question.guidance ? ` Guidance. ${question.guidance}` : "";

  return `Question ${question.number} of ${questions.length}. ${question.prompt}${optionText}${guidanceText}`;
}

function getInitialQuestionIndex(
  session: ExamSession | undefined,
  initialQuestionId?: string,
): number {
  if (!session) {
    return 0;
  }

  if (initialQuestionId) {
    const explicitIndex = session.questions.findIndex(
      (question) => question.questionId === initialQuestionId,
    );

    if (explicitIndex >= 0) {
      return explicitIndex;
    }
  }

  const firstActiveIndex = session.questionResponses.findIndex(
    (response) => response.status !== "not-started" || response.selectedOptionId,
  );

  return firstActiveIndex >= 0 ? firstActiveIndex : 0;
}

function getCurrentQuestionId(session: ExamSession | undefined): string {
  if (!session) {
    return "";
  }

  const firstActiveResponse = session.questionResponses.find(
    (response) => response.status !== "not-started" || response.selectedOptionId,
  );

  return firstActiveResponse?.questionId ?? session.questionResponses[0]?.questionId ?? "";
}

function buildAutosaveSignature(session: ExamSession, currentQuestionId: string): string {
  return JSON.stringify({
    examSessionId: session.examSessionId,
    status: session.status,
    currentQuestionId,
    timeRemainingMinutes: session.timeRemainingMinutes,
    questionResponses: session.questionResponses,
  });
}

function ExamClientRecoveryState({
  title,
  description,
  selectedExamTitle,
}: {
  title: string;
  description: string;
  selectedExamTitle?: string;
}) {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            Exam Session Recovery
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
            {description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Selected paper</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {selectedExamTitle ?? "The requested paper could not be prepared safely."}
              </p>
            </div>
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Safest next step</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Open saved progress to recover the latest known-good session state instead of forcing a broken paper view.
              </p>
            </div>
            <div className="border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Why this matters</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                This route now fails safely when question or response data is incomplete, rather than hiding the issue behind a blank screen.
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
              href="/results"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
            >
              Open results
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
            >
              Return to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export function ExamExperience({
  papers,
  sessionSeeds,
  readAloudSession,
  initialExamId,
  initialQuestionId,
}: ExamExperienceProps) {
  const initialSessionCache: Record<string, ExamSession> = Object.fromEntries(
    Object.entries(sessionSeeds).map(([examId, session]) => [examId, cloneSession(session)]),
  );
  const startingExamId =
    (initialExamId && sessionSeeds[initialExamId] ? initialExamId : undefined) ??
    papers[0]?.examId ??
    "";
  const fallbackSession = sessionSeeds[startingExamId] ?? Object.values(sessionSeeds)[0];
  const [selectedExamId, setSelectedExamId] = useState(startingExamId);
  const [sessionCache, setSessionCache] = useState<Record<string, ExamSession>>(initialSessionCache);
  const [session, setSession] = useState<ExamSession>(() =>
    cloneSession(initialSessionCache[startingExamId] ?? fallbackSession),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() =>
    getInitialQuestionIndex(initialSessionCache[startingExamId] ?? fallbackSession, initialQuestionId),
  );
  const [voiceId, setVoiceId] = useState(readAloudSession.selectedVoiceId);
  const [speed, setSpeed] = useState(readAloudSession.speed);
  const [previewState, setPreviewState] = useState<"idle" | "playing" | "paused">("idle");
  const [viewMode, setViewMode] = useState<"question" | "review" | "submitted">(
    initialSessionCache[startingExamId]?.status === "submitted" ? "submitted" : "question",
  );
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [freshAttemptState, setFreshAttemptState] = useState<"idle" | "starting" | "error">("idle");
  const [autosaveState, setAutosaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    () => (initialSessionCache[startingExamId] ?? fallbackSession).timeRemainingMinutes * 60,
  );
  const autoSubmitTriggeredRef = useRef(false);
  const autosaveSignatureRef = useRef(
    buildAutosaveSignature(
      initialSessionCache[startingExamId] ?? fallbackSession,
      getCurrentQuestionId(initialSessionCache[startingExamId] ?? fallbackSession),
    ),
  );

  const paper = useMemo(
    () => papers.find((item) => item.examId === selectedExamId) ?? papers[0],
    [papers, selectedExamId],
  );
  const sessionQuestions = session.questions;
  const currentQuestion = sessionQuestions[currentQuestionIndex] ?? sessionQuestions[0];
  const currentResponse =
    session.questionResponses.find(
      (response) => response.questionId === currentQuestion?.questionId,
    ) ?? session.questionResponses[0];

  const answeredCount = session.questionResponses.filter((response) => response.selectedOptionId).length;
  const flaggedCount = session.questionResponses.filter((response) => response.flagged).length;
  const completion = Math.round((answeredCount / Math.max(sessionQuestions.length, 1)) * 100);
  const readAloudEnabled =
    session.accessArrangements?.accessArrangementApplication.readAloud.enabled ??
    readAloudSession.accessArrangementConfig?.enabled ??
    false;
  const readAloudSource =
    session.accessArrangements?.accessArrangementApplication.readAloud.source ??
    readAloudSession.accessArrangementConfig?.source ??
    "disabled";
  const currentReadAloudText = buildQuestionReadAloudText(sessionQuestions, currentQuestionIndex);
  const unansweredCount = sessionQuestions.length - answeredCount;
  const noteCount = session.questionResponses.filter((response) => response.workingNotes?.trim()).length;
  const supportSnapshot = session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot;
  const supportPreferenceChips = buildAccessibilityPreferenceChips(supportSnapshot);
  const adjustedDuration =
    session.accessArrangements?.accessArrangementApplication.duration.adjustedDurationMinutes ??
    session.durationMinutes;
  const extraTimePercentage =
    session.accessArrangements?.accessArrangementApplication.duration.extraTimePercentage ?? 0;
  const timerAlertTone =
    timeRemainingSeconds <= 300
      ? "text-rose-700"
      : timeRemainingSeconds <= 900
        ? "text-amber-700"
        : "text-stone-950";

  useEffect(() => {
    setTimeRemainingSeconds(session.timeRemainingMinutes * 60);
    autoSubmitTriggeredRef.current = session.status === "submitted";
  }, [session.examSessionId, session.status, session.timeRemainingMinutes]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPreviewState("idle");
  }, [selectedExamId, currentQuestionIndex]);

  useEffect(() => {
    if (session.status === "submitted") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemainingSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [session.examSessionId, session.status]);

  useEffect(() => {
    if (session.status === "submitted") {
      return;
    }

    const nextTimeRemainingMinutes = Math.ceil(timeRemainingSeconds / 60);

    if (nextTimeRemainingMinutes === session.timeRemainingMinutes) {
      return;
    }

    setSession((previous) => {
      const nextSession = {
        ...previous,
        lastSavedAt: new Date().toISOString(),
        timeRemainingMinutes: nextTimeRemainingMinutes,
      };

      setSessionCache((cache) => ({
        ...cache,
        [previous.examId]: nextSession,
      }));

      return nextSession;
    });
  }, [session.status, session.timeRemainingMinutes, timeRemainingSeconds]);

  useEffect(() => {
    if (session.status === "submitted" || !currentQuestion) {
      autosaveSignatureRef.current = buildAutosaveSignature(
        session,
        currentQuestion?.questionId ?? "",
      );
      setAutosaveState("idle");
      return;
    }

    const nextSignature = buildAutosaveSignature(session, currentQuestion.questionId);

    if (nextSignature === autosaveSignatureRef.current) {
      return;
    }

    setAutosaveState("saving");

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/exams/session/${encodeURIComponent(selectedExamId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examSessionId: session.examSessionId,
            currentQuestionId: currentQuestion.questionId,
            questionResponses: session.questionResponses,
            timeRemainingMinutes: session.timeRemainingMinutes,
          }),
        });

        if (!response.ok) {
          throw new Error("Exam autosave request failed.");
        }

        autosaveSignatureRef.current = nextSignature;
        setAutosaveState("saved");
      } catch {
        setAutosaveState("error");
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [
    currentQuestion,
    selectedExamId,
    session,
  ]);

  useEffect(() => {
    if (
      timeRemainingSeconds > 0 ||
      session.status === "submitted" ||
      submitState === "submitting" ||
      autoSubmitTriggeredRef.current
    ) {
      return;
    }

    autoSubmitTriggeredRef.current = true;
    void handleSubmitExam();
  }, [session.status, submitState, timeRemainingSeconds]);

  const resetSession = (examId: string) => {
    const nextSession = cloneSession(sessionCache[examId] ?? sessionSeeds[examId] ?? fallbackSession);

    setSelectedExamId(examId);
    setSession(nextSession);
    setViewMode(nextSession.status === "submitted" ? "submitted" : "question");
    setSubmitState("idle");
    setFreshAttemptState("idle");
    setAutosaveState("idle");
    setTimeRemainingSeconds(nextSession.timeRemainingMinutes * 60);
    setCurrentQuestionIndex(getInitialQuestionIndex(nextSession));
    autosaveSignatureRef.current = buildAutosaveSignature(nextSession, getCurrentQuestionId(nextSession));
    autoSubmitTriggeredRef.current = nextSession.status === "submitted";
  };

  const syncSession = (
    nextSession: ExamSession,
    options?: {
      nextViewMode?: "question" | "review" | "submitted";
      nextQuestionId?: string;
    },
  ) => {
    const clonedSession = cloneSession(nextSession);

    setSessionCache((previous) => ({
      ...previous,
      [nextSession.examId]: clonedSession,
    }));
    setSession(clonedSession);
    setSelectedExamId(nextSession.examId);
    setViewMode(options?.nextViewMode ?? (clonedSession.status === "submitted" ? "submitted" : "question"));
    setCurrentQuestionIndex(getInitialQuestionIndex(clonedSession, options?.nextQuestionId));
    setAutosaveState("idle");
    autosaveSignatureRef.current = buildAutosaveSignature(
      clonedSession,
      options?.nextQuestionId ?? getCurrentQuestionId(clonedSession),
    );
  };

  const updateResponse = (
    questionId: string,
    updater: (response: ExamQuestionResponse) => ExamQuestionResponse,
  ) => {
    setSession((previous) => {
      const nextSession = {
        ...previous,
        lastSavedAt: new Date().toISOString(),
        questionResponses: previous.questionResponses.map((response) =>
          response.questionId === questionId ? updater(response) : response,
        ),
      };

      setSessionCache((cache) => ({
        ...cache,
        [previous.examId]: nextSession,
      }));

      return nextSession;
    });
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) {
      return;
    }

    updateResponse(currentQuestion.questionId, (response) => ({
      ...response,
      selectedOptionId: optionId,
      status: "answered",
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) {
      return;
    }

    updateResponse(currentQuestion.questionId, (response) => ({
      ...response,
      flagged: !response.flagged,
      status: response.selectedOptionId ? "answered" : "in-progress",
    }));
  };

  const handleWorkingNotesChange = (notes: string) => {
    if (!currentQuestion) {
      return;
    }

    updateResponse(currentQuestion.questionId, (response) => ({
      ...response,
      workingNotes: notes,
      status: response.selectedOptionId ? "answered" : "in-progress",
    }));
  };

  const moveQuestion = (direction: -1 | 1) => {
    setCurrentQuestionIndex((previous) => {
      const nextIndex = previous + direction;

      if (nextIndex < 0 || nextIndex >= sessionQuestions.length) {
        return previous;
      }

      return nextIndex;
    });
  };

  const handleSubmitExam = async () => {
    if (!currentQuestion) {
      setSubmitState("error");
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPreviewState("idle");
    setSubmitState("submitting");

    try {
      const response = await fetch(`/api/exams/session/${encodeURIComponent(selectedExamId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examSessionId: session.examSessionId,
          currentQuestionId: currentQuestion.questionId,
          questionResponses: session.questionResponses,
          timeRemainingMinutes: session.timeRemainingMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error("Exam submission request failed.");
      }

      const nextSession = {
        ...session,
        status: "submitted" as const,
        lastSavedAt: new Date().toISOString(),
      };

      syncSession(nextSession, { nextViewMode: "submitted" });
      setSubmitState("idle");
    } catch {
      setSubmitState("error");
    }
  };

  const handleStartFreshAttempt = async () => {
    setFreshAttemptState("starting");

    try {
      const response = await fetch(`/api/exams/session/${encodeURIComponent(selectedExamId)}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Fresh exam attempt request failed.");
      }

      const payload = (await response.json()) as { session: ExamSession };

      syncSession(payload.session, { nextViewMode: "question" });
      setFreshAttemptState("idle");
      setSubmitState("idle");
    } catch {
      setFreshAttemptState("error");
    }
  };

  const handleReadAloudAction = (nextState: "playing" | "paused" | "idle") => {
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
  };

  if (!paper || !currentQuestion || !currentResponse) {
    return (
      <ExamClientRecoveryState
        title="This exam session is missing part of its live question state."
        description="The exam route loaded, but the current paper, question, or saved response data is incomplete. The safest recovery is to step back into a stable saved-progress or results path instead of showing a partially broken exam view."
        selectedExamTitle={paper?.title}
      />
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Exam Engine Preview
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Exam session UI with Year 10 progression papers, full GCSE papers, timing, autosave, and progress flow.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This now keeps learning repetition at topic level while rotating question variants
                between attempts so papers feel fresher for active students while still showing a
                clear bridge from Year 10 end-of-year work into GCSE-style papers.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Current paper</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{paper.title}</p>
              <p className="mt-1 text-sm text-stone-600">
                {paper.board} {paper.paperName} • {paper.qualificationType} • attempt {session.attemptNumber}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Autosave</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                Saved {formatSavedAt(session.lastSavedAt)}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {autosaveState === "saving"
                  ? "Saving latest changes now."
                  : autosaveState === "error"
                    ? "Autosave is temporarily stuck. Keep working and try again shortly."
                    : autosaveState === "saved"
                      ? "Latest question mix and responses are saved with this session."
                      : "Generated question mix is stored with the session."}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Progression path</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {getStudentStageLabel(paper.studentStage)} • {getPaperModeLabel(paper.paperMode)}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {paper.gcsePreparationSummary}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{completion}% complete</p>
              <p className="mt-1 text-sm text-stone-600">
                {answeredCount} of {sessionQuestions.length} questions answered
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Mock papers
                </h2>
              </div>
              <div className="divide-y divide-stone-200">
                {papers.map((item) => {
                  const isSelected = item.examId === paper.examId;

                  return (
                    <button
                      key={item.examId}
                      type="button"
                      onClick={() => resetSession(item.examId)}
                      className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                        isSelected
                          ? "bg-teal-700 text-white"
                          : "bg-white text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">{item.subject}</span>
                        <span
                          className={`text-xs uppercase tracking-[0.2em] ${
                            isSelected ? "text-teal-100" : "text-stone-500"
                          }`}
                        >
                          {item.board}
                        </span>
                      </div>
                      <p className={`text-sm ${isSelected ? "text-teal-50" : "text-stone-600"}`}>
                        {item.paperName} • {item.durationMinutes} mins • {item.totalMarks} marks
                      </p>
                      <p className={`text-xs ${isSelected ? "text-teal-100" : "text-stone-500"}`}>
                        {getStudentStageLabel(item.studentStage)} • {getPaperModeLabel(item.paperMode)}
                      </p>
                    </button>
                  );
                })}
              </div>
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
                <p>{paper.year} exam paper preview with a generated question mix for this attempt.</p>
                <p>{paper.studentContextSummary}</p>
                <p>{paper.boardTopicCoverage}</p>
              </div>
              <div className="border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
                {timeRemainingSeconds === 0
                  ? "Time has expired. This attempt is being submitted automatically."
                  : timeRemainingSeconds <= 300
                    ? "Less than five minutes remain in this paper."
                    : timeRemainingSeconds <= 900
                      ? "Final fifteen minutes: wrap up any unanswered questions."
                      : paper.paperMode === "full-gcse"
                        ? `Official GCSE duration: ${formatTimer(session.durationMinutes)}.`
                        : `Year 10 progression duration: ${formatTimer(session.durationMinutes)}.`}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {paper.skillsFocus.map((skill) => (
                  <span
                    key={skill}
                    className="border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
                Freshness rule: {session.generationSummary.reusedQuestionCount} reused exact question
                {session.generationSummary.reusedQuestionCount === 1 ? "" : "s"} from earlier saved attempts.
              </div>
              <div className="border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
                GCSE bridge: {paper.gcsePreparationSummary}
              </div>
              <div className="border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
                Access support: {paper.accessSupportLevel === "send-ready-foundation"
                  ? "Uses the shared access-arrangements layer and is ready for SEND-support expansion."
                  : "Uses the core access-arrangements layer."}
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Active support snapshot
                </h2>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {supportSnapshot?.activeAccessArrangements.length
                    ? `${supportSnapshot.activeAccessArrangements.length} active`
                    : "preferences ready"}
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-600">
                This exam is carrying the shared support profile through timing, read aloud, and
                saved progress so the session matches what the student set elsewhere in the product.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Timing</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {formatTimer(adjustedDuration)}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {extraTimePercentage
                      ? `${extraTimePercentage}% extra time applied`
                      : "Official duration unchanged"}
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
                      : "Support preferences will appear here when attached to the session."}
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
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  {readAloudSource}
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-600">
                {readAloudEnabled
                  ? "Current exam support allows question read aloud through the access arrangement layer."
                  : "Read aloud preview is visible here, even before formal support is switched on."}
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
                  className="border border-teal-700 bg-teal-700 px-3 py-2 text-sm font-medium text-white"
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
          </aside>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
              <span className="border border-stone-300 bg-white px-2 py-1">{paper.subject}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">{paper.qualificationType}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">{paper.tier}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                {getPaperModeLabel(paper.paperMode)}
              </span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                {paper.yearGroups.join(" / ")}
              </span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                Question {currentQuestion.number} of {sessionQuestions.length}
              </span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                Attempt {session.attemptNumber}
              </span>
              <button
                type="button"
                onClick={() => setViewMode("review")}
                disabled={session.status === "submitted"}
                className="border border-stone-300 bg-white px-2 py-1 text-stone-700 transition hover:bg-stone-50"
              >
                Review screen
              </button>
            </div>

            {viewMode === "question" ? (
              <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                      {currentQuestion.topic}
                    </p>
                    <p className="text-sm leading-6 text-stone-600">{paper.studentContextSummary}</p>
                    <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                  <div className="flex gap-2 text-sm text-stone-600">
                    <span className="border border-stone-300 bg-stone-50 px-3 py-2">
                      {currentQuestion.marks} marks
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = currentResponse.selectedOptionId === option.optionId;

                    return (
                      <button
                        key={option.optionId}
                        type="button"
                        onClick={() => handleSelectOption(option.optionId)}
                        className={`flex w-full items-start gap-3 border px-4 py-4 text-left transition ${
                          isSelected
                            ? "border-teal-700 bg-teal-700 text-white"
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
                        Autosaved scratch space for steps, reminders, or evidence before moving on.
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {currentResponse.workingNotes?.trim().length ? "Saved" : "Empty"}
                    </span>
                  </div>
                  <textarea
                    value={currentResponse.workingNotes ?? ""}
                    onChange={(event) => handleWorkingNotesChange(event.target.value)}
                    rows={5}
                    className="w-full border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-teal-700"
                    placeholder="Capture working, key quotations, unit conversions, or quick reminders here."
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleToggleFlag}
                      className={`border px-4 py-2 text-sm font-medium transition ${
                        currentResponse.flagged
                          ? "border-amber-400 bg-amber-100 text-amber-900"
                          : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {currentResponse.flagged ? "Flagged for review" : "Flag question"}
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
                      disabled={currentQuestionIndex === sessionQuestions.length - 1}
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
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                      End of session review
                    </p>
                    <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                      Check answers, flagged questions, and working notes before submission.
                    </h2>
                    <p className="text-sm leading-6 text-stone-600">
                      Topic coverage stays familiar, but the exact question wording can rotate
                      across attempts so Year 10 progression and GCSE practice stay useful without
                      turning stale.
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-stone-700">
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {answeredCount}/{sessionQuestions.length} answered
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {flaggedCount} flagged
                    </div>
                    <div className="border border-stone-200 bg-stone-50 px-3 py-2">
                      {noteCount} working notes saved
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {sessionQuestions.map((question, index) => {
                    const response = session.questionResponses.find(
                      (item) => item.questionId === question.questionId,
                    );
                    const isAnswered = Boolean(response?.selectedOptionId);
                    const hasNotes = Boolean(response?.workingNotes?.trim());

                    return (
                      <button
                        key={question.questionId}
                        type="button"
                        onClick={() => {
                          setCurrentQuestionIndex(index);
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
                              isAnswered
                                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                : "border-rose-300 bg-rose-50 text-rose-900"
                            }`}
                          >
                            {isAnswered ? "answered" : "needs answer"}
                          </span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-stone-700">
                          <p>{response?.flagged ? "Flagged for review" : "Not flagged"}</p>
                          <p>{hasNotes ? "Working note saved" : "No working note saved"}</p>
                          <p>
                            {isAnswered
                              ? `Selected option ${response?.selectedOptionId?.toUpperCase()}`
                              : "No answer selected yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-stone-600">
                    <p>{unansweredCount} unanswered questions still need attention.</p>
                    <p>
                      Submission closes this attempt, while the next attempt can rotate a fresher
                      mix of questions from the same exam skills.
                    </p>
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
                      onClick={handleSubmitExam}
                      disabled={submitState === "submitting"}
                      className="border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
                    >
                      {submitState === "submitting" ? "Submitting..." : "Submit paper"}
                    </button>
                  </div>
                </div>
                {submitState === "error" ? (
                  <p className="text-sm text-rose-700">
                    The exam could not be submitted just yet. Try again.
                  </p>
                ) : null}
              </article>
            ) : null}

            {viewMode === "submitted" ? (
              <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
                <div className="space-y-3 border-b border-stone-200 pb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Exam submitted
                  </p>
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950">
                    This attempt is finished and ready for review or a fresh paper mix.
                  </h2>
                  <p className="text-sm leading-6 text-stone-600">
                    Results can now review this attempt, and the student can deliberately start a new
                    attempt with different question instances from the same topic coverage.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Answered</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {answeredCount}/{sessionQuestions.length}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Flagged</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{flaggedCount}</p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Working notes</p>
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
                  <button
                    type="button"
                    onClick={handleStartFreshAttempt}
                    disabled={freshAttemptState === "starting"}
                    className="border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
                  >
                    {freshAttemptState === "starting" ? "Starting..." : "Start fresh attempt"}
                  </button>
                  <a
                    href="/results"
                    className="inline-flex items-center justify-center border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                  >
                    Open results route
                  </a>
                </div>
                {freshAttemptState === "error" ? (
                  <p className="text-sm text-rose-700">
                    A fresh attempt could not be created just yet. Try again.
                  </p>
                ) : null}
              </article>
            ) : null}
          </section>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Progress map
                </h2>
                <span className="text-sm text-stone-600">{flaggedCount} flagged</span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {sessionQuestions.map((question, index) => {
                  const response = session.questionResponses.find(
                    (item) => item.questionId === question.questionId,
                  );

                  if (!response) {
                    return null;
                  }

                  return (
                    <button
                      key={question.questionId}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`border px-0 py-3 text-sm font-semibold transition ${getResponseStatusTone(
                        response,
                      )} ${
                        index === currentQuestionIndex ? "ring-2 ring-stone-950 ring-offset-1" : ""
                      }`}
                    >
                      {question.number}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Saved exam signals
              </h2>
              <div className="space-y-2 text-sm text-stone-600">
                <p>Working notes saved: {noteCount}</p>
                <p>
                  Answered questions: {answeredCount} of {sessionQuestions.length}
                </p>
                <p>Questions flagged: {flaggedCount}</p>
                <p>Exact question reuse in history: {session.generationSummary.reusedQuestionCount}</p>
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this UI proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>One exam blueprint can produce multiple fresh attempts without losing topic repetition.</li>
                <li>Generated question sets can live in the service layer and travel through autosave.</li>
                <li>Results and review can stay aligned with the exact paper mix the student actually saw.</li>
                <li>Working notes can travel with an exam session through saved progress.</li>
                <li>Read aloud can sit alongside exam mode through a separate support module.</li>
                <li>Access arrangements can later change timing without rebuilding the page.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
