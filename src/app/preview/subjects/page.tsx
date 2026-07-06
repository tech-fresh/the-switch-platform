import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";
import { getMockQuizQuestion } from "@/modules/quiz/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { getMockSubjects } from "@/modules/subjects/service";
import { getMockTopicsForSubject } from "@/modules/topics/service";

import { SubjectExperience } from "@/app/subjects/subject-experience";

const PREVIEW_PREFIX = "/preview";

export default function PreviewSubjectsPage() {
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
  const dashboardData = buildMockPreviewDashboardData();
  const quizAttemptsByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, null]),
  );

  return (
    <StudentAppShell
      displayName="Preview student"
      powerGridLevel={dashboardData.summary.overallLevel}
      hrefPrefix={PREVIEW_PREFIX}
      showUtilityLinks={false}
      accountHref="/preview/account"
    >
      <SubjectExperience
        subjects={subjects}
        topicsBySubject={topicsBySubject}
        revisionByTopic={revisionByTopic}
        quizByTopic={quizByTopic}
        quizAttemptsByTopic={quizAttemptsByTopic}
        onboardingSubjectIds={["gcse-maths", "gcse-english-language", "gcse-combined-science"]}
        hrefPrefix={PREVIEW_PREFIX}
      />
    </StudentAppShell>
  );
}
