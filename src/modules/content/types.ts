import type { ExamBoard, QualificationType } from "@/modules/access-arrangements";
import type { QuizOption } from "@/modules/quiz/types";
import type { RevisionContentSection } from "@/modules/revision/types";

export type ContentPublicationStatus = "draft" | "published";

export type ContentReviewStatus =
  | "seeded"
  | "internal-review-needed"
  | "fact-check-needed"
  | "reviewed";

export type ContentSourceModel = "seed-json" | "cms-adapter" | "future-editorial";

export interface ContentSourceAttribution {
  providerId: string;
  providerName: string;
  sourceReference: string;
  checkedAgainst?: string;
}

export interface ContentReviewMetadata {
  publicationStatus: ContentPublicationStatus;
  reviewStatus: ContentReviewStatus;
  sourceModel: ContentSourceModel;
  lastUpdatedAt: string;
  sourceAttribution: ContentSourceAttribution;
}

export interface MvpCatalogSubject {
  subjectId: string;
  name: string;
  qualificationType: QualificationType;
  examBoards: ExamBoard[];
  description: string;
  topicCount: number;
  revisionResourceCount: number;
  examReadinessScore: number;
  nextTopicToRevise: string;
}

export interface MvpCatalogTopic {
  topicId: string;
  subjectId: string;
  name: string;
  summary: string;
  confidenceScore: number;
  practiceQuestionCount: number;
  timedAssessmentAvailable: boolean;
  revision: {
    contentId: string;
    title: string;
    sections: RevisionContentSection[];
  };
  quiz: {
    questionId: string;
    prompt: string;
    options: QuizOption[];
    correctOptionId: string;
  };
  metadata: ContentReviewMetadata;
}

export interface MvpContentCatalog {
  catalogVersion: string;
  lastUpdatedAt: string;
  subjects: MvpCatalogSubject[];
  topics: MvpCatalogTopic[];
}

export interface ContentGateDecision {
  topicId: string;
  title: string;
  publicationStatus: ContentPublicationStatus;
  reviewStatus: ContentReviewStatus;
  studentVisible: boolean;
  reason: string;
  nextStep: string;
}

export interface ContentEditorialAudit {
  catalogVersion: string;
  totalTopicCount: number;
  studentVisibleTopicCount: number;
  blockedTopicCount: number;
  publicationStatusCounts: Record<ContentPublicationStatus, number>;
  reviewStatusCounts: Record<ContentReviewStatus, number>;
  gateDecisions: ContentGateDecision[];
  nextEditorialPriority: string;
}

export interface ContentRepository {
  getCatalog(): Promise<MvpContentCatalog>;
  listSubjects(): Promise<MvpCatalogSubject[]>;
  listTopics(): Promise<MvpCatalogTopic[]>;
  listTopicsForSubject(subjectId: string): Promise<MvpCatalogTopic[]>;
  getTopic(topicId: string): Promise<MvpCatalogTopic | null>;
}
