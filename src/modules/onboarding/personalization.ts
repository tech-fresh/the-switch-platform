import type { ExamBoard } from "@/modules/access-arrangements";
import type { MvpCatalogSubject } from "@/modules/content/types";
import type { ExamPaper } from "@/modules/exam-engine/types";
import type { PowerGridSubjectProgress } from "@/modules/power-grid/types";
import type { TimedAssessmentDefinition } from "@/modules/timed-assessment/types";

import { getCombinedScienceVariationLabel } from "./combined-science-variation-options";
import { resolveExamBoardForProfile } from "./exam-board-options";
import { qualificationPathToCatalogType } from "./qualification-utils";
import type { LearnerOnboardingProfile, StudyGoal } from "./types";

/** Maps onboarding catalog subject ids to exam paper subject labels. */
export const SUBJECT_ID_TO_EXAM_SUBJECT: Record<string, string> = {
  "gcse-maths": "Mathematics",
  "gcse-english-language": "English Language",
  "gcse-combined-science": "Combined Science",
  "igcse-maths": "Mathematics",
};

/** Maps onboarding catalog subject ids to timed-assessment subject labels. */
export const SUBJECT_ID_TO_ASSESSMENT_SUBJECT: Record<string, string> = {
  "gcse-maths": "Mathematics",
  "gcse-english-language": "English Language",
  "gcse-combined-science": "Combined Science",
  "igcse-maths": "iGCSE Mathematics",
};

const STUDY_GOAL_LABELS: Record<StudyGoal, string> = {
  "exam-readiness": "Get exam ready",
  "build-confidence": "Build confidence",
  "steady-progress": "Keep steady progress",
};

const STUDY_GOAL_DASHBOARD_MESSAGES: Record<StudyGoal, string> = {
  "exam-readiness":
    "Your Mission Control prioritises full papers and timed checkpoints so you can build exam timing and fluency.",
  "build-confidence":
    "Your Mission Control emphasises topic revision and confidence-building practice before harder papers.",
  "steady-progress":
    "Your Mission Control keeps a steady weekly rhythm across the subjects you chose during setup.",
};

export interface OnboardingPersonalizationContext {
  isActive: boolean;
  subjectFilterIds: string[];
  qualificationLabel: string;
  examBoard: ExamBoard | null;
  studyGoalLabel: string;
  studyGoalMessage: string;
  setupSummary: string;
  primarySubjectId: string | null;
  primarySubjectHref: string;
  examAvailabilitySummary: string;
}

export function isOnboardingPersonalizationActive(
  profile: Pick<LearnerOnboardingProfile, "completedAt"> | null | undefined,
): profile is LearnerOnboardingProfile {
  return Boolean(profile?.completedAt);
}

export function resolveStudyGoalLabel(studyGoal: StudyGoal): string {
  return STUDY_GOAL_LABELS[studyGoal];
}

export function resolveStudyGoalDashboardMessage(studyGoal: StudyGoal): string {
  return STUDY_GOAL_DASHBOARD_MESSAGES[studyGoal];
}

export function buildOnboardingPersonalizationContext(
  profile: LearnerOnboardingProfile | null | undefined,
  papers: ExamPaper[],
): OnboardingPersonalizationContext {
  if (!isOnboardingPersonalizationActive(profile)) {
    return {
      isActive: false,
      subjectFilterIds: [],
      qualificationLabel: "GCSE",
      examBoard: null,
      studyGoalLabel: "",
      studyGoalMessage: "Complete onboarding to personalise your dashboard.",
      setupSummary: "Complete onboarding to personalise your dashboard.",
      primarySubjectId: null,
      primarySubjectHref: "/subjects",
      examAvailabilitySummary: "",
    };
  }

  const qualificationLabel =
    profile.qualificationPath === "igcse"
      ? "iGCSE"
      : profile.qualificationPath.replace("gcse-", "GCSE ").replace("-", " ");
  const examBoard = resolveExamBoardForProfile(profile);
  const visiblePapers = filterExamPapersForOnboardingProfile(papers, profile);
  const primarySubjectId = profile.selectedSubjectIds[0] ?? null;

  return {
    isActive: true,
    subjectFilterIds: profile.selectedSubjectIds,
    qualificationLabel,
    examBoard,
    studyGoalLabel: resolveStudyGoalLabel(profile.studyGoal),
    studyGoalMessage: resolveStudyGoalDashboardMessage(profile.studyGoal),
    setupSummary: `${profile.yearGroup} • ${qualificationLabel} • ${examBoard}${profile.combinedScienceVariation ? ` • ${getCombinedScienceVariationLabel(profile.combinedScienceVariation)}` : ""} • ${profile.selectedSubjectIds.length} subject${
      profile.selectedSubjectIds.length === 1 ? "" : "s"
    } selected`,
    primarySubjectId,
    primarySubjectHref: primarySubjectId
      ? `/subjects?subjectId=${encodeURIComponent(primarySubjectId)}`
      : "/subjects",
    examAvailabilitySummary:
      visiblePapers.length === 0
        ? "No full papers match this setup yet — more papers are being added to the live catalog."
        : `${visiblePapers.length} full paper${visiblePapers.length === 1 ? "" : "s"} ready for ${examBoard} ${qualificationPathToCatalogType(profile.qualificationPath)} study.`,
  };
}

export function filterExamPapersForOnboardingProfile(
  papers: ExamPaper[],
  profile: Pick<
    LearnerOnboardingProfile,
    "qualificationPath" | "examBoard" | "selectedSubjectIds"
  >,
): ExamPaper[] {
  const catalogType = qualificationPathToCatalogType(profile.qualificationPath);
  const board = resolveExamBoardForProfile(profile);

  const byRoute = papers.filter(
    (paper) => paper.qualificationType === catalogType && paper.board === board,
  );

  if (byRoute.length === 0) {
    return papers.filter((paper) => paper.qualificationType === catalogType);
  }

  const examSubjects = profile.selectedSubjectIds
    .map((subjectId) => SUBJECT_ID_TO_EXAM_SUBJECT[subjectId])
    .filter(Boolean);

  if (examSubjects.length === 0) {
    return byRoute;
  }

  const bySubjects = byRoute.filter((paper) => examSubjects.includes(paper.subject));
  return bySubjects.length > 0 ? bySubjects : byRoute;
}

export function filterAssessmentsForOnboardingProfile(
  assessments: TimedAssessmentDefinition[],
  profile: Pick<
    LearnerOnboardingProfile,
    "qualificationPath" | "examBoard" | "selectedSubjectIds"
  >,
): TimedAssessmentDefinition[] {
  const catalogType = qualificationPathToCatalogType(profile.qualificationPath);
  const board = resolveExamBoardForProfile(profile);

  const byRoute = assessments.filter(
    (assessment) => assessment.qualificationType === catalogType && assessment.examBoard === board,
  );

  if (byRoute.length === 0) {
    return assessments.filter((assessment) => assessment.qualificationType === catalogType);
  }

  const assessmentSubjects = profile.selectedSubjectIds
    .map((subjectId) => SUBJECT_ID_TO_ASSESSMENT_SUBJECT[subjectId])
    .filter(Boolean);

  if (assessmentSubjects.length === 0) {
    return byRoute;
  }

  const bySubjects = byRoute.filter((assessment) => assessmentSubjects.includes(assessment.subject));
  return bySubjects.length > 0 ? bySubjects : byRoute;
}

export function filterCatalogSubjectsForOnboardingProfile(
  subjects: MvpCatalogSubject[],
  profile: Pick<LearnerOnboardingProfile, "selectedSubjectIds" | "completedAt"> | null | undefined,
): MvpCatalogSubject[] {
  if (!isOnboardingPersonalizationActive(profile)) {
    return subjects;
  }

  if (profile.selectedSubjectIds.length === 0) {
    return subjects;
  }

  const allowed = new Set(profile.selectedSubjectIds);
  const filtered = subjects.filter((subject) => allowed.has(subject.subjectId));
  return filtered.length > 0 ? filtered : subjects;
}

export function filterPowerGridSubjectProgressForOnboardingProfile(
  subjectProgress: PowerGridSubjectProgress[],
  profile: Pick<LearnerOnboardingProfile, "selectedSubjectIds" | "completedAt"> | null | undefined,
  catalogSubjects: MvpCatalogSubject[],
): PowerGridSubjectProgress[] {
  if (!isOnboardingPersonalizationActive(profile) || profile.selectedSubjectIds.length === 0) {
    return subjectProgress;
  }

  const allowedNames = new Set(
    catalogSubjects
      .filter((subject) => profile.selectedSubjectIds.includes(subject.subjectId))
      .map((subject) => subject.name),
  );

  const filtered = subjectProgress.filter((subject) => allowedNames.has(subject.subject));
  return filtered.length > 0 ? filtered : subjectProgress;
}

export function isSubjectAllowedForOnboardingProfile(
  subjectId: string | undefined,
  subjectName: string,
  profile: Pick<LearnerOnboardingProfile, "selectedSubjectIds" | "completedAt"> | null | undefined,
  catalogSubjects: MvpCatalogSubject[],
): boolean {
  if (!isOnboardingPersonalizationActive(profile) || profile.selectedSubjectIds.length === 0) {
    return true;
  }

  if (subjectId && profile.selectedSubjectIds.includes(subjectId)) {
    return true;
  }

  const catalogSubject = catalogSubjects.find(
    (subject) => subject.name === subjectName || subject.subjectId === subjectId,
  );

  return catalogSubject ? profile.selectedSubjectIds.includes(catalogSubject.subjectId) : false;
}
