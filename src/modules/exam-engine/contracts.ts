import type { ExamPaper, ExamSession } from "./types";

export type ExamEngineContractRoute =
  | "GET /exams/papers"
  | "GET /exams/session/:examId"
  | "PATCH /exams/session/:examId"
  | "POST /exams/session/:examId"
  | "PUT /exams/session/:examId";

export interface GetExamPapersResponse {
  papers: ExamPaper[];
}

export interface GetExamSessionResponse {
  session: ExamSession;
}

export interface SaveExamSessionRequest {
  examSessionId: string;
  currentQuestionId: string;
  questionResponses: ExamSession["questionResponses"];
  timeRemainingMinutes: number;
}

export interface SaveExamSessionResponse {
  session: ExamSession;
}

export interface SubmitExamSessionResponse {
  sessionId: string;
  status: "submitted";
}

export interface StartFreshExamSessionResponse {
  session: ExamSession;
}
