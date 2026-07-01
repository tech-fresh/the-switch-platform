import type { ExamPaper, ExamQuestion } from "./types";

export interface ExamQuestionSlot {
  slotId: string;
  number: number;
  topic: string;
  marks: number;
  type: "multiple-choice";
  guidance?: string;
  variants: ExamQuestion[];
}

export interface ExamPaperBlueprint extends Omit<ExamPaper, "questions"> {
  questionSlots: ExamQuestionSlot[];
}
