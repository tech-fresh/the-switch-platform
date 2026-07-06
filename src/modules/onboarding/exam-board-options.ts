import type { ExamBoard } from "@/modules/access-arrangements";
import { listInventoryExamBoardsForQualificationPath } from "@/modules/exam-inventory/board-options";

import type { LearnerOnboardingProfile, QualificationPath } from "./types";

export function listOnboardingExamBoardOptions(qualificationPath: QualificationPath): ExamBoard[] {
  return listInventoryExamBoardsForQualificationPath(qualificationPath);
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
