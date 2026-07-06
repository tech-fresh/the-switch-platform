import type { ExamBoard, ExamTier, QualificationType } from "@/modules/access-arrangements";
import type { ContentReviewStatus } from "@/modules/content/types";
import type { QualificationPath } from "@/modules/onboarding/types";

export type ScienceAwardType =
  | "combined_science"
  | "separate_biology"
  | "separate_chemistry"
  | "separate_physics"
  | "shared_science_content"
  | "combined_only"
  | "triple_only";

export type SubjectLibraryContentStatus =
  | "planned"
  | "official-spec-import-required"
  | "mapped"
  | "reviewed";

export interface SubjectLibraryQualification {
  qualificationRoute: QualificationPath;
  qualificationType: QualificationType;
  label: string;
  status: "live" | "deferred";
  supportedExamBoards: ExamBoard[];
}

export interface SubjectLibrarySubject {
  subjectId: string;
  name: string;
  qualificationRoute: QualificationPath;
  qualificationType: QualificationType;
  examBoards: ExamBoard[];
  studentVisible: boolean;
  futureOnly: boolean;
  isScience: boolean;
  scienceAwardTypes: ScienceAwardType[];
  sourceTitleTemplate: string;
}

export interface SubjectLibraryTopicSeed {
  topicId: string;
  subjectId: string;
  name: string;
  paper: string | null;
  tier: ExamTier | "ALL" | null;
  commandWords: string[];
  assessmentObjective: string;
  pathwayTags?: ScienceAwardType[];
}

export interface SubjectLibrarySubtopic {
  subtopicId: string;
  topicId: string;
  subjectId: string;
  name: string;
}

export interface SubjectLibraryLearningObjective {
  id: string;
  qualificationRoute: QualificationPath;
  examBoard: ExamBoard;
  qualificationType: QualificationType;
  subject: string;
  subjectId: string;
  awardType: ScienceAwardType | null;
  pathwayTags: ScienceAwardType[];
  paper: string | null;
  tier: ExamTier | "ALL" | null;
  topic: string;
  topicId: string;
  subtopic: string;
  subtopicId: string;
  learningObjective: string;
  specificationReference: string;
  assessmentObjective: string;
  commandWords: string[];
  sourceAttribution: string;
  specificationVersion: string;
  contentStatus: SubjectLibraryContentStatus;
  qaStatus: ContentReviewStatus;
  lastReviewedAt: string;
  studentVisible: boolean;
}

export interface SubjectLibrarySeed {
  catalogVersion: string;
  lastUpdatedAt: string;
  specificationVersion: string;
  qualifications: SubjectLibraryQualification[];
  subjects: SubjectLibrarySubject[];
  scienceAwardTypes: ScienceAwardType[];
  topics: SubjectLibraryTopicSeed[];
}

export interface SubjectLibraryFilters {
  qualificationRoute?: QualificationPath;
  qualificationType?: QualificationType;
  examBoard?: ExamBoard;
  subjectId?: string;
  studentVisibleOnly?: boolean;
  includeFuture?: boolean;
  awardType?: ScienceAwardType;
  pathwayTag?: ScienceAwardType;
}

export interface SubjectLibraryValidationResult {
  isValid: boolean;
  errors: string[];
  counts: {
    qualifications: number;
    subjects: number;
    topics: number;
    subtopics: number;
    learningObjectives: number;
  };
}
