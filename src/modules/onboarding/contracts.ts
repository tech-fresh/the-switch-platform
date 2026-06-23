import type { LearnerOnboardingProfile, OnboardingOverview } from "./types";

export interface OnboardingOverviewResponse {
  onboarding: OnboardingOverview;
}

export interface OnboardingProfileUpdateRequest {
  profile: Partial<LearnerOnboardingProfile> & {
    complete?: boolean;
  };
}

export interface OnboardingProfileUpdateResponse {
  profile: LearnerOnboardingProfile;
  isComplete: boolean;
}
