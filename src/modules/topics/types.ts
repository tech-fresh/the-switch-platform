export interface Topic {
  topicId: string;
  subjectId: string;
  name: string;
  summary: string;
  confidenceScore: number;
  practiceQuestionCount: number;
  timedAssessmentAvailable: boolean;
}
