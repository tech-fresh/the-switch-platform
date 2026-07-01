import type { ExamBoard } from "@/modules/access-arrangements";

import { qualificationPathToCatalogType } from "./qualification-utils";
import type { LearnerOnboardingProfile, QualificationPath } from "./types";

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
