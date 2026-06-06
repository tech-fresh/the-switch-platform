import type { ExamPaper, ExamSession } from "./types";

export type ExamEngineContractRoute =
  | "GET /exams/papers"
  | "GET /exams/session/:examId";

export interface GetExamPapersResponse {
  papers: ExamPaper[];
}

export interface GetExamSessionResponse {
  session: ExamSession;
}
