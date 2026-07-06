import { NextResponse } from "next/server";

import { getSwitchRequestContext } from "@/lib/server/request-context";
import { getMockQuizQuestion } from "@/modules/quiz/service";
import { listQuizProgressByUser } from "@/modules/quiz/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { filterCatalogSubjectsForOnboardingProfile } from "@/modules/onboarding/personalization";
import { getOnboardingProfileByUserId } from "@/modules/onboarding/repository";
import { getMockSubjects } from "@/modules/subjects/service";
import { getMockTopicsForSubject } from "@/modules/topics/service";

export async function GET() {
  const requestContext = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(requestContext.userId);
  const subjects = filterCatalogSubjectsForOnboardingProfile(getMockSubjects(), profile);
  const topicsBySubject = Object.fromEntries(
    subjects.map((subject) => [subject.subjectId, getMockTopicsForSubject(subject.subjectId)]),
  );
  const allTopics = Object.values(topicsBySubject).flat();
  const quizProgress = await listQuizProgressByUser(requestContext.userId, requestContext.repositories.quizProgress);
  const revisionByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockRevisionContent(topic.topicId)]),
  );
  const quizByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockQuizQuestion(topic.topicId)]),
  );
  const quizAttemptsByTopic = Object.fromEntries(
    allTopics.map((topic) => {
      const question = quizByTopic[topic.topicId];
      const progress = quizProgress.find((record) => record.topicId === topic.topicId) ?? null;
      const selectedOption = question.options.find((option) => option.optionId === progress?.selectedOptionId);
      const correctOption = question.options.find((option) => option.optionId === question.correctOptionId);

      return [
        topic.topicId,
        progress && selectedOption && correctOption
          ? {
              topicId: topic.topicId,
              questionId: question.questionId,
              selectedOptionId: progress.selectedOptionId,
              selectedOptionLabel: selectedOption.label,
              correctOptionId: question.correctOptionId,
              correctOptionLabel: correctOption.label,
              isCorrect: progress.isCorrect,
              explanation: question.explanation,
              attemptsCount: progress.attemptsCount,
              correctCount: progress.correctCount,
              incorrectCount: progress.incorrectCount,
              accuracyPercentage: Math.round((progress.correctCount / Math.max(progress.attemptsCount, 1)) * 100),
              lastAnsweredAt: progress.lastAnsweredAt,
            }
          : null,
      ];
    }),
  );

  return NextResponse.json({
    experience: {
      subjects,
      topicsBySubject,
      revisionByTopic,
      quizByTopic,
      quizAttemptsByTopic,
    },
  });
}
