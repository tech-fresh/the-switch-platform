export type TopicResourceKind =
  | "reading-topic"
  | "past-paper-finder"
  | "subject-page"
  | "mark-scheme-source"
  | "question-bank";

export interface TopicContentQuestion {
  questionId: string;
  prompt: string;
  answerFocus: string;
}

export interface TopicContentMaterialSection {
  title: string;
  body: string;
}

export interface TopicContentResourceLink {
  resourceId: string;
  label: string;
  href: string;
  kind: TopicResourceKind;
  sourceName: string;
  access: "free-public" | "free-with-centre-access";
  note: string;
}

export interface TopicContentPackage {
  packageId: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  readingTopic: string;
  summary: string;
  updatedAt: string;
  materialSections: TopicContentMaterialSection[];
  questions: TopicContentQuestion[];
  externalResources: TopicContentResourceLink[];
}
