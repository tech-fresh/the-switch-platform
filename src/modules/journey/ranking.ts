import type { PrimaryNextAction, SecondaryNextAction } from "./types";
import { getJourneyVocabularyLabel } from "./vocabulary";

export interface JourneyRankingInput {
  activeSessionHref?: string;
  activeSessionTitle?: string;
  reviewSessionHref?: string;
  reviewSessionTitle?: string;
  hasReviewReadyResults: boolean;
  resultsHref?: string;
  recallDueHref?: string;
  recallDueTopicLabel?: string;
  powerGridNextAction?: string;
  powerGridNextActionHref?: string;
  topRecommendationHref?: string;
  topRecommendationLabel?: string;
  topRecommendationReason?: string;
}

export function rankPrimaryNextAction(input: JourneyRankingInput): {
  primary: PrimaryNextAction;
  secondary: SecondaryNextAction[];
} {
  const secondary: SecondaryNextAction[] = [];

  if (input.activeSessionHref) {
    return {
      primary: {
        id: "primary-resume-saved-work",
        actionId: "resume-saved-work",
        label: getJourneyVocabularyLabel("resume-saved-work"),
        href: input.activeSessionHref,
        reason: input.activeSessionTitle
          ? `You have an in-progress session: ${input.activeSessionTitle}.`
          : "You have saved work ready to resume.",
        sourceModule: "saved-progress",
        priority: 100,
      },
      secondary,
    };
  }

  if (input.hasReviewReadyResults && input.resultsHref) {
    return {
      primary: {
        id: "primary-review-mistakes",
        actionId: "review-mistakes",
        label: getJourneyVocabularyLabel("review-mistakes"),
        href: input.resultsHref,
        reason: "Submitted work is ready for review.",
        sourceModule: "results",
        priority: 90,
      },
      secondary,
    };
  }

  if (input.recallDueHref) {
    return {
      primary: {
        id: "primary-practise-weak-topic",
        actionId: "practise-weak-topic",
        label: getJourneyVocabularyLabel("practise-weak-topic"),
        href: input.recallDueHref,
        reason: input.recallDueTopicLabel
          ? `${input.recallDueTopicLabel} is due for review.`
          : "A topic is due for review.",
        sourceModule: "recall-strength",
        priority: 85,
      },
      secondary,
    };
  }

  if (input.powerGridNextActionHref && input.powerGridNextAction) {
    return {
      primary: {
        id: "primary-power-grid",
        actionId: "improve-power-grid",
        label: input.powerGridNextAction,
        href: input.powerGridNextActionHref,
        reason: "Power Grid suggests your next best study move.",
        sourceModule: "power-grid",
        priority: 30,
      },
      secondary,
    };
  }

  if (input.topRecommendationHref && input.topRecommendationLabel) {
    return {
      primary: {
        id: "primary-recommendation",
        actionId: "continue-learning",
        label: input.topRecommendationLabel,
        href: input.topRecommendationHref,
        reason: input.topRecommendationReason ?? "Your top recommendation is ready.",
        sourceModule: "recommendations",
        priority: 20,
      },
      secondary,
    };
  }

  return {
    primary: {
      id: "primary-continue-learning",
      actionId: "continue-learning",
      label: getJourneyVocabularyLabel("continue-learning"),
      href: "/subjects",
      reason: "Start or continue learning from your subjects.",
      sourceModule: "dashboard",
      priority: 10,
    },
    secondary: [
      {
        id: "secondary-dashboard",
        actionId: "return-to-dashboard",
        label: getJourneyVocabularyLabel("return-to-dashboard"),
        href: "/dashboard",
        reason: "Return to your study home.",
        sourceModule: "dashboard",
        priority: 5,
      },
    ],
  };
}
