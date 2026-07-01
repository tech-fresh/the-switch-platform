import { NextResponse } from "next/server";

import { getSwitchRequestContext } from "@/lib/server/request-context";
import { getMockQuizQuestion } from "@/modules/quiz/service";
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
  const revisionByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockRevisionContent(topic.topicId)]),
  );
  const quizByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockQuizQuestion(topic.topicId)]),
  );

  return NextResponse.json({
    experience: {
      subjects,
      topicsBySubject,
      revisionByTopic,
      quizByTopic,
    },
  });
}
