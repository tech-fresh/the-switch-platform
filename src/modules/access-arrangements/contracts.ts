import type {
  AccessArrangementApplication,
  AssessmentAccessArrangementInput,
  AssessmentWithAccessArrangements,
  ExamAccessArrangementInput,
  ExamWithAccessArrangements,
  SavedProgressAccessArrangementSnapshot,
  StudentAccessProfile,
} from "./types";

export type AccessArrangementRoute =
  | "GET /access-profile/:userId"
  | "PUT /access-profile/:userId"
  | "POST /access-arrangements/apply/assessment"
  | "POST /access-arrangements/apply/exam";

export interface GetStudentAccessProfileRequest {
  userId: string;
}

export interface GetStudentAccessProfileResponse {
  profile: StudentAccessProfile;
}

export interface UpdateStudentAccessProfileRequest {
  userId: string;
  profile: StudentAccessProfile;
}

export interface UpdateStudentAccessProfileResponse {
  profile: StudentAccessProfile;
}

export interface ApplyAccessArrangementsToAssessmentRequest {
  assessment: AssessmentAccessArrangementInput;
}

export interface ApplyAccessArrangementsToAssessmentResponse {
  assessment: AssessmentWithAccessArrangements;
}

export interface ApplyAccessArrangementsToExamRequest {
  exam: ExamAccessArrangementInput;
}

export interface ApplyAccessArrangementsToExamResponse {
  exam: ExamWithAccessArrangements;
}

export interface ExamEngineAccessArrangementContract {
  userId: string;
  examId: string;
  officialDurationMinutes: number;
  accessArrangementApplication: AccessArrangementApplication;
}

export interface TimedAssessmentAccessArrangementContract {
  userId: string;
  assessmentId: string;
  selectedDurationMinutes: number;
  maximumOfficialDurationMinutes: number;
  accessArrangementApplication: AccessArrangementApplication;
}

export interface SavedProgressAccessArrangementContract {
  userId: string;
  assessmentOrExamId: string;
  assessmentOrExamType: "timed-assessment" | "full-exam";
  accessArrangementSnapshot: SavedProgressAccessArrangementSnapshot;
}

export interface ReadAloudAccessArrangementContract {
  userId: string;
  enabled: boolean;
  readingSpeed: number;
  source: AccessArrangementApplication["readAloud"]["source"];
}

export interface AccessibilityAccessArrangementContract {
  userId: string;
  preferences: AccessArrangementApplication["accessibility"];
}
