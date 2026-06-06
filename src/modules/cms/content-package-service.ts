import algebraPackage from "@/data/content-packs/gcse-maths-algebra.json";
import type { TopicContentPackage } from "./content-package-types";

const topicContentPackages: TopicContentPackage[] = [
  algebraPackage as TopicContentPackage,
];

export function listTopicContentPackages(): TopicContentPackage[] {
  return topicContentPackages;
}

export function getTopicContentPackage(topicId: string): TopicContentPackage | null {
  return topicContentPackages.find((contentPackage) => contentPackage.topicId === topicId) ?? null;
}
