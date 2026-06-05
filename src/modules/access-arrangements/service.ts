import type {
  AccessArrangement,
  AccessArrangementApplication,
  AccessArrangementDurationResult,
  AssessmentAccessArrangementInput,
  AssessmentWithAccessArrangements,
  ExamAccessArrangementInput,
  ExamWithAccessArrangements,
  ReadAloudAccessArrangementConfig,
  SavedProgressAccessArrangementSnapshot,
  StudentAccessProfile,
  StudentAccessProfileRepository,
} from "./types";

const DEFAULT_READING_SPEED = 1;
const DEFAULT_FONT_SIZE = 16;

const inMemoryProfiles = new Map<string, StudentAccessProfile>();

const defaultRepository: StudentAccessProfileRepository = {
  async getByUserId(userId: string) {
    return inMemoryProfiles.get(userId) ?? null;
  },
  async save(profile: StudentAccessProfile) {
    inMemoryProfiles.set(profile.userId, profile);
    return profile;
  },
};

export function calculateExamDurationWithAccessArrangements(
  baseDurationMinutes: number,
  activeAccessArrangements: AccessArrangement[],
): AccessArrangementDurationResult {
  const extraTimePercentage = activeAccessArrangements.includes("EXTRA_TIME_50")
    ? 50
    : activeAccessArrangements.includes("EXTRA_TIME_25")
      ? 25
      : 0;

  return {
    baseDurationMinutes,
    adjustedDurationMinutes: Math.ceil(
      baseDurationMinutes * (1 + extraTimePercentage / 100),
    ),
    extraTimePercentage,
    restBreaksEnabled: activeAccessArrangements.includes("REST_BREAKS"),
  };
}

export async function getStudentAccessProfile(
  userId: string,
  repository: StudentAccessProfileRepository = defaultRepository,
): Promise<StudentAccessProfile> {
  const profile = await repository.getByUserId(userId);

  return profile ?? createDefaultStudentAccessProfile(userId);
}

export async function updateStudentAccessProfile(
  profile: StudentAccessProfile,
  repository: StudentAccessProfileRepository = defaultRepository,
): Promise<StudentAccessProfile> {
  return repository.save(normaliseStudentAccessProfile(profile));
}

export async function applyAccessArrangementsToAssessment(
  assessment: AssessmentAccessArrangementInput,
  repository: StudentAccessProfileRepository = defaultRepository,
): Promise<AssessmentWithAccessArrangements> {
  const profile = await getStudentAccessProfile(assessment.userId, repository);
  const requestedDuration = Math.min(
    assessment.durationMinutes,
    assessment.maximumOfficialDurationMinutes,
  );

  return {
    ...assessment,
    durationMinutes: requestedDuration,
    accessArrangementApplication: buildAccessArrangementApplication(
      profile,
      requestedDuration,
    ),
  };
}

export async function applyAccessArrangementsToExam(
  exam: ExamAccessArrangementInput,
  repository: StudentAccessProfileRepository = defaultRepository,
): Promise<ExamWithAccessArrangements> {
  const profile = await getStudentAccessProfile(exam.userId, repository);

  return {
    ...exam,
    accessArrangementApplication: buildAccessArrangementApplication(
      profile,
      exam.officialDurationMinutes,
    ),
  };
}

function buildAccessArrangementApplication(
  profile: StudentAccessProfile,
  baseDurationMinutes: number,
): AccessArrangementApplication {
  return {
    userId: profile.userId,
    activeAccessArrangements: profile.activeAccessArrangements,
    duration: calculateExamDurationWithAccessArrangements(
      baseDurationMinutes,
      profile.activeAccessArrangements,
    ),
    readAloud: buildReadAloudConfig(profile),
    accessibility: profile.accessibilityPreferences,
    savedProgressSnapshot: buildSavedProgressSnapshot(profile),
  };
}

function buildReadAloudConfig(
  profile: StudentAccessProfile,
): ReadAloudAccessArrangementConfig {
  const enabledByArrangement =
    profile.activeAccessArrangements.includes("READER") ||
    profile.activeAccessArrangements.includes("TEXT_TO_SPEECH");

  if (enabledByArrangement) {
    return {
      enabled: true,
      readingSpeed: profile.preferredReadingSpeed,
      source: "access-arrangement",
    };
  }

  if (profile.textToSpeechEnabled) {
    return {
      enabled: true,
      readingSpeed: profile.preferredReadingSpeed,
      source: "student-preference",
    };
  }

  return {
    enabled: false,
    readingSpeed: profile.preferredReadingSpeed,
    source: "disabled",
  };
}

function buildSavedProgressSnapshot(
  profile: StudentAccessProfile,
): SavedProgressAccessArrangementSnapshot {
  return {
    activeAccessArrangements: profile.activeAccessArrangements,
    preferredReadingSpeed: profile.preferredReadingSpeed,
    preferredFontSize: profile.preferredFontSize,
    preferredColourScheme: profile.preferredColourScheme,
    textToSpeechEnabled: profile.textToSpeechEnabled,
    accessibilityPreferences: profile.accessibilityPreferences,
    capturedAt: new Date().toISOString(),
  };
}

function createDefaultStudentAccessProfile(
  userId: string,
): StudentAccessProfile {
  return {
    userId,
    activeAccessArrangements: [],
    preferredReadingSpeed: DEFAULT_READING_SPEED,
    preferredFontSize: DEFAULT_FONT_SIZE,
    preferredColourScheme: "default",
    textToSpeechEnabled: false,
    accessibilityPreferences: {},
  };
}

function normaliseStudentAccessProfile(
  profile: StudentAccessProfile,
): StudentAccessProfile {
  const activeAccessArrangements = Array.from(
    new Set(profile.activeAccessArrangements),
  );

  return {
    ...profile,
    activeAccessArrangements,
    preferredReadingSpeed:
      profile.preferredReadingSpeed > 0
        ? profile.preferredReadingSpeed
        : DEFAULT_READING_SPEED,
    preferredFontSize:
      profile.preferredFontSize > 0
        ? profile.preferredFontSize
        : DEFAULT_FONT_SIZE,
  };
}
