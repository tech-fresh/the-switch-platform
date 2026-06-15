import type { CurriculumYearGroup, StudentStudyStage } from "@/modules/content/types";
import type { ExamBoard, QualificationType } from "@/modules/access-arrangements";

export interface Topic {
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
  editorial: {
    sourceProviderName: string;
    sourceReference: string;
    checkedAgainst?: string;
    lastUpdatedAt: string;
  };
}
