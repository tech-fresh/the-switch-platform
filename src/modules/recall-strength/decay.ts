import type { RecallReviewOutcome } from "./types";

export function computeNextStrength(
  currentStrength: number,
  outcome: RecallReviewOutcome,
): number {
  const delta = outcome === "correct" ? 12 : outcome === "partial" ? 6 : -10;
  return Math.max(0, Math.min(100, currentStrength + delta));
}

export function computeNextReviewAt(strength: number, reviewedAt: string): string {
  const days = strength >= 80 ? 7 : strength >= 50 ? 3 : 1;
  const next = new Date(reviewedAt);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function isTopicDue(nextReviewAt: string | null, now = new Date()): boolean {
  if (!nextReviewAt) {
    return true;
  }

  return new Date(nextReviewAt).getTime() <= now.getTime();
}
