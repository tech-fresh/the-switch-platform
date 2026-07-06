export type LearningLoopStage =
  | "learn"
  | "question"
  | "feedback"
  | "progress"
  | "next"
  | "complete";

export interface LearningLoopSession {
  userId: string;
  topicId: string;
  subjectId: string;
  stage: LearningLoopStage;
  updatedAt: string;
}
