import { SubjectExperience } from "./subject-experience";
import { getTopicContentPackage } from "@/modules/cms/content-package-service";
import { getMockQuizQuestion } from "@/modules/quiz/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { getMockSubjects } from "@/modules/subjects/service";
import { getMockTopicsForSubject } from "@/modules/topics/service";

export default function SubjectsPage() {
  const subjects = getMockSubjects();
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
  const contentPackagesByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getTopicContentPackage(topic.topicId)]),
  );

  return (
    <SubjectExperience
      subjects={subjects}
      topicsBySubject={topicsBySubject}
      revisionByTopic={revisionByTopic}
      quizByTopic={quizByTopic}
      contentPackagesByTopic={contentPackagesByTopic}
    />
  );
}
