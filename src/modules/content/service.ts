import mvpContentCatalog from "@/data/mvp-content-catalog.json";
import type {
  ContentEditorialAudit,
  ContentFactCheckStatus,
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
  const sourceAttributionCompleteCount = gateDecisions.filter(
    (decision) => decision.hasTrustedSourceAttribution,
  ).length;

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
    factCheckStatusCounts: {
      "not-started": countTopicsByFactCheckStatus(catalog.topics, "not-started"),
      "in-progress": countTopicsByFactCheckStatus(catalog.topics, "in-progress"),
      verified: countTopicsByFactCheckStatus(catalog.topics, "verified"),
    },
    sourceAttributionCompleteCount,
    sourceAttributionBlockedCount: gateDecisions.length - sourceAttributionCompleteCount,
    gateDecisions,
    nextEditorialPriority:
      blockedTopicCount > 0
        ? "Resolve blocked topic checks before publishing more owned content to students. Reviewed-only visibility is not enough without verified fact checks and trusted source attribution."
        : "Keep adding source attribution, fact-check evidence, and review notes as the content catalog grows.",
  };
}

export function isTopicStudentVisible(topic: MvpCatalogTopic): boolean {
  return (
    topic.metadata.publicationStatus === "published" &&
    topic.metadata.reviewStatus === "reviewed" &&
    topic.metadata.factCheckStatus === "verified" &&
    hasTrustedSourceAttribution(topic)
  );
}

function buildContentGateDecision(topic: MvpCatalogTopic): ContentGateDecision {
  const studentVisible = isTopicStudentVisible(topic);
  const trustedSourceAttribution = hasTrustedSourceAttribution(topic);

  if (studentVisible) {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      hasTrustedSourceAttribution: trustedSourceAttribution,
      reason: "Published content has passed review, source checks, and fact-check verification before reaching student clients.",
      nextStep: "Keep source attribution and fact-check evidence current when this topic changes.",
    };
  }

  if (topic.metadata.publicationStatus !== "published") {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      hasTrustedSourceAttribution: trustedSourceAttribution,
      reason: "Draft content is blocked from student-facing catalog delivery.",
      nextStep: "Complete editorial review, fact-checking, year-group context checks, and publish approval.",
    };
  }

  if (!trustedSourceAttribution) {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      hasTrustedSourceAttribution: trustedSourceAttribution,
      reason: "Content is blocked because trusted source attribution is incomplete or still marked as pending.",
      nextStep: "Add named source attribution and checked-against evidence before student release.",
    };
  }

  if (topic.metadata.factCheckStatus !== "verified") {
    return {
      topicId: topic.topicId,
      title: topic.name,
      publicationStatus: topic.metadata.publicationStatus,
      reviewStatus: topic.metadata.reviewStatus,
      studentVisible,
      hasTrustedSourceAttribution: trustedSourceAttribution,
      reason: "Reviewed content is still blocked because fact-check verification has not been completed.",
      nextStep: "Verify the topic against trusted curriculum references before student release.",
    };
  }

  return {
    topicId: topic.topicId,
    title: topic.name,
    publicationStatus: topic.metadata.publicationStatus,
    reviewStatus: topic.metadata.reviewStatus,
    studentVisible,
    hasTrustedSourceAttribution: trustedSourceAttribution,
    reason: "Published flag alone is not enough; reviewed status and verified fact-checking are required for student visibility.",
    nextStep: "Move the topic through internal review and fact-checking before release.",
  };
}

export function hasTrustedSourceAttribution(topic: MvpCatalogTopic): boolean {
  const attribution = topic.metadata.sourceAttribution;
  const checkedAgainst = attribution.checkedAgainst?.trim() ?? "";

  return (
    attribution.providerId.trim().length > 0 &&
    attribution.providerName.trim().length > 0 &&
    attribution.sourceReference.trim().length > 0 &&
    checkedAgainst.length > 0 &&
    !checkedAgainst.toLowerCase().startsWith("pending")
  );
}

function countTopicsByReviewStatus(
  topics: MvpCatalogTopic[],
  status: ContentReviewStatus,
): number {
  return topics.filter((topic) => topic.metadata.reviewStatus === status).length;
}

function countTopicsByFactCheckStatus(
  topics: MvpCatalogTopic[],
  status: ContentFactCheckStatus,
): number {
  return topics.filter((topic) => topic.metadata.factCheckStatus === status).length;
}
