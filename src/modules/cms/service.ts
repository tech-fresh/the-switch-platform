import { getContentEditorialAudit, getMvpContentCatalog, isTopicStudentVisible } from "@/modules/content/service";
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
  const [catalog, editorialAudit] = await Promise.all([
    getMvpContentCatalog(),
    getContentEditorialAudit(),
  ]);
  const content: CmsContentReference[] = [];

  for (const subject of catalog.subjects) {
    const subjectTopics = catalog.topics.filter((topic) => topic.subjectId === subject.subjectId);
    const subjectVisible = subjectTopics.some(isTopicStudentVisible);

    content.push({
      contentId: `subject-${subject.subjectId}`,
      kind: "subject",
      title: subject.name,
      subjectId: subject.subjectId,
      status: subjectVisible ? "published" : "draft",
      studentVisible: subjectVisible,
      updatedAt: "2026-06-06T08:45:00.000Z",
      sourceProviderId: "seed-content-provider",
    });

    for (const topic of subjectTopics) {
      const studentVisible = isTopicStudentVisible(topic);

      content.push({
        contentId: `topic-${topic.topicId}`,
        kind: "topic",
        title: topic.name,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });

      content.push({
        contentId: topic.revision.contentId,
        kind: "revision",
        title: topic.revision.title,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });

      content.push({
        contentId: `quiz-${topic.quiz.questionId}`,
        kind: "quiz",
        title: `Quiz prompt for ${topic.name}`,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });
    }
  }

  return {
    providers: cmsProviders,
    content,
    publishedCount: content.filter((item) => item.status === "published").length,
    draftCount: content.filter((item) => item.status === "draft").length,
    studentVisibleCount: content.filter((item) => item.studentVisible).length,
    blockedCount: content.filter((item) => !item.studentVisible).length,
    editorialAudit,
    nextUpdatePlan:
      "Keep the website on reviewed seed content now, then add a headless CMS adapter and approval workflow without changing student routes.",
  };
}
