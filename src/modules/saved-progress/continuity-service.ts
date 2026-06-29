import type { SavedProgressOverview, SavedProgressSessionSummary } from "./types";

export type LearnerContinuityStatus =
  | "resume-active-session"
  | "review-submitted-session"
  | "start-first-session";

export interface LearnerContinuityAction {
  status: LearnerContinuityStatus;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

export interface LearnerContinuityOverview {
  status: LearnerContinuityStatus;
  primaryAction: LearnerContinuityAction;
  activeSession?: SavedProgressSessionSummary;
  reviewSession?: SavedProgressSessionSummary;
  latestSession?: SavedProgressSessionSummary;
}

export function getLearnerContinuityOverview(
  sessions: SavedProgressSessionSummary[],
): LearnerContinuityOverview {
  const activeSession = sessions.find((session) => session.recoveryState === "resume-ready");
  const reviewSession = sessions.find((session) => session.recoveryState === "review-ready");
  const latestSession = sessions[0];

  if (activeSession) {
    return {
      status: "resume-active-session",
      primaryAction: {
        status: "resume-active-session",
        title: `Resume ${activeSession.title} next`,
        description: `Continue from the saved checkpoint and keep the learner journey on one known-good path through ${activeSession.currentQuestionLabel.toLowerCase()}.`,
        href: activeSession.href,
        actionLabel: activeSession.actionLabel,
      },
      activeSession,
      reviewSession,
      latestSession,
    };
  }

  if (reviewSession) {
    return {
      status: "review-submitted-session",
      primaryAction: {
        status: "review-submitted-session",
        title: `Review ${reviewSession.title} next`,
        description: "Open the submitted session through results instead of sending the learner back into an already completed live route.",
        href: reviewSession.href,
        actionLabel: reviewSession.actionLabel,
      },
      activeSession,
      reviewSession,
      latestSession,
    };
  }

  return {
    status: "start-first-session",
    primaryAction: {
      status: "start-first-session",
      title: "Start a timed assessment or exam next",
      description: "A first live session creates the continuity evidence that later powers resume, review, and follow-up routing.",
      href: "/exams",
      actionLabel: "Open exam lobby",
    },
    activeSession,
    reviewSession,
    latestSession,
  };
}
