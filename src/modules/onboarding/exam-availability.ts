import type { ExamBoard } from "@/modules/access-arrangements";
import type { ExamPaper } from "@/modules/exam-engine/types";

import {
  filterExamPapersForOnboardingProfile,
  SUBJECT_ID_TO_EXAM_SUBJECT,
} from "./personalization";
import { qualificationPathToCatalogType } from "./service";
import type { LearnerOnboardingProfile, QualificationPath } from "./types";

export { SUBJECT_ID_TO_EXAM_SUBJECT, filterExamPapersForOnboardingProfile };

/** Exam boards with seeded full-paper content in the current repo. */
const SEEDED_EXAM_BOARDS: Record<"GCSE" | "IGCSE", ExamBoard[]> = {
  GCSE: ["AQA", "Edexcel"],
  IGCSE: ["Cambridge IGCSE"],
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
