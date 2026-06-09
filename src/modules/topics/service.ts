import type { Topic } from "./types";
import type { MvpCatalogTopic } from "@/modules/content/types";
import {
  getStudentVisibleContentTopic,
  listStudentVisibleContentTopicsForSubject,
} from "@/modules/content/service";

export function getMockTopicsForSubject(subjectId: string): Topic[] {
  return listStudentVisibleContentTopicsForSubject(subjectId).map(mapCatalogTopicToTopic);
}

export function getMockTopic(topicId: string): Topic {
  const topic = getStudentVisibleContentTopic(topicId);

  if (!topic) {
    throw new Error(`Unknown mock topic: ${topicId}`);
  }

  return mapCatalogTopicToTopic(topic);
}

function mapCatalogTopicToTopic({
  revision: _revision,
  quiz: _quiz,
  metadata,
  ...topic
}: MvpCatalogTopic): Topic {
  return {
    ...topic,
    editorial: {
      sourceProviderName: metadata.sourceAttribution.providerName,
      sourceReference: metadata.sourceAttribution.sourceReference,
      checkedAgainst: metadata.sourceAttribution.checkedAgainst,
      lastUpdatedAt: metadata.lastUpdatedAt,
    },
  };
}
