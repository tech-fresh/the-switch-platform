import type {
  ColourSchemePreference,
  SavedProgressAccessArrangementSnapshot,
} from "@/modules/access-arrangements";
import type { AccessibilitySnapshot } from "./types";

export function getLineHeightValue(
  lineSpacing: AccessibilitySnapshot["settings"]["lineSpacing"],
): string {
  switch (lineSpacing) {
    case "wide":
      return "1.8";
    case "extra-wide":
      return "2";
    default:
      return "1.6";
  }
}

export function formatColourSchemeLabel(preference: ColourSchemePreference): string {
  switch (preference) {
    case "high-contrast":
      return "High contrast";
    case "cream":
      return "Cream";
    case "blue":
      return "Blue";
    case "yellow":
      return "Yellow";
    case "custom":
      return "Custom";
    default:
      return "Default";
  }
}

export function formatLineSpacingLabel(
  lineSpacing: AccessibilitySnapshot["settings"]["lineSpacing"],
): string {
  switch (lineSpacing) {
    case "wide":
      return "Wide spacing";
    case "extra-wide":
      return "Extra-wide spacing";
    default:
      return "Default spacing";
  }
}

export function buildAccessibilityPreferenceChips(
  snapshot: SavedProgressAccessArrangementSnapshot | undefined,
): string[] {
  if (!snapshot) {
    return [];
  }

  const chips = [
    `${snapshot.preferredFontSize}px text`,
    `${snapshot.preferredReadingSpeed.toFixed(1)}x read aloud`,
    formatLineSpacingLabel(snapshot.accessibilityPreferences.lineSpacing ?? "default"),
  ];

  if (snapshot.preferredColourScheme !== "default") {
    chips.push(`${formatColourSchemeLabel(snapshot.preferredColourScheme)} theme`);
  }

  if (snapshot.accessibilityPreferences.focusModeEnabled) {
    chips.push("Focus mode");
  }

  if (snapshot.accessibilityPreferences.highContrastModeEnabled) {
    chips.push("High contrast");
  }

  if (snapshot.accessibilityPreferences.dyslexiaFriendlyFontEnabled) {
    chips.push("Dyslexia-friendly font");
  }

  if (snapshot.accessibilityPreferences.reducedDistractionModeEnabled) {
    chips.push("Reduced distraction");
  }

  if (snapshot.textToSpeechEnabled) {
    chips.push("Text to speech");
  }

  return chips;
}

export function buildAccessibilitySupportSummary(
  snapshot: SavedProgressAccessArrangementSnapshot | undefined,
): string {
  if (!snapshot) {
    return "No saved support snapshot is attached to this session yet.";
  }

  const arrangementCount = snapshot.activeAccessArrangements.length;
  const arrangementLabel = arrangementCount
    ? `${arrangementCount} active access arrangement${arrangementCount === 1 ? "" : "s"}`
    : "No formal access arrangements";

  return `${arrangementLabel}. ${snapshot.preferredFontSize}px text, ${snapshot.preferredReadingSpeed.toFixed(1)}x read aloud, ${formatColourSchemeLabel(snapshot.preferredColourScheme)} theme.`;
}
