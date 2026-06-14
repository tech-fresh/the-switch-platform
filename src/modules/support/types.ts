export type SupportCategory =
  | "urgent-help"
  | "exam-stress"
  | "mental-health"
  | "school-pressure"
  | "text-support";

export interface SupportResource {
  resourceId: string;
  name: string;
  category: SupportCategory;
  description: string;
  url: string;
  providerType: "nhs" | "registered-charity";
  contactLabel?: string;
  audience: "young-people";
  urgent: boolean;
  lastReviewedAt: string;
}

export interface ExamSupportGuide {
  guideId: string;
  title: string;
  organisation: string;
  url: string;
  summary: string;
  topicsCovered: string[];
  lastReviewedAt: string;
}

export interface UrgentHelpOption {
  optionId: string;
  name: string;
  actionText: string;
  contactLabel: string;
  url: string;
  lastReviewedAt: string;
}

export interface SupportSafetyReview {
  reviewedAt: string;
  reviewedBy: string;
  audience: "young-people";
  policySummary: string;
  escalationGuidance: string;
  avoidsTherapeuticClaims: boolean;
  urgentHelpVisible: boolean;
}

export interface SupportRouteGuidance {
  routeId: "/support" | "/accessibility" | "/recommendations";
  title: string;
  message: string;
  actionLabel: string;
  href: string;
}

export interface SupportHubData {
  title: string;
  description: string;
  safetyNotice: string;
  safetyReview: SupportSafetyReview;
  routeGuidance: SupportRouteGuidance[];
  urgentHelp: UrgentHelpOption[];
  examSupportGuides: ExamSupportGuide[];
  trustedResources: SupportResource[];
}
