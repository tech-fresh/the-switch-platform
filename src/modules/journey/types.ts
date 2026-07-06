export type JourneySourceModule =
  | "saved-progress"
  | "recommendations"
  | "power-grid"
  | "exam-engine"
  | "recall-strength"
  | "results"
  | "dashboard";

export type JourneyActionId =
  | "continue-learning"
  | "resume-saved-work"
  | "practise-weak-topic"
  | "start-timed-assessment"
  | "start-exam-paper"
  | "review-mistakes"
  | "improve-power-grid"
  | "return-to-dashboard";

export interface PrimaryNextAction {
  id: string;
  actionId: JourneyActionId;
  label: string;
  href: string;
  reason: string;
  sourceModule: JourneySourceModule;
  priority: number;
}

export interface SecondaryNextAction {
  id: string;
  actionId: JourneyActionId;
  label: string;
  href: string;
  reason: string;
  sourceModule: JourneySourceModule;
  priority: number;
}

export interface JourneyContext {
  userId: string;
  generatedAt: string;
  primaryAction: PrimaryNextAction;
  secondaryActions: SecondaryNextAction[];
}
