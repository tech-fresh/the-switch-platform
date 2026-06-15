import type { RevisionContent } from "./types";
import { getStudentVisibleContentTopic } from "@/modules/content/service";

export function getMockRevisionContent(topicId: string): RevisionContent {
  const topic = getStudentVisibleContentTopic(topicId);

  if (!topic) {
    throw new Error(`Unknown mock revision content for topic: ${topicId}`);
  }

  return {
    contentId: topic.revision.contentId,
    topicId: topic.topicId,
    title: topic.revision.title,
    sections: topic.revision.sections.map((section) => ({ ...section })),
  };
}
