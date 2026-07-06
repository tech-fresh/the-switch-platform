import type { ExamBoard, ExamTier, QualificationType } from "@/modules/access-arrangements";
import type {
  ContentFactCheckStatus,
  ContentReviewStatus,
} from "@/modules/content/types";
import type { ExamPaper, ExamPaperMode } from "@/modules/exam-engine/types";
import type { QualificationPath } from "@/modules/onboarding/types";

export type ExamInventoryStatus = "live" | "review" | "planned" | "blocked" | "retired";
export type ExamInventoryLaunchScope =
  | "launch-mvp"
  | "year-10-progression"
  | "gcse-bridge";

export interface ExamInventoryEntry {
  examId: string;
  title: string;
  subject: string;
  subjectId: string;
  qualificationType: QualificationType;
  qualificationPath: QualificationPath;
  board: ExamBoard;
  tier: ExamTier;
  paperType: ExamPaperMode;
  yearGroup: string;
  durationMinutes: number;
  totalMarks: number;
  status: ExamInventoryStatus;
  launchScope: ExamInventoryLaunchScope;
  sourceProviderId: string;
  sourceReference: string;
  studentVisibility: boolean;
  reviewStatus: ContentReviewStatus;
  factCheckStatus: ContentFactCheckStatus;
}

export interface ExamInventorySeed {
  inventoryVersion: string;
  lastUpdatedAt: string;
  entries: ExamInventoryEntry[];
}

export interface ExamInventoryFilters {
  qualificationPath?: QualificationPath;
  qualificationType?: QualificationType;
  board?: ExamBoard;
  subjectId?: string;
  status?: ExamInventoryStatus;
  studentVisibleOnly?: boolean;
  includeRetired?: boolean;
}

export interface ExamInventoryPaper extends ExamPaper {
  inventory: ExamInventoryEntry;
}

export interface ExamInventoryCoverageGroup {
  key: string;
  label: string;
  total: number;
  live: number;
  studentVisible: number;
}

export interface ExamInventorySummary {
  inventoryVersion: string;
  lastUpdatedAt: string;
  totalEntries: number;
  liveEntries: number;
  studentVisibleEntries: number;
  launchMvpEntries: number;
  year10Entries: number;
  bridgeEntries: number;
  byQualification: ExamInventoryCoverageGroup[];
  bySubject: ExamInventoryCoverageGroup[];
  byBoard: ExamInventoryCoverageGroup[];
  byTier: ExamInventoryCoverageGroup[];
  byStatus: ExamInventoryCoverageGroup[];
  coverageGaps: string[];
}

export interface ExamInventoryValidationResult {
  isValid: boolean;
  errors: string[];
  counts: {
    entries: number;
    liveEntries: number;
    studentVisibleEntries: number;
  };
}
