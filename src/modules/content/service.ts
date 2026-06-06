import mvpContentCatalog from "@/data/mvp-content-catalog.json";
import type {
  ContentRepository,
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

export function listSeedContentSubjects(): MvpCatalogSubject[] {
  return staticCatalog.subjects.map((subject) => ({ ...subject }));
}

export function listSeedContentTopics(): MvpCatalogTopic[] {
  return staticCatalog.topics.map((topic) => ({ ...topic }));
}

export function listSeedContentTopicsForSubject(subjectId: string): MvpCatalogTopic[] {
  return staticCatalog.topics
    .filter((topic) => topic.subjectId === subjectId)
    .map((topic) => ({ ...topic }));
}

export function getSeedContentTopic(topicId: string): MvpCatalogTopic | null {
  const topic = staticCatalog.topics.find((item) => item.topicId === topicId);

  return topic ? { ...topic } : null;
}

export async function getMvpContentCatalog(
  repository: ContentRepository = seedRepository,
): Promise<MvpContentCatalog> {
  return repository.getCatalog();
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
