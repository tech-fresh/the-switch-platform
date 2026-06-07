import { SubjectExperience } from "./subject-experience";
import { getSubjectsExperienceApiData } from "@/lib/api/server";

interface SubjectsPageProps {
  searchParams?: Promise<{
    subjectId?: string;
    topicId?: string;
  }>;
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const experience = await getSubjectsExperienceApiData();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialSubjectId =
    resolvedSearchParams?.subjectId &&
    experience.subjects.some((subject) => subject.subjectId === resolvedSearchParams.subjectId)
      ? resolvedSearchParams.subjectId
      : experience.subjects[0]?.subjectId;
  const initialTopicId =
    resolvedSearchParams?.topicId &&
    experience.topicsBySubject[initialSubjectId ?? ""]?.some(
      (topic) => topic.topicId === resolvedSearchParams.topicId,
    )
      ? resolvedSearchParams.topicId
      : undefined;

  return (
    <SubjectExperience
      subjects={experience.subjects}
      topicsBySubject={experience.topicsBySubject}
      revisionByTopic={experience.revisionByTopic}
      quizByTopic={experience.quizByTopic}
      initialSubjectId={initialSubjectId}
      initialTopicId={initialTopicId}
    />
  );
}
