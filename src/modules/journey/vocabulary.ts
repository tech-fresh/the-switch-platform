import type { JourneyActionId } from "./types";

export interface JourneyVocabularyEntry {
  id: JourneyActionId;
  label: string;
  description: string;
}

export function getJourneyVocabulary(): JourneyVocabularyEntry[] {
  return [
    {
      id: "continue-learning",
      label: "Continue Learning",
      description: "Pick up the next topic in your study path.",
    },
    {
      id: "resume-saved-work",
      label: "Resume Saved Work",
      description: "Return to an in-progress exam or assessment.",
    },
    {
      id: "practise-weak-topic",
      label: "Practise Weak Topic",
      description: "Strengthen a topic that needs more work.",
    },
    {
      id: "start-timed-assessment",
      label: "Start Timed Assessment",
      description: "Open a timed practice session.",
    },
    {
      id: "start-exam-paper",
      label: "Start Exam Paper",
      description: "Begin or continue a full exam paper.",
    },
    {
      id: "review-mistakes",
      label: "Review Mistakes",
      description: "Review submitted work and learn from errors.",
    },
    {
      id: "improve-power-grid",
      label: "Improve Power Grid",
      description: "Build readiness and XP on the progress route.",
    },
    {
      id: "return-to-dashboard",
      label: "Return to Dashboard",
      description: "Go back to your study home.",
    },
  ];
}

export function getJourneyVocabularyLabel(actionId: JourneyActionId): string {
  const entry = getJourneyVocabulary().find((item) => item.id === actionId);
  if (!entry) {
    throw new Error(`Unknown journey action id: ${actionId}`);
  }
  return entry.label;
}
