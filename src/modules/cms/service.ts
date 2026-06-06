import { getMockQuizQuestion } from "@/modules/quiz/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { getMockSubjects } from "@/modules/subjects/service";
import { getMockTopicsForSubject } from "@/modules/topics/service";
import type { CmsContentReference, CmsOverview, CmsProvider } from "./types";

const cmsProviders: CmsProvider[] = [
  {
    providerId: "seed-content-provider",
    name: "Seed Content Provider",
    type: "seed-content",
    description: "Current MVP source for subjects, topics, revision stacks, and quiz prompts.",
    syncStatus: "healthy",
    lastSyncedAt: "2026-06-06T09:10:00.000Z",
    nextStep: "Keep serving the website while repository-backed content storage is added.",
  },
  {
    providerId: "headless-cms-provider",
    name: "Future Headless CMS",
    type: "headless-cms",
    description: "Planned source for editor-managed revision content, topic copy, and launch metadata.",
    syncStatus: "planned",
    nextStep: "Add repository adapter and publishing workflow before replacing seed content.",
  },
  {
    providerId: "manual-upload-provider",
    name: "Manual Upload Gateway",
    type: "manual-upload",
    description: "Fallback import path for structured CSV or JSON content updates during MVP growth.",
    syncStatus: "planned",
    nextStep: "Use for controlled imports before full CMS tooling is prioritised.",
  },
];

export async function getCmsOverview(): Promise<CmsOverview> {
  const subjects = getMockSubjects();
  const content: CmsContentReference[] = [];

  for (const subject of subjects) {
    content.push({
      contentId: `subject-${subject.subjectId}`,
      kind: "subject",
      title: subject.name,
      subjectId: subject.subjectId,
      status: "published",
      updatedAt: "2026-06-06T08:45:00.000Z",
      sourceProviderId: "seed-content-provider",
    });

    const topics = getMockTopicsForSubject(subject.subjectId);

    for (const topic of topics) {
      content.push({
        contentId: `topic-${topic.topicId}`,
        kind: "topic",
        title: topic.name,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: "published",
        updatedAt: "2026-06-06T08:50:00.000Z",
        sourceProviderId: "seed-content-provider",
      });

      const revision = getMockRevisionContent(topic.topicId);
      const quiz = getMockQuizQuestion(topic.topicId);

      content.push({
        contentId: revision.contentId,
        kind: "revision",
        title: revision.title,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: "published",
        updatedAt: "2026-06-06T08:55:00.000Z",
        sourceProviderId: "seed-content-provider",
      });

      content.push({
        contentId: `quiz-${quiz.questionId}`,
        kind: "quiz",
        title: `Quiz prompt for ${topic.name}`,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: "published",
        updatedAt: "2026-06-06T09:00:00.000Z",
        sourceProviderId: "seed-content-provider",
      });
    }
  }

  return {
    providers: cmsProviders,
    content,
    publishedCount: content.filter((item) => item.status === "published").length,
    draftCount: content.filter((item) => item.status === "draft").length,
    nextUpdatePlan:
      "Keep the website on seed content now, then add a headless CMS adapter and publishing workflow without changing the student routes.",
  };
}
