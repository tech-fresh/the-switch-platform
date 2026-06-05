import type { AssessmentWithAccessArrangements } from "@/modules/access-arrangements";

export interface TimedAssessmentAttempt {
  attemptId: string;
  assessmentId: string;
  userId: string;
  accessArrangements?: AssessmentWithAccessArrangements;
}
