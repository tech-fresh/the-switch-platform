export type AccessArrangement =
  | "EXTRA_TIME_25"
  | "EXTRA_TIME_50"
  | "READER"
  | "SCRIBE"
  | "REST_BREAKS"
  | "COLOURED_OVERLAY"
  | "SEPARATE_ROOM"
  | "TEXT_TO_SPEECH"
  | "LARGE_PRINT";

export type QualificationType =
  | "GCSE"
  | "IGCSE"
  | "FunctionalSkills"
  | "EntryLevel"
  | "Level1"
  | "Level2";

export type ExamTier = "FOUNDATION" | "HIGHER";

export type ExamBoard =
  | "AQA"
  | "Edexcel"
  | "OCR"
  | "Eduqas"
  | "WJEC"
  | "CCEA"
  | "Cambridge IGCSE"
  | "Edexcel International GCSE"
  | "OxfordAQA International GCSE";

export type ColourSchemePreference =
  | "default"
  | "high-contrast"
  | "cream"
  | "blue"
  | "yellow"
  | "custom";

export interface AccessibilityPreferences {
  focusModeEnabled?: boolean;
  dyslexiaFriendlyFontEnabled?: boolean;
  lineSpacing?: "default" | "wide" | "extra-wide";
  reducedDistractionModeEnabled?: boolean;
  colouredOverlay?: ColourSchemePreference;
  highContrastModeEnabled?: boolean;
  largePrintEnabled?: boolean;
}

export interface StudentAccessProfile {
  userId: string;
  activeAccessArrangements: AccessArrangement[];
  preferredReadingSpeed: number;
  preferredFontSize: number;
  preferredColourScheme: ColourSchemePreference;
  textToSpeechEnabled: boolean;
  accessibilityPreferences: AccessibilityPreferences;
}

export interface AccessArrangementDurationResult {
  baseDurationMinutes: number;
  adjustedDurationMinutes: number;
  extraTimePercentage: 0 | 25 | 50;
  restBreaksEnabled: boolean;
}

export interface AssessmentAccessArrangementInput {
  assessmentId: string;
  userId: string;
  durationMinutes: number;
  maximumOfficialDurationMinutes: number;
  qualificationType: QualificationType;
  examBoard?: ExamBoard;
  tier?: ExamTier;
}

export interface ExamAccessArrangementInput {
  examId: string;
  userId: string;
  officialDurationMinutes: number;
  qualificationType: QualificationType;
  examBoard: ExamBoard;
  tier?: ExamTier;
}

export interface AccessArrangementApplication {
  userId: string;
  activeAccessArrangements: AccessArrangement[];
  duration: AccessArrangementDurationResult;
  readAloud: ReadAloudAccessArrangementConfig;
  accessibility: AccessibilityPreferences;
  savedProgressSnapshot: SavedProgressAccessArrangementSnapshot;
}

export interface AssessmentWithAccessArrangements
  extends AssessmentAccessArrangementInput {
  accessArrangementApplication: AccessArrangementApplication;
}

export interface ExamWithAccessArrangements extends ExamAccessArrangementInput {
  accessArrangementApplication: AccessArrangementApplication;
}

export interface ReadAloudAccessArrangementConfig {
  enabled: boolean;
  readingSpeed: number;
  source: "access-arrangement" | "student-preference" | "disabled";
}

export interface SavedProgressAccessArrangementSnapshot {
  activeAccessArrangements: AccessArrangement[];
  preferredReadingSpeed: number;
  preferredFontSize: number;
  preferredColourScheme: ColourSchemePreference;
  textToSpeechEnabled: boolean;
  accessibilityPreferences: AccessibilityPreferences;
  capturedAt: string;
}

export interface StudentAccessProfileRepository {
  getByUserId(userId: string): Promise<StudentAccessProfile | null>;
  save(profile: StudentAccessProfile): Promise<StudentAccessProfile>;
}
