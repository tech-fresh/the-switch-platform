export type LearnerRole = "student" | "parent-guardian" | "teacher-staff";

export type SchoolPhase = "secondary";

export type SchoolNation =
  | "england"
  | "scotland"
  | "wales"
  | "northern-ireland";

import type { ExamBoard } from "@/modules/access-arrangements";

export type QualificationPath =
  | "gcse-england"
  | "gcse-wales"
  | "gcse-northern-ireland"
  | "igcse";

export type StudyGoal = "exam-readiness" | "build-confidence" | "steady-progress";

export interface SchoolSourceLink {
  nation: SchoolNation;
  label: string;
  href: string;
}

export interface LearnerOnboardingProfile {
  userId: string;
  learnerRole: LearnerRole;
  /** MVP captures secondary schools only — primary and other phases are later. */
  schoolPhase: SchoolPhase;
  schoolName: string;
  schoolNation: SchoolNation;
  yearGroup: string;
  qualificationPath: QualificationPath;
  /** Drives which seeded full papers appear on `/exams`. */
  examBoard: ExamBoard;
  /** Personalises dashboard messaging — collected during setup. */
  studyGoal: StudyGoal;
  selectedSubjectIds: string[];
  wantsAccessibilitySupport: boolean;
  wantsAccessArrangementHelp: boolean;
  sendSupportPathVisible: boolean;
  guardianInviteEmail?: string;
  ageOrConsentConfirmed: boolean;
  completedAt?: string;
  updatedAt: string;
}

export interface OnboardingQualificationOption {
  id: QualificationPath;
  label: string;
  description: string;
}

export interface DeferredOnboardingQualificationOption extends OnboardingQualificationOption {
  statusNote: string;
}

export interface OnboardingStudyGoalOption {
  id: StudyGoal;
  label: string;
  description: string;
}

export interface OnboardingOptions {
  learnerRoles: Array<{ id: LearnerRole; label: string; description: string }>;
  studyGoals: OnboardingStudyGoalOption[];
  yearGroups: string[];
  /** Active MVP routes — shown as selectable in onboarding step 1. */
  qualificationPaths: OnboardingQualificationOption[];
  /** Wales / Northern Ireland GCSE routes — signposted only until a later release. */
  deferredQualificationPaths: DeferredOnboardingQualificationOption[];
  /** Nations selectable on the school step during MVP (England only). */
  mvpSchoolNations: SchoolNation[];
  subjects: Array<{
    subjectId: string;
    name: string;
    qualificationLabel: string;
    description?: string;
  }>;
  schoolSources: SchoolSourceLink[];
  steps: string[];
  dashboardCreationStepLabels: string[];
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
