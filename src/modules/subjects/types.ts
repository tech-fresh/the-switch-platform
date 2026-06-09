import type { CurriculumYearGroup, StudentStudyStage } from "@/modules/content/types";
import type { ExamBoard, QualificationType } from "@/modules/access-arrangements";

export interface Subject {
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
