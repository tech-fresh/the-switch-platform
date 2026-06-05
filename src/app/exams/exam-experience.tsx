"use client";

import { useMemo, useState } from "react";
import type { ExamPaper, ExamQuestionResponse, ExamSession } from "@/modules/exam-engine/types";

interface ExamExperienceProps {
  papers: ExamPaper[];
  sessionSeeds: Record<string, ExamSession>;
}

function cloneSession(session: ExamSession): ExamSession {
  return {
    ...session,
    questionResponses: session.questionResponses.map((response) => ({ ...response })),
  };
}

function formatTimer(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours}h ${minutes.toString().padStart(2, "0")}m`
    : `${minutes}m`;
}

function formatSavedAt(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
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

export function ExamExperience({ papers, sessionSeeds }: ExamExperienceProps) {
  const [selectedExamId, setSelectedExamId] = useState(papers[0]?.examId ?? "");
  const [session, setSession] = useState<ExamSession>(() =>
    cloneSession(sessionSeeds[papers[0]?.examId ?? ""]),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const firstPaper = papers[0];
    const firstResponse = sessionSeeds[firstPaper?.examId ?? ""]?.questionResponses.findIndex(
      (response) => response.status !== "not-started" || response.selectedOptionId,
    );

    return firstResponse && firstResponse >= 0 ? firstResponse : 0;
  });

  const paper = useMemo(
    () => papers.find((item) => item.examId === selectedExamId) ?? papers[0],
    [papers, selectedExamId],
  );

  const currentQuestion = paper.questions[currentQuestionIndex];
  const currentResponse =
    session.questionResponses.find(
      (response) => response.questionId === currentQuestion.questionId,
    ) ?? session.questionResponses[0];

  const answeredCount = session.questionResponses.filter(
    (response) => response.selectedOptionId,
  ).length;
  const flaggedCount = session.questionResponses.filter((response) => response.flagged).length;
  const completion = Math.round((answeredCount / paper.questions.length) * 100);

  const resetSession = (examId: string) => {
    setSelectedExamId(examId);
    setSession(cloneSession(sessionSeeds[examId]));

    const firstActiveIndex = sessionSeeds[examId].questionResponses.findIndex(
      (response) => response.status !== "not-started" || response.selectedOptionId,
    );

    setCurrentQuestionIndex(firstActiveIndex >= 0 ? firstActiveIndex : 0);
  };

  const updateResponse = (
    questionId: string,
    updater: (response: ExamQuestionResponse) => ExamQuestionResponse,
  ) => {
    setSession((previous) => ({
      ...previous,
      lastSavedAt: new Date().toISOString(),
      questionResponses: previous.questionResponses.map((response) =>
        response.questionId === questionId ? updater(response) : response,
      ),
    }));
  };

  const handleSelectOption = (optionId: string) => {
    updateResponse(currentQuestion.questionId, (response) => ({
      ...response,
      selectedOptionId: optionId,
      status: "answered",
    }));
  };

  const handleToggleFlag = () => {
    updateResponse(currentQuestion.questionId, (response) => ({
      ...response,
      flagged: !response.flagged,
      status: response.selectedOptionId ? "answered" : "in-progress",
    }));
  };

  const moveQuestion = (direction: -1 | 1) => {
    setCurrentQuestionIndex((previous) => {
      const nextIndex = previous + direction;

      if (nextIndex < 0 || nextIndex >= paper.questions.length) {
        return previous;
      }

      return nextIndex;
    });
  };

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
                Initial exam session UI with mock GCSE papers, timing, autosave, and progress flow.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This is the first product-shaped slice of the engine. It shows how a student can
                open a paper, answer questions, move through the session, and see saved progress
                before we wire in real APIs.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Current paper</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{paper.title}</p>
              <p className="mt-1 text-sm text-stone-600">
                {paper.board} {paper.paperName} • {paper.tier.toLowerCase()}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Autosave</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                Saved {formatSavedAt(session.lastSavedAt)}
              </p>
              <p className="mt-1 text-sm text-stone-600">Mock session state updates on each answer.</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Completion</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{completion}% complete</p>
              <p className="mt-1 text-sm text-stone-600">
                {answeredCount} of {paper.questions.length} questions answered
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
                <span className="text-sm font-semibold text-rose-700">
                  {formatTimer(session.timeRemainingMinutes)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-stone-600">
                <p>{paper.year} exam paper preview with mock student progress.</p>
                <p>Official duration is locked to the exam and ready for future access arrangements.</p>
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
            </section>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
              <span className="border border-stone-300 bg-white px-2 py-1">{paper.subject}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">{paper.tier}</span>
              <span className="border border-stone-300 bg-white px-2 py-1">
                Question {currentQuestion.number} of {paper.questions.length}
              </span>
            </div>

            <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                    {currentQuestion.topic}
                  </p>
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
                    disabled={currentQuestionIndex === paper.questions.length - 1}
                    className="bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                  >
                    Next question
                  </button>
                </div>
              </div>
            </article>
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
                {paper.questions.map((question, index) => {
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
                What this UI proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>One exam paper can drive a guided question flow.</li>
                <li>Progress, timing, and flags can live outside the UI surface.</li>
                <li>Autosave and resume state can be shown before the real backend exists.</li>
                <li>Access arrangements can later change timing without rebuilding the page.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
