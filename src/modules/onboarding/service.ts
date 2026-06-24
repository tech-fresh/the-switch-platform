import { listStudentVisibleContentSubjects } from "@/modules/content/service";
import {
  getStudentAccessProfile,
  updateStudentAccessProfile,
} from "@/modules/access-arrangements/service";

import { getOnboardingProfileByUserId, saveOnboardingProfile } from "./repository";
import type {
  LearnerOnboardingProfile,
  LearnerRole,
  OnboardingOptions,
  OnboardingOverview,
  OnboardingSupportChoice,
  QualificationPath,
  SchoolNation,
  SchoolPhase,
} from "./types";

const YEAR_GROUPS = [
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
  "Other",
];

const SCHOOL_SOURCES = [
  {
    nation: "england" as const,
    label: "England — Get Information about Schools",
    href: "https://www.get-information-schools.service.gov.uk/",
  },
  {
    nation: "scotland" as const,
    label: "Scotland — Find a school",
    href: "https://education.gov.scot/parentzone/find-a-school/",
  },
  {
    nation: "wales" as const,
    label: "Wales — My Local School",
    href: "https://mylocalschool.gov.wales/",
  },
  {
    nation: "northern-ireland" as const,
    label: "Northern Ireland — EA school finder",
    href: "https://www.eani.org.uk/",
  },
];

const ONBOARDING_STEPS = [
  "account-type",
  "qualification",
  "profile",
  "school",
  "subjects",
  "support",
  "guardian",
  "consent",
];

/** Selectable in onboarding UI during MVP. Wales and Northern Ireland GCSE routes are deferred. */
export const MVP_ONBOARDING_QUALIFICATION_PATHS = [
  {
    id: "gcse-england" as const,
    label: "GCSE (England)",
    description:
      "GCSE Mathematics, English Language, and Combined Science (biology, chemistry, and physics).",
  },
  {
    id: "igcse" as const,
    label: "iGCSE",
    description: "International GCSE Mathematics — the current iGCSE launch subject.",
  },
];

export const DEFERRED_ONBOARDING_QUALIFICATION_PATHS = [
  {
    id: "gcse-wales" as const,
    label: "GCSE (Wales)",
    description: "Wales GCSE route — same MVP subject set planned when this route opens.",
    statusNote: "Coming later",
  },
  {
    id: "gcse-northern-ireland" as const,
    label: "GCSE (Northern Ireland)",
    description: "Northern Ireland GCSE route — planned for a later release.",
    statusNote: "Coming later",
  },
];

/** School step nation picker during MVP — England only until Wales / NI routes ship. */
export const MVP_ONBOARDING_SCHOOL_NATIONS: SchoolNation[] = ["england"];

/** MVP launch subjects come from the student-visible content catalog only. */
export function qualificationPathToCatalogType(
  qualificationPath: QualificationPath,
): "GCSE" | "IGCSE" {
  return qualificationPath === "igcse" ? "IGCSE" : "GCSE";
}

export function listOnboardingSubjectsForQualificationPath(qualificationPath: QualificationPath) {
  const catalogType = qualificationPathToCatalogType(qualificationPath);

  return listStudentVisibleContentSubjects()
    .filter((subject) => subject.qualificationType === catalogType)
    .map((subject) => ({
      subjectId: subject.subjectId,
      name: subject.name,
      qualificationLabel: subject.qualificationType,
      description: subject.description,
    }));
}

export function filterOnboardingSubjectIds(
  subjectIds: string[],
  qualificationPath: QualificationPath,
): string[] {
  const allowedIds = new Set(
    listOnboardingSubjectsForQualificationPath(qualificationPath).map((subject) => subject.subjectId),
  );

  return subjectIds.filter((subjectId) => allowedIds.has(subjectId));
}

function mapCatalogSubjectsToOnboardingOptions() {
  return listStudentVisibleContentSubjects().map((subject) => ({
    subjectId: subject.subjectId,
    name: subject.name,
    qualificationLabel: subject.qualificationType,
    description: subject.description,
  }));
}

const MVP_SUPPORT_CHOICES: OnboardingSupportChoice[] = [
  {
    key: "wantsAccessibilitySupport",
    label: "Accessibility support",
    description:
      "Contrast, dyslexia-friendly font, focus mode, and reduced distraction — opens your accessibility settings.",
    href: "/accessibility",
    moduleLabel: "Accessibility module",
  },
  {
    key: "wantsAccessArrangementHelp",
    label: "Exam access arrangements",
    description:
      "Extra time, reader, scribe, and rest breaks — MVP foundation for exams and timed assessments (not a formal JCQ approval).",
    href: "/accessibility",
    moduleLabel: "Access Arrangements foundation",
  },
  {
    key: "sendSupportPathVisible",
    label: "SEND and support signposting",
    description:
      "Trusted UK support links and exam-stress guides in your first weeks — signposting only, not counselling.",
    href: "/support",
    moduleLabel: "Support Hub",
  },
];

export async function provisionMvpAccessSetupFromOnboarding(
  profile: LearnerOnboardingProfile,
): Promise<void> {
  if (!profile.wantsAccessibilitySupport && !profile.wantsAccessArrangementHelp) {
    return;
  }

  const current = await getStudentAccessProfile(profile.userId);
  const accessibilityPreferences = { ...current.accessibilityPreferences };

  if (profile.wantsAccessibilitySupport) {
    accessibilityPreferences.reducedDistractionModeEnabled = true;
    accessibilityPreferences.focusModeEnabled = true;
  }

  await updateStudentAccessProfile({
    ...current,
    accessibilityPreferences,
    textToSpeechEnabled:
      profile.wantsAccessArrangementHelp || profile.wantsAccessibilitySupport
        ? true
        : current.textToSpeechEnabled,
  });
}

export function buildOnboardingSupportSummary(profile: LearnerOnboardingProfile | null): {
  chips: string[];
  summary: string | null;
} {
  if (!profile?.completedAt) {
    return { chips: [], summary: null };
  }

  const chips: string[] = [];

  if (profile.wantsAccessibilitySupport) {
    chips.push("Accessibility setup");
  }
  if (profile.wantsAccessArrangementHelp) {
    chips.push("Access arrangement interest");
  }
  if (profile.sendSupportPathVisible) {
    chips.push("SEND support signposting");
  }

  if (chips.length === 0) {
    return { chips: [], summary: null };
  }

  return {
    chips,
    summary: `Onboarding flagged ${chips.join(", ").toLowerCase()} — review /accessibility and /support when you are ready.`,
  };
}

function isLaunchWalkthroughUser(userId: string): boolean {
  const launchUserId = process.env.SWITCH_LIVE_STUDENT_USER_ID?.trim();
  return Boolean(launchUserId && launchUserId === userId);
}

function createDefaultProfile(userId: string): LearnerOnboardingProfile {
  const now = new Date().toISOString();
  return {
    userId,
    learnerRole: "student",
    schoolPhase: "secondary",
    schoolName: "",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: [],
    wantsAccessibilitySupport: false,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: false,
    updatedAt: now,
  };
}

function createLaunchWalkthroughProfile(userId: string): LearnerOnboardingProfile {
  const qualificationPath = "gcse-england" as const;
  const subjects = listOnboardingSubjectsForQualificationPath(qualificationPath);
  const now = new Date().toISOString();
  return {
    userId,
    learnerRole: "student",
    schoolPhase: "secondary",
    schoolName: "Launch verification school",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath,
    selectedSubjectIds: subjects.map((subject) => subject.subjectId),
    wantsAccessibilitySupport: false,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: true,
    completedAt: now,
    updatedAt: now,
  };
}

export function getOnboardingOptions(): OnboardingOptions {
  return {
    learnerRoles: [
      {
        id: "student",
        label: "Student",
        description: "I am studying for GCSE or iGCSE exams.",
      },
      {
        id: "parent-guardian",
        label: "Parent or guardian",
        description: "I am helping a school-age learner set up their account.",
      },
      {
        id: "teacher-staff",
        label: "Teacher or staff",
        description: "I am supporting learners with revision and practice.",
      },
    ],
    yearGroups: YEAR_GROUPS,
    qualificationPaths: MVP_ONBOARDING_QUALIFICATION_PATHS,
    deferredQualificationPaths: DEFERRED_ONBOARDING_QUALIFICATION_PATHS,
    mvpSchoolNations: MVP_ONBOARDING_SCHOOL_NATIONS,
    subjects: mapCatalogSubjectsToOnboardingOptions(),
    schoolSources: SCHOOL_SOURCES,
    steps: ONBOARDING_STEPS,
    supportChoices: MVP_SUPPORT_CHOICES,
  };
}

export function isOnboardingProfileComplete(profile: LearnerOnboardingProfile | null): boolean {
  if (!profile?.completedAt) {
    return false;
  }

  return (
    profile.learnerRole.length > 0 &&
    profile.schoolName.trim().length > 0 &&
    profile.yearGroup.trim().length > 0 &&
    profile.selectedSubjectIds.length > 0 &&
    profile.ageOrConsentConfirmed
  );
}

function resolveNextStepIndex(profile: LearnerOnboardingProfile | null): number {
  if (!profile) {
    return 0;
  }

  if (profile.completedAt) {
    return ONBOARDING_STEPS.length - 1;
  }

  if (!profile.learnerRole) {
    return 0;
  }

  if (!profile.qualificationPath) {
    return 1;
  }

  if (!profile.yearGroup.trim()) {
    return 2;
  }

  if (!profile.schoolName.trim()) {
    return 3;
  }

  if (profile.selectedSubjectIds.length === 0) {
    return 4;
  }

  if (!profile.ageOrConsentConfirmed) {
    return 7;
  }

  return 7;
}

export async function getOnboardingOverview(userId: string): Promise<OnboardingOverview> {
  let profile = await getOnboardingProfileByUserId(userId);

  if (!profile && isLaunchWalkthroughUser(userId)) {
    profile = await saveOnboardingProfile(createLaunchWalkthroughProfile(userId));
  }

  const options = getOnboardingOptions();

  return {
    profile,
    isComplete: isOnboardingProfileComplete(profile),
    options,
    nextStepIndex: resolveNextStepIndex(profile),
  };
}

function normalizeProfileUpdate(
  userId: string,
  existing: LearnerOnboardingProfile | null,
  update: Partial<LearnerOnboardingProfile> & { complete?: boolean },
): LearnerOnboardingProfile {
  const base = existing ?? createDefaultProfile(userId);
  const now = new Date().toISOString();

  const merged: LearnerOnboardingProfile = {
    ...base,
    ...update,
    userId,
    learnerRole: (update.learnerRole ?? base.learnerRole) as LearnerRole,
    schoolPhase: (update.schoolPhase ?? base.schoolPhase ?? "secondary") as SchoolPhase,
    schoolNation: (update.schoolNation ?? base.schoolNation) as SchoolNation,
    qualificationPath: (update.qualificationPath ?? base.qualificationPath) as QualificationPath,
    selectedSubjectIds: filterOnboardingSubjectIds(
      update.selectedSubjectIds ?? base.selectedSubjectIds,
      (update.qualificationPath ?? base.qualificationPath) as QualificationPath,
    ),
    updatedAt: now,
  };

  if (update.complete === false) {
    merged.completedAt = undefined;
  }

  return merged;
}

export function validateOnboardingProfile(profile: LearnerOnboardingProfile): string | null {
  if (!profile.learnerRole) {
    return "Choose who is setting up this account.";
  }

  if (!profile.schoolName.trim()) {
    return "Enter your secondary school name.";
  }

  if (!profile.yearGroup.trim()) {
    return "Choose your year group.";
  }

  if (!profile.qualificationPath) {
    return "Choose your qualification path.";
  }

  if (profile.selectedSubjectIds.length === 0) {
    return "Select at least one subject.";
  }

  const allowedSubjects = listOnboardingSubjectsForQualificationPath(profile.qualificationPath);
  const allowedIds = new Set(allowedSubjects.map((subject) => subject.subjectId));

  if (profile.selectedSubjectIds.some((subjectId) => !allowedIds.has(subjectId))) {
    return "Select subjects that match your qualification route.";
  }

  if (!profile.ageOrConsentConfirmed) {
    return "Confirm age or consent before finishing setup.";
  }

  return null;
}

export async function updateOnboardingProfile(
  userId: string,
  update: Partial<LearnerOnboardingProfile> & { complete?: boolean },
): Promise<{ profile: LearnerOnboardingProfile; isComplete: boolean }> {
  const existing = await getOnboardingProfileByUserId(userId);
  const profile = normalizeProfileUpdate(userId, existing, update);

  if (update.complete) {
    const validationError = validateOnboardingProfile(profile);
    if (validationError) {
      throw new Error(validationError);
    }
    profile.completedAt = new Date().toISOString();
  }

  const saved = await saveOnboardingProfile(profile);

  if (update.complete && isOnboardingProfileComplete(saved)) {
    await provisionMvpAccessSetupFromOnboarding(saved);
  }

  return {
    profile: saved,
    isComplete: isOnboardingProfileComplete(saved),
  };
}

export async function requireOnboardingComplete(userId: string): Promise<LearnerOnboardingProfile> {
  const overview = await getOnboardingOverview(userId);

  if (!overview.profile || !overview.isComplete) {
    throw new Error("ONBOARDING_INCOMPLETE");
  }

  return overview.profile;
}

export function buildDashboardSetupSummary(profile: LearnerOnboardingProfile | null): {
  qualificationLabel: string;
  subjectFilterIds: string[];
  setupSummary: string;
} {
  if (!profile) {
    return {
      qualificationLabel: "GCSE",
      subjectFilterIds: [],
      setupSummary: "Complete onboarding to personalise your dashboard.",
    };
  }

  const qualification =
    profile.qualificationPath === "igcse"
      ? "iGCSE"
      : profile.qualificationPath.replace("gcse-", "GCSE ").replace("-", " ");

  return {
    qualificationLabel: qualification,
    subjectFilterIds: profile.selectedSubjectIds,
    setupSummary: `${profile.yearGroup} • ${qualification} • ${profile.selectedSubjectIds.length} subject${
      profile.selectedSubjectIds.length === 1 ? "" : "s"
    } selected`,
  };
}
