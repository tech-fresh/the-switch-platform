import type { ExamWithAccessArrangements } from "@/modules/access-arrangements";

export interface ExamSession {
  examSessionId: string;
  examId: string;
  userId: string;
  accessArrangements?: ExamWithAccessArrangements;
}
