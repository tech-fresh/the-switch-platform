import { listStudentVisibleContentSubjects } from "@/modules/content/service";

import { getOnboardingProfileByUserId, saveOnboardingProfile } from "./repository";
import type {
  LearnerOnboardingProfile,
  LearnerRole,
  OnboardingOptions,
  OnboardingOverview,
  QualificationPath,
  SchoolNation,
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

function isLaunchWalkthroughUser(userId: string): boolean {
  const launchUserId = process.env.SWITCH_LIVE_STUDENT_USER_ID?.trim();
  return Boolean(launchUserId && launchUserId === userId);
}

function createDefaultProfile(userId: string): LearnerOnboardingProfile {
  const now = new Date().toISOString();
  return {
    userId,
    learnerRole: "student",
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
  const subjects = listStudentVisibleContentSubjects();
  const now = new Date().toISOString();
  return {
    userId,
    learnerRole: "student",
    schoolName: "Launch verification school",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: subjects.slice(0, 3).map((subject) => subject.subjectId),
    wantsAccessibilitySupport: false,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: true,
    completedAt: now,
    updatedAt: now,
  };
}

export function getOnboardingOptions(): OnboardingOptions {
  const subjects = listStudentVisibleContentSubjects();

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
    qualificationPaths: [
      {
        id: "gcse-england",
        label: "GCSE (England)",
        description: "England GCSE route with the main platform subject catalog.",
      },
      {
        id: "gcse-wales",
        label: "GCSE (Wales)",
        description: "Wales GCSE route with qualification-aware dashboard setup.",
      },
      {
        id: "gcse-northern-ireland",
        label: "GCSE (Northern Ireland)",
        description: "Northern Ireland GCSE route with qualification-aware setup.",
      },
      {
        id: "igcse",
        label: "iGCSE",
        description: "International GCSE route including iGCSE topic coverage.",
      },
    ],
    subjects: subjects.map((subject) => ({
      subjectId: subject.subjectId,
      name: subject.name,
      qualificationLabel: subject.qualificationType,
    })),
    schoolSources: SCHOOL_SOURCES,
    steps: ONBOARDING_STEPS,
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
    schoolNation: (update.schoolNation ?? base.schoolNation) as SchoolNation,
    qualificationPath: (update.qualificationPath ?? base.qualificationPath) as QualificationPath,
    selectedSubjectIds: update.selectedSubjectIds ?? base.selectedSubjectIds,
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
    return "Enter your school name.";
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
