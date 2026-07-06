import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getJourneyNextActionApiData, getSubjectsExperienceApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { SubjectExperience } from "./subject-experience";

export const dynamic = "force-dynamic";

interface SubjectsPageProps {
  searchParams?: Promise<{
    subjectId?: string;
    topicId?: string;
  }>;
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const [shell, experience] = await Promise.all([
    requireStudentAppRouteContext(),
    getSubjectsExperienceApiData(),
  ]);
  const journey = await getJourneyNextActionApiData();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const onboardingSubjectId = shell.onboardingSubjectIds.find((subjectId) =>
    experience.subjects.some((subject) => subject.subjectId === subjectId),
  );

  const initialSubjectId =
    resolvedSearchParams?.subjectId &&
    experience.subjects.some((subject) => subject.subjectId === resolvedSearchParams.subjectId)
      ? resolvedSearchParams.subjectId
      : onboardingSubjectId ?? experience.subjects[0]?.subjectId;

  const initialTopicId =
    resolvedSearchParams?.topicId &&
    experience.topicsBySubject[initialSubjectId ?? ""]?.some(
      (topic) => topic.topicId === resolvedSearchParams.topicId,
    )
      ? resolvedSearchParams.topicId
      : undefined;

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <div className="flex flex-col gap-6">
        <JourneyNextStepPanel journey={journey} />
        <SubjectExperience
          subjects={experience.subjects}
          topicsBySubject={experience.topicsBySubject}
          revisionByTopic={experience.revisionByTopic}
          quizByTopic={experience.quizByTopic}
          quizAttemptsByTopic={experience.quizAttemptsByTopic}
          initialSubjectId={initialSubjectId}
          initialTopicId={initialTopicId}
          onboardingSubjectIds={shell.onboardingSubjectIds}
        />
      </div>
    </StudentAppShell>
  );
}
