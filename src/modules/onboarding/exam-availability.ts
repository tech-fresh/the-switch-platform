import type { ExamPaper } from "@/modules/exam-engine/types";

import {
  getDefaultExamBoard,
  listOnboardingExamBoardOptions,
  resolveExamBoardForProfile,
} from "./exam-board-options";
import {
  filterExamPapersForOnboardingProfile,
  SUBJECT_ID_TO_EXAM_SUBJECT,
} from "./personalization";
import { qualificationPathToCatalogType } from "./qualification-utils";
import type { LearnerOnboardingProfile } from "./types";

export {
  getDefaultExamBoard,
  listOnboardingExamBoardOptions,
  resolveExamBoardForProfile,
  SUBJECT_ID_TO_EXAM_SUBJECT,
  filterExamPapersForOnboardingProfile,
};

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
