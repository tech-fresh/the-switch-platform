import mvpContentCatalog from "@/data/mvp-content-catalog.json";
import type {
  ContentEditorialAudit,
  ContentGateDecision,
  ContentRepository,
  ContentReviewStatus,
  MvpCatalogSubject,
  MvpCatalogTopic,
  MvpContentCatalog,
} from "./types";

const staticCatalog = mvpContentCatalog as MvpContentCatalog;

const seedRepository: ContentRepository = {
  async getCatalog() {
    return staticCatalog;
  },
  async listSubjects() {
    return staticCatalog.subjects;
  },
  async listTopics() {
    return staticCatalog.topics;
  },
  async listTopicsForSubject(subjectId) {
    return staticCatalog.topics.filter((topic) => topic.subjectId === subjectId);
  },
  async getTopic(topicId) {
    return staticCatalog.topics.find((topic) => topic.topicId === topicId) ?? null;
  },
};

export function getSeedContentRepository(): ContentRepository {
  return seedRepository;
}

export function getSeedContentCatalog(): MvpContentCatalog {
  return staticCatalog;
}

export function getStudentVisibleContentCatalog(
  catalog: MvpContentCatalog = staticCatalog,
): MvpContentCatalog {
  const topics = catalog.topics
    .filter(isTopicStudentVisible)
    .map((topic) => ({ ...topic }));
  const visibleSubjectIds = new Set(topics.map((topic) => topic.subjectId));

  return {
    ...catalog,
    subjects: catalog.subjects
      .filter((subject) => visibleSubjectIds.has(subject.subjectId))
      .map((subject) => {
        const subjectTopics = topics.filter((topic) => topic.subjectId === subject.subjectId);

        return {
          ...subject,
          topicCount: subjectTopics.length,
          revisionResourceCount: subjectTopics.reduce(
            (count, topic) => count + topic.revision.sections.length,
            0,
          ),
        };
      }),
    topics,
  };
}

export function listSeedContentSubjects(): MvpCatalogSubject[] {
  return staticCatalog.subjects.map((subject) => ({ ...subject }));
}

export function listStudentVisibleContentSubjects(): MvpCatalogSubject[] {
  return getStudentVisibleContentCatalog().subjects;
}

export function listSeedContentTopics(): MvpCatalogTopic[] {
  return staticCatalog.topics.map((topic) => ({ ...topic }));
}

export function listStudentVisibleContentTopics(): MvpCatalogTopic[] {
  return getStudentVisibleContentCatalog().topics;
}

export function listSeedContentTopicsForSubject(subjectId: string): MvpCatalogTopic[] {
  return staticCatalog.topics
    .filter((topic) => topic.subjectId === subjectId)
    .map((topic) => ({ ...topic }));
}

export function listStudentVisibleContentTopicsForSubject(subjectId: string): MvpCatalogTopic[] {
  return getStudentVisibleContentCatalog().topics
    .filter((topic) => topic.subjectId === subjectId)
    .map((topic) => ({ ...topic }));
}

export function getSeedContentTopic(topicId: string): MvpCatalogTopic | null {
  const topic = staticCatalog.topics.find((item) => item.topicId === topicId);

  return topic ? { ...topic } : null;
}

export function getStudentVisibleContentTopic(topicId: string): MvpCatalogTopic | null {
  const topic = getStudentVisibleContentCatalog().topics.find((item) => item.topicId === topicId);

  return topic ? { ...topic } : null;
}

export async function getMvpContentCatalog(
  repository: ContentRepository = seedRepository,
): Promise<MvpContentCatalog> {
  return repository.getCatalog();
}

export async function getStudentMvpContentCatalog(
  repository: ContentRepository = seedRepository,
): Promise<MvpContentCatalog> {
  const catalog = await repository.getCatalog();

  return getStudentVisibleContentCatalog(catalog);
}

export async function listMvpContentSubjects(
  repository: ContentRepository = seedRepository,
): Promise<MvpCatalogSubject[]> {
  return repository.listSubjects();
}

export async function listMvpContentTopics(
  repository: ContentRepository = seedRepository,
): Promise<MvpCatalogTopic[]> {
  return repository.listTopics();
}

export async function listMvpContentTopicsForSubject(
  subjectId: string,
  repository: ContentRepository = seedRepository,
): Promise<MvpCatalogTopic[]> {
  return repository.listTopicsForSubject(subjectId);
}

export async function getMvpContentTopic(
  topicId: string,
  repository: ContentRepository = seedRepository,
): Promise<MvpCatalogTopic | null> {
  return repository.getTopic(topicId);
}

export async function getContentEditorialAudit(
  repository: ContentRepository = seedRepository,
): Promise<ContentEditorialAudit> {
  const catalog = await repository.getCatalog();
  const gateDecisions = catalog.topics.map(buildContentGateDecision);
  const blockedTopicCount = gateDecisions.filter((decision) => !decision.studentVisible).length;

  return {
    catalogVersion: catalog.catalogVersion,
    totalTopicCount: catalog.topics.length,
    studentVisibleTopicCount: gateDecisions.length - blockedTopicCount,
    blockedTopicCount,
    publicationStatusCounts: {
      draft: catalog.topics.filter((topic) => topic.metadata.publicationStatus === "draft").length,
      published: catalog.topics.filter((topic) => topic.metadata.publicationStatus === "published").length,
    },
    reviewStatusCounts: {
      seeded: countTopicsByReviewStatus(catalog.topics, "seeded"),
      "internal-review-needed": countTopicsByReviewStatus(catalog.topics, "internal-review-needed"),
      "fact-check-needed": countTopicsByReviewStatus(catalog.topics, "fact-check-needed"),
      reviewed: countTopicsByReviewStatus(catalog.topics, "reviewed"),
    },
    gateDecisions,
    nextEditorialPriority:
      blockedTopicCount > 0
        ? "Resolve blocked topic checks before publishing more owned content to students."
        : "Keep adding source attribution and review notes as the content catalog grows.",
  };
}

export function isTopicStudentVisible(topic: MvpCatalogTopic): boolean {
  return topic.metadata.publicationStatus === "published" && topic.metadata.reviewStatus === "reviewed";
}

function buildContentGateDecision(topic: MvpCatalogTopic): ContentGateDecision {
  const studentVisible = isTopicStudentVisible(topic);

  if (studentVisible) {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      reason: "Published content has passed review and can be served to student clients.",
      nextStep: "Keep source attribution current when this topic changes.",
    };
  }

  if (topic.metadata.publicationStatus !== "published") {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      reason: "Draft content is blocked from student-facing catalog delivery.",
      nextStep: "Complete editorial review, fact-checking, and publish approval.",
    };
  }

  return {
    topicId: topic.topicId,
    title: topic.name,
    publicationStatus: topic.metadata.publicationStatus,
    reviewStatus: topic.metadata.reviewStatus,
    studentVisible,
    reason: "Published flag alone is not enough; reviewed status is required for student visibility.",
    nextStep: "Move the topic through internal review and fact-checking before release.",
  };
}

function countTopicsByReviewStatus(
  topics: MvpCatalogTopic[],
  status: ContentReviewStatus,
): number {
  return topics.filter((topic) => topic.metadata.reviewStatus === status).length;
}
