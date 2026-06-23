import {
  readOnboardingProfiles,
  writeOnboardingProfiles,
} from "@/lib/persistence/onboarding-profile-store";

import type { LearnerOnboardingProfile } from "./types";

export async function getOnboardingProfileByUserId(
  userId: string,
): Promise<LearnerOnboardingProfile | null> {
  const profiles = await readOnboardingProfiles();
  return profiles.find((profile) => profile.userId === userId) ?? null;
}

export async function saveOnboardingProfile(
  profile: LearnerOnboardingProfile,
): Promise<LearnerOnboardingProfile> {
  const profiles = await readOnboardingProfiles();
  const nextProfiles = profiles.filter((item) => item.userId !== profile.userId);
  nextProfiles.push(profile);
  await writeOnboardingProfiles(nextProfiles);
  return profile;
}
