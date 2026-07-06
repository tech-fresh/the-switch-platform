export type ProgressionEventType =
  | "quiz.completed"
  | "assessment.progress"
  | "assessment.submitted"
  | "exam.progress"
  | "exam.submitted"
  | "topic.viewed"
  | "recommendation.completed"
  | "recall-strength.reviewed";

export interface ProgressionEvent {
  id: string;
  userId: string;
  type: ProgressionEventType;
  subjectId?: string;
  topicId?: string;
  xpDelta?: number;
  occurredAt: string;
}

export function createProgressionEvent(
  input: Omit<ProgressionEvent, "id" | "occurredAt"> & { occurredAt?: string },
): ProgressionEvent {
  return {
    id: `${input.userId}:${input.type}:${input.topicId ?? "global"}:${Date.now()}`,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    ...input,
  };
}
