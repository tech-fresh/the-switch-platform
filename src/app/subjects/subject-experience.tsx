"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/modules/quiz/types";
import type { RevisionContent } from "@/modules/revision/types";
import type { Subject } from "@/modules/subjects/types";
import type { Topic } from "@/modules/topics/types";

interface SubjectExperienceProps {
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  revisionByTopic: Record<string, RevisionContent>;
  quizByTopic: Record<string, QuizQuestion>;
  initialSubjectId?: string;
  initialTopicId?: string;
}

export function SubjectExperience({
  subjects,
  topicsBySubject,
  revisionByTopic,
  quizByTopic,
  initialSubjectId,
  initialTopicId,
}: SubjectExperienceProps) {
  if (subjects.length === 0) {
    return (
      <main className="min-h-screen bg-stone-100 text-stone-950">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <section className="border border-stone-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
              Subjects
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              Reviewed learning content is not available to students yet.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              This route now follows the editorial gate, so draft, unreviewed, or unverified
              topics stay hidden until they pass review, source checks, and fact-checking through
              the content workflow.
            </p>
          </section>
        </div>
      </main>
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

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
              Subjects
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Subject entry, Year 10 context, revision guidance, and GCSE-preparation practice in one route.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This is the start of the learn-practise flow. A student can pick a subject, open a
                topic, see how it supports Year 10 end-of-year exams, read the key revision
                guidance, and step into GCSE-style practice without dropping into a dead-end
                placeholder.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Subject</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{selectedSubject.name}</p>
              <p className="mt-1 text-sm text-stone-600">
                {selectedSubject.qualificationType} • {selectedSubject.examBoards.join(", ")}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Readiness</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {selectedSubject.examReadinessScore} / 100
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Next topic: {selectedSubject.nextTopicToRevise}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Year group</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {selectedTopic.studentContext.yearGroupLabel}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {selectedSubject.endOfYearExamContext}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">GCSE bridge</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {selectedSubject.revisionResourceCount} resources
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {selectedSubject.gcsePreparationGoal}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4 sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Board coverage</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {selectedSubject.boardCoverageNote}
              </p>
            </div>
          </div>
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
                          ? "bg-violet-700 text-white"
                          : "bg-white text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-sm font-semibold">{subject.name}</span>
                      <p className={`text-sm ${isSelected ? "text-violet-50" : "text-stone-600"}`}>
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                  Topic selection
                </p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => {
                    const isSelected = topic.topicId === selectedTopic.topicId;

                    return (
                      <button
                        key={topic.topicId}
                        type="button"
                        onClick={() => setSelectedTopicId(topic.topicId)}
                        className={`border px-3 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "border-violet-700 bg-violet-700 text-white"
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
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {selectedTopic.name}
                  </h2>
                  <p className="text-sm leading-6 text-stone-600">{selectedTopic.summary}</p>
                </div>

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
                  {revision.sections.map((section) => (
                    <div key={section.title} className="border border-stone-200 bg-white p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                        {section.title}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-stone-600">{section.body}</p>
                    </div>
                  ))}
                </div>

              </div>
            </article>
          </section>

          <aside className="space-y-6">
            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Quick practice
              </h2>
              <p className="text-sm leading-6 text-stone-700">{quiz.prompt}</p>
              <div className="space-y-2">
                {quiz.options.map((option) => (
                  <div key={option.optionId} className="border border-stone-200 bg-stone-50 p-3">
                    <p className="text-sm text-stone-700">
                      <span className="font-semibold text-stone-950">{option.label}</span> {option.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Visual support
              </h2>
              <p className="text-sm leading-6 text-stone-700">
                Generated study visuals follow the same review and fact-check workflow as other
                student content before they become visible.
              </p>
              <div className="border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Planned visual</p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {selectedTopic.visualSupport.altText}
                </p>
              </div>
            </section>

            <section className="space-y-3 border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="space-y-2 text-sm leading-6 text-stone-600">
                <li>Subjects can drive Year 10 and GCSE-preparation context through module services.</li>
                <li>Revision structure is now visible in-product instead of only in docs.</li>
                <li>Quick practice and planned visuals can sit beside revision without mixing separate content rules into the page.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
