import type { ExamBoard, QualificationType } from "@/modules/access-arrangements";
import type { QuizOption } from "@/modules/quiz/types";
import type { RevisionContentSection } from "@/modules/revision/types";

export type ContentPublicationStatus = "draft" | "published";
export type ContentFactCheckStatus = "not-started" | "in-progress" | "verified";
export type StudentStudyStage =
  | "year-10-end-of-year"
  | "year-10-gcse-bridge"
  | "year-11-mock-readiness"
  | "gcse-preparation";
export type CurriculumYearGroup = "Year 10" | "Year 11";

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
  factCheckStatus: ContentFactCheckStatus;
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
  studentStudyStage: StudentStudyStage;
  endOfYearExamContext: string;
  gcsePreparationGoal: string;
  yearGroups: CurriculumYearGroup[];
  boardCoverageNote: string;
}

export interface MvpCatalogTopic {
  topicId: string;
  subjectId: string;
  name: string;
  summary: string;
  confidenceScore: number;
  practiceQuestionCount: number;
  timedAssessmentAvailable: boolean;
  studentContext: {
    studentStudyStage: StudentStudyStage;
    yearGroupLabel: string;
    endOfYearExamUse: string;
    gcsePreparationBridge: string;
  };
  curriculumCoverage: {
    yearGroups: CurriculumYearGroup[];
    qualificationTypes: QualificationType[];
    boardFocus: ExamBoard[];
    year10CoverageNote: string;
    year11CoverageNote: string;
  };
  visualSupport: {
    generatedImagePrompt: string;
    altText: string;
  };
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
  contentOperations: {
    generation: {
      sourceId: string;
      name: string;
      handles: string[];
      updateMode: string;
      nextStep: string;
    }[];
    supply: {
      sourceId: string;
      name: string;
      handles: string[];
      updateMode: string;
      nextStep: string;
    }[];
    updates: {
      sourceId: string;
      name: string;
      handles: string[];
      updateMode: string;
      nextStep: string;
    }[];
    visibilityRule: string;
  };
  subjects: MvpCatalogSubject[];
  topics: MvpCatalogTopic[];
}

export interface ContentGateDecision {
  topicId: string;
  title: string;
  publicationStatus: ContentPublicationStatus;
  reviewStatus: ContentReviewStatus;
  studentVisible: boolean;
  hasTrustedSourceAttribution: boolean;
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
  factCheckStatusCounts: Record<ContentFactCheckStatus, number>;
  sourceAttributionCompleteCount: number;
  sourceAttributionBlockedCount: number;
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
