import examInventorySeedJson from "@/data/exam-paper-inventory.json";
import type { ExamBoard } from "@/modules/access-arrangements";
import type { QualificationPath } from "@/modules/onboarding/types";

import type { ExamInventorySeed } from "./types";

const examInventorySeed = examInventorySeedJson as ExamInventorySeed;

export function listInventoryExamBoardsForQualificationPath(
  qualificationPath: QualificationPath,
): ExamBoard[] {
  return unique(
    examInventorySeed.entries
      .filter(
        (entry) =>
          entry.qualificationPath === qualificationPath &&
          entry.status === "live" &&
          entry.studentVisibility,
      )
      .map((entry) => entry.board),
  );
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
