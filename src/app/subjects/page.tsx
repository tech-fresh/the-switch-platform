import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getSubjectsExperienceApiData } from "@/lib/api/server";
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
    </StudentAppShell>
  );
}
