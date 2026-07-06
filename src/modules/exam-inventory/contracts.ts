import type { ExamInventoryPaper, ExamInventorySummary } from "./types";

export type ExamInventoryContractRoute =
  | "GET /exams/inventory"
  | "GET /exams/papers";

export interface GetExamInventoryResponse {
  summary: ExamInventorySummary;
  papers: ExamInventoryPaper[];
}
