"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LearningLoopStepRail } from "@/components/learning-loop/learning-loop-step-rail";
import { PremiumExamBoardSelector } from "@/components/premium/premium-exam-board-selector";
import { PremiumQuizCard } from "@/components/premium/premium-quiz-card";
import { premiumUi } from "@/components/premium/premium-ui";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { Mark32SubjectCatalogGrid } from "@/components/streamlined/mark32-subject-catalog-grid";
import type { QuizQuestion, SubmitQuizAnswerResult } from "@/modules/quiz/types";
import type { LearningLoopStage } from "@/modules/learning-loop/types";
import type { RevisionContent } from "@/modules/revision/types";
import type { Subject } from "@/modules/subjects/types";
import type { Topic } from "@/modules/topics/types";
import { prefixPreviewHref } from "@/lib/preview/links";

interface SubjectExperienceProps {
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  revisionByTopic: Record<string, RevisionContent>;
  quizByTopic: Record<string, QuizQuestion>;
  quizAttemptsByTopic: Record<string, SubmitQuizAnswerResult | null>;
  initialSubjectId?: string;
  initialTopicId?: string;
  onboardingSubjectIds?: string[];
  hrefPrefix?: string;
}

function getRevisionSectionBody(
  revision: RevisionContent,
  titles: RevisionContent["sections"][number]["title"][],
): string[] {
  return revision.sections.filter((section) => titles.includes(section.title)).map((section) => section.body);
}

export function SubjectExperience({
  subjects,
  topicsBySubject,
  revisionByTopic,
  quizByTopic,
  quizAttemptsByTopic,
  initialSubjectId,
  initialTopicId,
  onboardingSubjectIds = [],
  hrefPrefix = "",
}: SubjectExperienceProps) {
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <section className="border border-stone-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
              Subjects
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              No reviewed subject topics are published for students right now.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              This route follows the editorial gate, so draft, unreviewed, or unverified topics
              stay hidden until they clear review, source checks, and fact-checking through the
              content workflow.
            </p>
          </section>
      </div>
    );
  }

  const startingSubjectId =
    (initialSubjectId && subjects.some((subject) => subject.subjectId === initialSubjectId)
      ? initialSubjectId
      : undefined) ?? subjects[0]?.subjectId ?? "";
  const [selectedSubjectId, setSelectedSubjectId] = useState(startingSubjectId);
  const selectedSubject =
    subjects.find((subject) => subject.subjectId === selectedSubjectId) ?? subjects[0];
  const topics = topicsBySubject[selectedSubject.subjectId] ?? [];
  const startingTopicId =
    (initialTopicId && topics.some((topic) => topic.topicId === initialTopicId)
      ? initialTopicId
      : undefined) ?? topics[0]?.topicId ?? "";
  const [selectedTopicId, setSelectedTopicId] = useState(startingTopicId);
  const selectedTopic =
    topics.find((topic) => topic.topicId === selectedTopicId) ?? topics[0];
  const revision = revisionByTopic[selectedTopic.topicId];
  const quiz = quizByTopic[selectedTopic.topicId];
  const [selectedQuizOptionByTopic, setSelectedQuizOptionByTopic] = useState<Record<string, string>>({});
  const [quizFeedbackByTopic, setQuizFeedbackByTopic] = useState<Record<string, SubmitQuizAnswerResult | null>>(
    quizAttemptsByTopic,
  );
  const [quizSubmitState, setQuizSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [learningLoopStage, setLearningLoopStage] = useState<LearningLoopStage>("learn");
  const [loopNextAction, setLoopNextAction] = useState<{ label: string; href: string; reason: string } | null>(
    null,
  );
  const learnSections = getRevisionSectionBody(revision, [
    "Explain Simply",
    "Standard Explanation",
    "Detailed Explanation",
  ]);
  const workedExampleSections = getRevisionSectionBody(revision, ["Worked Examples", "Common Mistakes"]);
  const practiceSections = getRevisionSectionBody(revision, ["Practice Questions", "Timed Assessment"]);
  const examSections = getRevisionSectionBody(revision, ["Past Paper Questions", "Mark Scheme", "Exam Technique"]);
  const withPrefix = (href: string) => prefixPreviewHref(href, hrefPrefix);
  const [selectedBoard, setSelectedBoard] = useState<string>(selectedSubject.examBoards[0] ?? "");
  const selectedQuizOptionId =
    selectedQuizOptionByTopic[selectedTopic.topicId] ?? quizFeedbackByTopic[selectedTopic.topicId]?.selectedOptionId ?? "";
  const quizFeedback = quizFeedbackByTopic[selectedTopic.topicId];

  useEffect(() => {
    setSelectedBoard(selectedSubject.examBoards[0] ?? "");
  }, [selectedSubject.subjectId, selectedSubject.examBoards]);

  useEffect(() => {
    setQuizFeedbackByTopic(quizAttemptsByTopic);
  }, [quizAttemptsByTopic]);

  useEffect(() => {
    let cancelled = false;

    async function loadLearningLoopStage() {
      try {
        const response = await fetch(`/api/learning-loop/${encodeURIComponent(selectedTopic.topicId)}`);
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { session: { stage: LearningLoopStage } };
        if (!cancelled) {
          setLearningLoopStage(payload.session.stage);
        }
      } catch {
        if (!cancelled) {
          setLearningLoopStage("learn");
        }
      }
    }

    void loadLearningLoopStage();
    setLoopNextAction(null);

    return () => {
      cancelled = true;
    };
  }, [selectedTopic.topicId]);

  async function refreshLoopNextAction() {
    try {
      const response = await fetch("/api/journey/next-action");
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        journey: { primaryAction: { label: string; href: string; reason: string } };
      };
      setLoopNextAction(payload.journey.primaryAction);
    } catch {
      setLoopNextAction(null);
    }
  }

  async function handleQuizSubmit() {
    if (!selectedQuizOptionId) {
      return;
    }

    setQuizSubmitState("saving");

    try {
      const response = await fetch(`/api/quiz/attempts/${encodeURIComponent(selectedTopic.topicId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedOptionId: selectedQuizOptionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Quiz answer submission failed.");
      }

      const payload = (await response.json()) as { result: SubmitQuizAnswerResult };

      setQuizFeedbackByTopic((current) => ({
        ...current,
        [selectedTopic.topicId]: payload.result,
      }));

      const loopResponse = await fetch(`/api/learning-loop/${encodeURIComponent(selectedTopic.topicId)}`);
      if (loopResponse.ok) {
        const loopPayload = (await loopResponse.json()) as { session: { stage: LearningLoopStage } };
        setLearningLoopStage(loopPayload.session.stage);
      }

      await refreshLoopNextAction();
      setQuizSubmitState("idle");
    } catch {
      setQuizSubmitState("error");
    }
  }

  return (
    <div className="flex flex-col gap-8">
        <Mark32SubjectCatalogGrid
          subjects={subjects}
          selectedSubjectId={selectedSubject.subjectId}
          onboardingSubjectIds={onboardingSubjectIds}
        />

        <Mark32PageHeader
          eyebrow="Subjects"
          title={`${selectedSubject.name} is your revision home.`}
          description="Continue the right topic, see your progress, move into practice, and step into mock-exam preparation without learning a new interface."
          aside={
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Continue learning</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">
                {selectedTopic.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {selectedTopic.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTopicId(selectedTopic.topicId)}
                  className="inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  Open this topic
                </button>
                <Link
                  href={withPrefix("/assessments")}
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
                >
                  Start timed practice
                </Link>
              </div>
            </div>
          }
          stats={[
            {
              label: "Subject",
              value: selectedSubject.name,
              detail: `${selectedSubject.qualificationType} • ${selectedSubject.examBoards.join(", ")}`,
            },
            {
              label: "Readiness",
              value: `${selectedSubject.examReadinessScore} / 100`,
              detail: `Next topic: ${selectedSubject.nextTopicToRevise}`,
            },
            {
              label: "Year group",
              value: selectedTopic.studentContext.yearGroupLabel,
              detail: selectedSubject.endOfYearExamContext,
            },
            {
              label: "GCSE bridge",
              value: `${selectedSubject.revisionResourceCount} resources`,
              detail: selectedSubject.gcsePreparationGoal,
            },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Continue learning</p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-stone-950">{selectedTopic.name}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{selectedTopic.summary}</p>
            <button
              type="button"
              onClick={() => setSelectedTopicId(selectedTopic.topicId)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Continue topic
            </button>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">Progress</p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-stone-950">
              {selectedSubject.examReadinessScore} / 100 readiness
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Next topic: {selectedSubject.nextTopicToRevise}
            </p>
            <Link
              href={withPrefix("/progress")}
              className="mt-4 inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
            >
              Open progress
            </Link>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Topics</p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-stone-950">{topics.length} topics available</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Learn through one familiar structure across every topic in this subject.
            </p>
            <p className="mt-4 text-sm font-semibold text-sky-900">Pick a topic below</p>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-700">Mock exam</p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-stone-950">Step into exam mode when ready</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Practice in topic flow first, then move into timed assessments and full papers with the same subject context.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={withPrefix("/assessments")}
                className="inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
              >
                Practice
              </Link>
              <Link
                href={withPrefix("/exams")}
                className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
              >
                Mock exam
              </Link>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Launch subjects
                </h2>
              </div>
              <div className="divide-y divide-stone-200">
                {subjects.map((subject) => {
                  const isSelected = subject.subjectId === selectedSubject.subjectId;
                  const isOnboardingSubject = onboardingSubjectIds.includes(subject.subjectId);

                  return (
                    <button
                      key={subject.subjectId}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(subject.subjectId);
                        setSelectedTopicId((topicsBySubject[subject.subjectId] ?? [])[0]?.topicId ?? "");
                      }}
                      className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                        isSelected
                          ? "bg-teal-800 text-white"
                          : "bg-white text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{subject.name}</span>
                        {isOnboardingSubject ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              isSelected ? "bg-teal-700 text-teal-50" : "bg-teal-50 text-teal-800"
                            }`}
                          >
                            Your subject
                          </span>
                        ) : null}
                      </span>
                      <p className={`text-sm ${isSelected ? "text-teal-50" : "text-stone-600"}`}>
                        {subject.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>

          <section className="space-y-5">
            <article className="space-y-6 border border-stone-200 bg-white p-5 sm:p-6">
              <div className="space-y-2 border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Topic selection
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{selectedTopic.name}</h2>
                <p className="text-sm leading-6 text-stone-600">
                  One structure each time: learn the idea, look at a worked example, practise, then move into exam-style questions.
                </p>
                <div className="mt-4">
                  <LearningLoopStepRail stage={learningLoopStage} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => {
                    const isSelected = topic.topicId === selectedTopic.topicId;

                    return (
                      <button
                        key={topic.topicId}
                        type="button"
                        onClick={() => setSelectedTopicId(topic.topicId)}
                        className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "border-teal-800 bg-teal-800 text-white"
                            : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {topic.name}
                      </button>
                    );
                  })}
                </div>
              </div>

                <div className="space-y-4">

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Confidence</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {selectedTopic.confidenceScore} / 100
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Practice</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {selectedTopic.practiceQuestionCount}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Timed mode</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {selectedTopic.timedAssessmentAvailable ? "Ready" : "Soon"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      End-of-year exam context
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.studentContext.endOfYearExamUse}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      GCSE preparation
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.studentContext.gcsePreparationBridge}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Curriculum coverage
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.curriculumCoverage.qualificationTypes.join(", ")} •{" "}
                      {selectedTopic.curriculumCoverage.boardFocus.join(", ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {selectedTopic.curriculumCoverage.year10CoverageNote}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Year 11 continuation
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.curriculumCoverage.year11CoverageNote}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Source attribution
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.editorial.sourceProviderName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {selectedTopic.editorial.sourceReference}
                    </p>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Checked against
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {selectedTopic.editorial.checkedAgainst ?? "Editorial verification required"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Last updated:{" "}
                      {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
                        new Date(selectedTopic.editorial.lastUpdatedAt),
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">1. Learn</p>
                    <div className="mt-3 space-y-3">
                      {learnSections.map((body, index) => (
                        <p key={`learn-${index}`} className="text-sm leading-6 text-stone-600">
                          {body}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">2. Worked example</p>
                    <div className="mt-3 space-y-3">
                      {workedExampleSections.map((body, index) => (
                        <p key={`worked-${index}`} className="text-sm leading-6 text-stone-600">
                          {body}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">3. Practice</p>
                    <div className="mt-3 space-y-3">
                      {practiceSections.map((body, index) => (
                        <p key={`practice-${index}`} className="text-sm leading-6 text-stone-600">
                          {body}
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/assessments"
                        className="inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                      >
                        Start practice
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-700">4. Exam questions</p>
                    <div className="mt-3 space-y-3">
                      {examSections.map((body, index) => (
                        <p key={`exam-${index}`} className="text-sm leading-6 text-stone-600">
                          {body}
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/exams"
                        className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
                      >
                        Open exams
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          </section>

          <aside className="space-y-6">
            <PremiumQuizCard
              quiz={quiz}
              topicId={selectedTopic.topicId}
              selectedOptionId={selectedQuizOptionId}
              feedback={quizFeedback}
              submitState={quizSubmitState}
              onSelectOption={(optionId) => {
                setSelectedQuizOptionByTopic((current) => ({
                  ...current,
                  [selectedTopic.topicId]: optionId,
                }));

                if (learningLoopStage === "learn") {
                  void fetch(`/api/learning-loop/${encodeURIComponent(selectedTopic.topicId)}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subjectId: selectedSubject.subjectId }),
                  }).then(async (response) => {
                    if (response.ok) {
                      const payload = (await response.json()) as { session: { stage: LearningLoopStage } };
                      setLearningLoopStage(payload.session.stage);
                    }
                  });
                }
              }}
              onSubmit={handleQuizSubmit}
            />

            {quizFeedback && loopNextAction ? (
              <section className="rounded-3xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-800">What to do next</p>
                <p className="mt-2 text-sm leading-6 text-teal-950">{loopNextAction.reason}</p>
                <Link
                  href={loopNextAction.href}
                  className="mt-4 inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  {loopNextAction.label}
                </Link>
              </section>
            ) : null}

            <section className={`${premiumUi.cardMuted} space-y-3`}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Exam board</h2>
              <PremiumExamBoardSelector
                boards={selectedSubject.examBoards}
                selectedBoard={selectedBoard}
                onSelect={setSelectedBoard}
              />
            </section>

            <section className={`${premiumUi.cardMuted} space-y-3`}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Visual support</h2>
              <p className={premiumUi.body}>
                Generated study visuals follow the same review and fact-check workflow as other student content.
              </p>
              <div className="rounded-xl border border-white/10 bg-[#0B0F17] p-3">
                <p className={premiumUi.eyebrow}>Planned visual</p>
                <p className={`mt-2 ${premiumUi.body}`}>{selectedTopic.visualSupport.altText}</p>
              </div>
            </section>

            <section className={`${premiumUi.cardMuted} space-y-3`}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Next after this topic</h2>
              <ul className={`space-y-2 ${premiumUi.body}`}>
                <li>Return to this topic if you need another pass through the explanation.</li>
                <li>Use timed practice to check how well the idea is sticking.</li>
                <li>Move into exam mode when you are ready to answer under pressure.</li>
              </ul>
            </section>
          </aside>
        </section>
    </div>
  );
}
