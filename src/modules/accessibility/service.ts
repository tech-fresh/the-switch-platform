import {
  getStudentAccessProfile,
  updateStudentAccessProfile,
} from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import type { AccessibilitySettings, AccessibilitySnapshot } from "./types";

export async function getAccessibilitySnapshot(
  userId: string,
  repository?: StudentAccessProfileRepository,
): Promise<AccessibilitySnapshot> {
  const profile = await getStudentAccessProfile(userId, repository);

  return {
    settings: mapProfileToAccessibilitySettings(profile),
    studentAccessProfile: profile,
  };
}

export async function updateAccessibilitySettings(
  settings: AccessibilitySettings,
  repository?: StudentAccessProfileRepository,
): Promise<AccessibilitySnapshot> {
  const currentProfile = await getStudentAccessProfile(settings.userId, repository);
  const updatedProfile = await updateStudentAccessProfile(
    {
      ...currentProfile,
      preferredReadingSpeed: settings.preferredReadingSpeed,
      preferredFontSize: settings.preferredFontSize,
      preferredColourScheme: settings.preferredColourScheme,
      textToSpeechEnabled: settings.textToSpeechEnabled,
      accessibilityPreferences: {
        ...currentProfile.accessibilityPreferences,
        ...settings.preferences,
        focusModeEnabled: settings.focusModeEnabled,
        highContrastModeEnabled: settings.highContrastModeEnabled,
        dyslexiaFriendlyFontEnabled: settings.dyslexiaFriendlyFontEnabled,
        reducedDistractionModeEnabled: settings.reducedDistractionModeEnabled,
        lineSpacing: settings.lineSpacing,
      },
    },
    repository,
  );

  return {
    settings: mapProfileToAccessibilitySettings(updatedProfile),
    studentAccessProfile: updatedProfile,
  };
}

function mapProfileToAccessibilitySettings(profile: AccessibilitySnapshot["studentAccessProfile"]): AccessibilitySettings {
  return {
    userId: profile.userId,
    preferences: profile.accessibilityPreferences,
    preferredReadingSpeed: profile.preferredReadingSpeed,
    preferredFontSize: profile.preferredFontSize,
    preferredColourScheme: profile.preferredColourScheme,
    focusModeEnabled: profile.accessibilityPreferences.focusModeEnabled ?? false,
    highContrastModeEnabled: profile.accessibilityPreferences.highContrastModeEnabled ?? false,
    dyslexiaFriendlyFontEnabled:
      profile.accessibilityPreferences.dyslexiaFriendlyFontEnabled ?? false,
    reducedDistractionModeEnabled:
      profile.accessibilityPreferences.reducedDistractionModeEnabled ?? false,
    lineSpacing: profile.accessibilityPreferences.lineSpacing ?? "default",
    textToSpeechEnabled: profile.textToSpeechEnabled,
  };
}
