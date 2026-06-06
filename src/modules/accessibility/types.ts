import type {
  AccessibilityPreferences,
  ColourSchemePreference,
  StudentAccessProfile,
} from "@/modules/access-arrangements";

export interface AccessibilitySettings {
  userId: string;
  preferences: AccessibilityPreferences;
  preferredFontSize: number;
  preferredColourScheme: ColourSchemePreference;
  focusModeEnabled: boolean;
  highContrastModeEnabled: boolean;
  dyslexiaFriendlyFontEnabled: boolean;
  reducedDistractionModeEnabled: boolean;
  lineSpacing: "default" | "wide" | "extra-wide";
  textToSpeechEnabled: boolean;
}

export interface AccessibilitySnapshot {
  settings: AccessibilitySettings;
  studentAccessProfile: StudentAccessProfile;
}
