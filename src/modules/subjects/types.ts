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
}
