import type { ExamBoard } from "@/modules/access-arrangements";
import type { ExamPaper } from "@/modules/exam-engine/types";

import { qualificationPathToCatalogType } from "./service";
import type { LearnerOnboardingProfile, QualificationPath } from "./types";

/** Exam boards with seeded full-paper content in the current repo. */
const SEEDED_EXAM_BOARDS: Record<"GCSE" | "IGCSE", ExamBoard[]> = {
  GCSE: ["AQA", "Edexcel"],
  IGCSE: ["Cambridge IGCSE"],
};

export const SUBJECT_ID_TO_EXAM_SUBJECT: Record<string, string> = {
  "gcse-maths": "Mathematics",
  "gcse-english-language": "English Language",
  "igcse-maths": "Mathematics",
};

export function listOnboardingExamBoardOptions(qualificationPath: QualificationPath): ExamBoard[] {
  return SEEDED_EXAM_BOARDS[qualificationPathToCatalogType(qualificationPath)];
}

export function getDefaultExamBoard(qualificationPath: QualificationPath): ExamBoard {
  return listOnboardingExamBoardOptions(qualificationPath)[0] ?? "AQA";
}

export function resolveExamBoardForProfile(
  profile: Pick<LearnerOnboardingProfile, "qualificationPath" | "examBoard">,
): ExamBoard {
  const allowed = listOnboardingExamBoardOptions(profile.qualificationPath);

  if (profile.examBoard && allowed.includes(profile.examBoard)) {
    return profile.examBoard;
  }

  return getDefaultExamBoard(profile.qualificationPath);
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

export function buildExamAvailabilitySummary(
  papers: ExamPaper[],
  profile: Pick<
    LearnerOnboardingProfile,
    "qualificationPath" | "examBoard" | "selectedSubjectIds"
  >,
): string {
  const visible = filterExamPapersForOnboardingProfile(papers, profile);
  const board = resolveExamBoardForProfile(profile);

  if (visible.length === 0) {
    return "No full papers match this setup yet — more papers are being added to the live catalog.";
  }

  return `${visible.length} full paper${visible.length === 1 ? "" : "s"} ready for ${board} ${qualificationPathToCatalogType(profile.qualificationPath)} study.`;
}
