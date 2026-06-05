import type { AccessibilityPreferences } from "@/modules/access-arrangements";

export interface AccessibilitySettings {
  userId: string;
  preferences: AccessibilityPreferences;
}
