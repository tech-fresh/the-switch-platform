import type { LearningLoopSession } from "./types";

export interface LearningLoopSessionApiResponse {
  session: LearningLoopSession;
}

export interface LearningLoopAdvanceRequest {
  subjectId: string;
}

export interface LearningLoopSyncQuizRequest {
  subjectId: string;
}
