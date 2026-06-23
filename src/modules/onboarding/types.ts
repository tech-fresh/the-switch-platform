export type LearnerRole = "student" | "parent-guardian" | "teacher-staff";

export type SchoolNation =
  | "england"
  | "scotland"
  | "wales"
  | "northern-ireland";

export type QualificationPath =
  | "gcse-england"
  | "gcse-wales"
  | "gcse-northern-ireland"
  | "igcse";

export interface SchoolSourceLink {
  nation: SchoolNation;
  label: string;
  href: string;
}

export interface LearnerOnboardingProfile {
  userId: string;
  learnerRole: LearnerRole;
  schoolName: string;
  schoolNation: SchoolNation;
  yearGroup: string;
  qualificationPath: QualificationPath;
  selectedSubjectIds: string[];
  wantsAccessibilitySupport: boolean;
  wantsAccessArrangementHelp: boolean;
  sendSupportPathVisible: boolean;
  guardianInviteEmail?: string;
  ageOrConsentConfirmed: boolean;
  completedAt?: string;
  updatedAt: string;
}

export interface OnboardingOptions {
  learnerRoles: Array<{ id: LearnerRole; label: string; description: string }>;
  yearGroups: string[];
  qualificationPaths: Array<{ id: QualificationPath; label: string; description: string }>;
  subjects: Array<{
    subjectId: string;
    name: string;
    qualificationLabel: string;
    description?: string;
  }>;
  schoolSources: SchoolSourceLink[];
  steps: string[];
  supportChoices: OnboardingSupportChoice[];
}

export interface OnboardingSupportChoice {
  key: "wantsAccessibilitySupport" | "wantsAccessArrangementHelp" | "sendSupportPathVisible";
  label: string;
  description: string;
  href: string;
  moduleLabel: string;
}

export interface OnboardingOverview {
  profile: LearnerOnboardingProfile | null;
  isComplete: boolean;
  options: OnboardingOptions;
  nextStepIndex: number;
}
