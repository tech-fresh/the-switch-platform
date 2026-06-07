import { applyAccessArrangementsToAssessment } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import { getSavedProgress, saveTimedAssessmentProgress } from "@/modules/saved-progress/service";
import type { SavedProgressRepository } from "@/modules/saved-progress/types";
import type {
  CreateTimedAssessmentAttemptInput,
  TimedAssessmentAttempt,
  TimedAssessmentAttemptSeed,
  TimedAssessmentDefinition,
} from "./types";

const mockTimedAssessments: TimedAssessmentDefinition[] = [
  {
    assessmentId: "aqa-maths-algebra-checkpoint",
    title: "Algebra Checkpoint",
    subject: "Mathematics",
    qualificationType: "GCSE",
    examBoard: "AQA",
    tier: "HIGHER",
    officialDurationMinutes: 45,
    questionCount: 18,
  },
  {
    assessmentId: "edexcel-english-inference-practice",
    title: "Inference Practice",
    subject: "English Language",
    qualificationType: "GCSE",
    examBoard: "Edexcel",
    tier: "FOUNDATION",
    officialDurationMinutes: 35,
    questionCount: 12,
  },
];

export function getMockTimedAssessments(): TimedAssessmentDefinition[] {
  return mockTimedAssessments;
}

export function getMockTimedAssessmentAttemptId(
  assessmentId: string,
  userId = "student-demo",
): string {
  return `${assessmentId}-attempt-${userId}`;
}

export async function createTimedAssessmentAttempt(
  input: CreateTimedAssessmentAttemptInput,
  accessProfileRepository?: StudentAccessProfileRepository,
): Promise<TimedAssessmentAttempt> {
  const arrangementApplication = await applyAccessArrangementsToAssessment(
    {
      assessmentId: input.assessment.assessmentId,
      userId: input.userId,
      durationMinutes: input.selectedDurationMinutes,
      maximumOfficialDurationMinutes: input.assessment.officialDurationMinutes,
      qualificationType: input.assessment.qualificationType,
      examBoard: input.assessment.examBoard,
      tier: input.assessment.tier,
    },
    accessProfileRepository,
  );

  const now = new Date().toISOString();

  return {
    attemptId: getMockTimedAssessmentAttemptId(input.assessment.assessmentId, input.userId),
    assessmentId: input.assessment.assessmentId,
    userId: input.userId,
    selectedDurationMinutes: arrangementApplication.durationMinutes,
    adjustedDurationMinutes:
      arrangementApplication.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes:
      arrangementApplication.accessArrangementApplication.duration.adjustedDurationMinutes,
    status: "not-started",
    startedAt: now,
    lastSavedAt: now,
    accessArrangements: arrangementApplication,
  };
}

export async function getMockTimedAssessmentAttemptSeed(
  assessmentId: string,
  options?: {
    userId?: string;
    selectedDurationMinutes?: number;
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<TimedAssessmentAttemptSeed> {
  const assessment = mockTimedAssessments.find((item) => item.assessmentId === assessmentId);

  if (!assessment) {
    throw new Error(`Unknown mock timed assessment: ${assessmentId}`);
  }

  const userId = options?.userId ?? "student-demo";
  const selectedDurationMinutes =
    options?.selectedDurationMinutes ?? Math.min(assessment.officialDurationMinutes, 30);

  const attempt = await createTimedAssessmentAttempt(
    {
      assessment,
      userId,
      selectedDurationMinutes,
    },
    options?.accessProfileRepository,
  );

  const seededState = buildSeededAttemptState(assessmentId, assessment.questionCount);
  const resumedAttempt = await hydrateAttemptFromSavedProgress(
    attempt,
    options?.savedProgressRepository,
  );

  const effectiveState = resumedAttempt.savedState ?? seededState;

  await saveTimedAssessmentProgress(
    {
      userId: resumedAttempt.attempt.userId,
      assessmentAttemptId: resumedAttempt.attempt.attemptId,
      currentQuestionId: effectiveState.currentQuestionId,
      selectedDurationMinutes: resumedAttempt.attempt.selectedDurationMinutes,
      selectedAnswerIds: effectiveState.selectedAnswerIds,
      writtenAnswers: effectiveState.writtenAnswers,
      notes: effectiveState.notes,
      bookmarkedQuestionIds: effectiveState.bookmarkedQuestionIds,
      timeRemainingMinutes: resumedAttempt.attempt.timeRemainingMinutes,
      accessArrangementSnapshot:
        resumedAttempt.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
      status: resumedAttempt.attempt.status === "not-started" ? "in-progress" : resumedAttempt.attempt.status,
    },
    options?.savedProgressRepository,
  );

  return {
    attempt: resumedAttempt.attempt,
    ...effectiveState,
  };
}

function buildSeededAttemptState(
  assessmentId: string,
  questionCount: number,
): Omit<TimedAssessmentAttemptSeed, "attempt"> {
  const questionIds = Array.from({ length: questionCount }, (_, index) => `q${index + 1}`);

  return {
    selectedAnswerIds:
      assessmentId === "aqa-maths-algebra-checkpoint" ? ["q1:a", "q2:c", "q4:b"] : ["q1:b", "q3:b"],
    writtenAnswers:
      assessmentId === "edexcel-english-inference-practice"
        ? {
            q2: "The isolated light makes the setting feel exposed and distant.",
          }
        : {},
    notes:
      assessmentId === "aqa-maths-algebra-checkpoint"
        ? {
            q5: "Recheck sign changes before choosing final answer.",
          }
        : {
            q4: "Return to structure question if time remains.",
          },
    bookmarkedQuestionIds: questionIds.filter((questionId) => questionId === "q5" || questionId === "q4"),
    currentQuestionId: assessmentId === "aqa-maths-algebra-checkpoint" ? "q6" : "q4",
  };
}

async function hydrateAttemptFromSavedProgress(
  attempt: TimedAssessmentAttempt,
  repository?: SavedProgressRepository,
): Promise<{
  attempt: TimedAssessmentAttempt;
  savedState?: Omit<TimedAssessmentAttemptSeed, "attempt">;
}> {
  const savedProgress = await getSavedProgress(
    attempt.userId,
    "timed-assessment-attempt",
    attempt.attemptId,
    repository,
  );

  if (!savedProgress?.timedAssessmentProgress) {
    return {
      attempt: {
        ...attempt,
        status: "in-progress",
      },
    };
  }

  return {
    attempt: {
      ...attempt,
      status:
        savedProgress.status === "submitted" ? "submitted" : "in-progress",
      lastSavedAt: savedProgress.lastActivityAt,
      timeRemainingMinutes: savedProgress.timedAssessmentProgress.timeRemainingMinutes,
    },
    savedState: {
      currentQuestionId: savedProgress.timedAssessmentProgress.currentQuestionId,
      selectedAnswerIds: savedProgress.timedAssessmentProgress.selectedAnswerIds,
      writtenAnswers: savedProgress.timedAssessmentProgress.writtenAnswers,
      notes: savedProgress.timedAssessmentProgress.notes,
      bookmarkedQuestionIds: savedProgress.timedAssessmentProgress.bookmarkedQuestionIds,
    },
  };
}
