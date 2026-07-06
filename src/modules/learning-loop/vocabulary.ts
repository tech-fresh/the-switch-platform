import type { LearningLoopStage } from "./types";

export const LEARNING_LOOP_STAGE_LABELS: Record<LearningLoopStage, string> = {
  learn: "Learn",
  question: "Question",
  feedback: "Feedback",
  progress: "Progress",
  next: "Next step",
  complete: "Complete",
};

export function getLearningLoopStageLabel(stage: LearningLoopStage): string {
  return LEARNING_LOOP_STAGE_LABELS[stage];
}
