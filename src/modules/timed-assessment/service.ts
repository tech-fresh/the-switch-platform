import { applyAccessArrangementsToAssessment } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import { getSavedProgress, saveTimedAssessmentProgress } from "@/modules/saved-progress/service";
import type { SavedProgressRepository } from "@/modules/saved-progress/types";
import type {
  CreateTimedAssessmentAttemptInput,
  TimedAssessmentAttempt,
  TimedAssessmentAttemptSeed,
  TimedAssessmentDefinition,
  TimedAssessmentQuestion,
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
    questionCount: 6,
  },
  {
    assessmentId: "edexcel-english-inference-practice",
    title: "Inference Practice",
    subject: "English Language",
    qualificationType: "GCSE",
    examBoard: "Edexcel",
    tier: "FOUNDATION",
    officialDurationMinutes: 35,
    questionCount: 4,
  },
];

const mockTimedAssessmentQuestions: Record<string, TimedAssessmentQuestion[]> = {
  "aqa-maths-algebra-checkpoint": [
    {
      questionId: "q1",
      number: 1,
      topic: "Expanding brackets",
      prompt: "Expand and simplify: 4(2x - 3) + x. Which answer is correct?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "9x - 12" },
        { optionId: "b", label: "B", text: "8x - 3" },
        { optionId: "c", label: "C", text: "8x - 12" },
        { optionId: "d", label: "D", text: "5x - 3" },
      ],
      correctOptionId: "a",
      guidance: "Expand the bracket first, then combine the like terms.",
    },
    {
      questionId: "q2",
      number: 2,
      topic: "Solving equations",
      prompt: "Solve 3x + 5 = 20. Which answer is correct?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "x = 15" },
        { optionId: "b", label: "B", text: "x = 5" },
        { optionId: "c", label: "C", text: "x = 25" },
        { optionId: "d", label: "D", text: "x = 3" },
      ],
      correctOptionId: "b",
      guidance: "Undo the addition before dividing by the coefficient of x.",
    },
    {
      questionId: "q3",
      number: 3,
      topic: "Substitution",
      prompt: "If a = 4 and b = -2, work out 3a - b. Which answer is correct?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "6" },
        { optionId: "b", label: "B", text: "10" },
        { optionId: "c", label: "C", text: "14" },
        { optionId: "d", label: "D", text: "16" },
      ],
      correctOptionId: "c",
    },
    {
      questionId: "q4",
      number: 4,
      topic: "Factorising",
      prompt: "Factorise 5x + 15. Which answer is correct?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "5(x + 3)" },
        { optionId: "b", label: "B", text: "15(x + 1)" },
        { optionId: "c", label: "C", text: "5(x + 15)" },
        { optionId: "d", label: "D", text: "x(5 + 15)" },
      ],
      correctOptionId: "a",
      guidance: "Look for the highest common factor shared by both terms.",
    },
    {
      questionId: "q5",
      number: 5,
      topic: "Inequalities",
      prompt: "Solve 2x - 1 > 7. Which answer is correct?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "x > 3" },
        { optionId: "b", label: "B", text: "x > 4" },
        { optionId: "c", label: "C", text: "x < 3" },
        { optionId: "d", label: "D", text: "x < 4" },
      ],
      correctOptionId: "b",
    },
    {
      questionId: "q6",
      number: 6,
      topic: "Sequences",
      prompt: "What is the next term in the sequence 7, 11, 15, 19, ... ?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "21" },
        { optionId: "b", label: "B", text: "23" },
        { optionId: "c", label: "C", text: "24" },
        { optionId: "d", label: "D", text: "25" },
      ],
      correctOptionId: "b",
    },
  ],
  "edexcel-english-inference-practice": [
    {
      questionId: "q1",
      number: 1,
      topic: "Inference",
      prompt: "Which statement best matches the narrator's view of the station platform?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "It feels calm and welcoming." },
        { optionId: "b", label: "B", text: "It feels tense and overcrowded." },
        { optionId: "c", label: "C", text: "It feels playful and bright." },
        { optionId: "d", label: "D", text: "It feels empty and silent." },
      ],
      correctOptionId: "b",
    },
    {
      questionId: "q2",
      number: 2,
      topic: "Evidence selection",
      prompt: "Which quotation best suggests the setting feels isolated?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "\"Music drifted through the open square.\"" },
        { optionId: "b", label: "B", text: "\"The last cottage light faded against the empty hill.\"" },
        { optionId: "c", label: "C", text: "\"Voices echoed around the market.\"" },
        { optionId: "d", label: "D", text: "\"The bell rang for lunchtime.\"" },
      ],
      correctOptionId: "b",
      guidance: "Choose the line that most strongly supports the exact effect in the question.",
    },
    {
      questionId: "q3",
      number: 3,
      topic: "Inference",
      prompt: "Which statement best matches the writer's view of the abandoned boat?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "It is shown as harmless and ordinary." },
        { optionId: "b", label: "B", text: "It is shown as unsettling and suspicious." },
        { optionId: "c", label: "C", text: "It is shown as valuable and luxurious." },
        { optionId: "d", label: "D", text: "It is shown as cheerful and exciting." },
      ],
      correctOptionId: "b",
    },
    {
      questionId: "q4",
      number: 4,
      topic: "Language analysis",
      prompt: "Which quotation best shows the sea is threatening?",
      type: "multiple-choice",
      options: [
        { optionId: "a", label: "A", text: "\"The tide clawed at the stones below.\"" },
        { optionId: "b", label: "B", text: "\"Children laughed beside the shore.\"" },
        { optionId: "c", label: "C", text: "\"Clouds drifted softly above the bay.\"" },
        { optionId: "d", label: "D", text: "\"A gull circled lazily in the sun.\"" },
      ],
      correctOptionId: "a",
      guidance: "Look for the quotation whose wording creates the strongest sense of danger.",
    },
  ],
};

export function getMockTimedAssessments(): TimedAssessmentDefinition[] {
  return mockTimedAssessments;
}

export function getMockTimedAssessmentAttemptId(
  assessmentId: string,
  userId = "student-demo",
): string {
  return `${assessmentId}-attempt-${userId}`;
}

export function getMockTimedAssessmentQuestions(
  assessmentId: string,
): TimedAssessmentQuestion[] {
  const questions = mockTimedAssessmentQuestions[assessmentId];

  if (!questions) {
    throw new Error(`Unknown mock timed assessment questions: ${assessmentId}`);
  }

  return questions.map((question) => ({
    ...question,
    options: question.options.map((option) => ({ ...option })),
  }));
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
  const questions = getMockTimedAssessmentQuestions(assessmentId);
  const seededState = buildSeededAttemptState(assessmentId);
  const resumedAttempt = await hydrateAttemptFromSavedProgress(
    attempt,
    questions,
    options?.savedProgressRepository,
  );
  const effectiveState = resumedAttempt.savedState ?? seededState;

  await saveTimedAssessmentProgress(
    {
      userId: resumedAttempt.attempt.userId,
      assessmentAttemptId: resumedAttempt.attempt.attemptId,
      currentQuestionId: effectiveState.currentQuestionId,
      selectedDurationMinutes: resumedAttempt.attempt.selectedDurationMinutes,
      questionSet: questions,
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
    questions,
    ...effectiveState,
  };
}

export async function saveMockTimedAssessmentAttempt(
  assessmentId: string,
  input: {
    attemptId: string;
    currentQuestionId?: string;
    selectedDurationMinutes: number;
    selectedAnswerIds: string[];
    writtenAnswers: Record<string, string>;
    notes: Record<string, string>;
    bookmarkedQuestionIds: string[];
    timeRemainingMinutes: number;
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<TimedAssessmentAttemptSeed> {
  const seed = await getMockTimedAssessmentAttemptSeed(assessmentId, {
    userId: input.userId,
    selectedDurationMinutes: input.selectedDurationMinutes,
    savedProgressRepository: input.savedProgressRepository,
  });

  if (seed.attempt.attemptId !== input.attemptId) {
    throw new Error("Timed assessment attempt mismatch while saving progress.");
  }

  const nextAttempt: TimedAssessmentAttempt = {
    ...seed.attempt,
    status: "in-progress",
    lastSavedAt: new Date().toISOString(),
    timeRemainingMinutes: Math.max(
      0,
      Math.min(input.timeRemainingMinutes, seed.attempt.adjustedDurationMinutes),
    ),
  };

  await saveTimedAssessmentProgress(
    {
      userId: nextAttempt.userId,
      assessmentAttemptId: nextAttempt.attemptId,
      currentQuestionId: input.currentQuestionId,
      selectedDurationMinutes: nextAttempt.selectedDurationMinutes,
      questionSet: seed.questions,
      selectedAnswerIds: input.selectedAnswerIds,
      writtenAnswers: input.writtenAnswers,
      notes: input.notes,
      bookmarkedQuestionIds: input.bookmarkedQuestionIds,
      timeRemainingMinutes: nextAttempt.timeRemainingMinutes,
      accessArrangementSnapshot:
        nextAttempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
      status: nextAttempt.status,
    },
    input.savedProgressRepository,
  );

  return {
    attempt: nextAttempt,
    questions: seed.questions,
    currentQuestionId: input.currentQuestionId,
    selectedAnswerIds: input.selectedAnswerIds,
    writtenAnswers: input.writtenAnswers,
    notes: input.notes,
    bookmarkedQuestionIds: input.bookmarkedQuestionIds,
  };
}

export async function submitMockTimedAssessmentAttempt(
  assessmentId: string,
  input: {
    attemptId: string;
    currentQuestionId?: string;
    selectedDurationMinutes: number;
    selectedAnswerIds: string[];
    writtenAnswers: Record<string, string>;
    notes: Record<string, string>;
    bookmarkedQuestionIds: string[];
    timeRemainingMinutes: number;
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<TimedAssessmentAttemptSeed> {
  const savedSeed = await saveMockTimedAssessmentAttempt(assessmentId, input);
  const submittedAttempt: TimedAssessmentAttempt = {
    ...savedSeed.attempt,
    status: "submitted",
    lastSavedAt: new Date().toISOString(),
  };

  await saveTimedAssessmentProgress(
    {
      userId: submittedAttempt.userId,
      assessmentAttemptId: submittedAttempt.attemptId,
      currentQuestionId: input.currentQuestionId,
      selectedDurationMinutes: submittedAttempt.selectedDurationMinutes,
      questionSet: savedSeed.questions,
      selectedAnswerIds: input.selectedAnswerIds,
      writtenAnswers: input.writtenAnswers,
      notes: input.notes,
      bookmarkedQuestionIds: input.bookmarkedQuestionIds,
      timeRemainingMinutes: submittedAttempt.timeRemainingMinutes,
      accessArrangementSnapshot:
        submittedAttempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
      status: submittedAttempt.status,
    },
    input.savedProgressRepository,
  );

  return {
    ...savedSeed,
    attempt: submittedAttempt,
  };
}

function buildSeededAttemptState(
  assessmentId: string,
): Omit<TimedAssessmentAttemptSeed, "attempt" | "questions"> {
  if (assessmentId === "aqa-maths-algebra-checkpoint") {
    return {
      selectedAnswerIds: ["q1:a", "q2:c", "q4:b"],
      writtenAnswers: {},
      notes: {
        q5: "Recheck the inequality direction after rearranging.",
      },
      bookmarkedQuestionIds: ["q5"],
      currentQuestionId: "q6",
    };
  }

  return {
    selectedAnswerIds: ["q1:b", "q3:b"],
    writtenAnswers: {},
    notes: {
      q4: "Return to the language question if time remains.",
    },
    bookmarkedQuestionIds: ["q4"],
    currentQuestionId: "q4",
  };
}

async function hydrateAttemptFromSavedProgress(
  attempt: TimedAssessmentAttempt,
  questions: TimedAssessmentQuestion[],
  repository?: SavedProgressRepository,
): Promise<{
  attempt: TimedAssessmentAttempt;
  savedState?: Omit<TimedAssessmentAttemptSeed, "attempt" | "questions">;
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

  const fallbackQuestionId = questions[0]?.questionId;

  return {
    attempt: {
      ...attempt,
      status: savedProgress.status === "submitted" ? "submitted" : "in-progress",
      lastSavedAt: savedProgress.lastActivityAt,
      timeRemainingMinutes: savedProgress.timedAssessmentProgress.timeRemainingMinutes,
    },
    savedState: {
      currentQuestionId:
        savedProgress.timedAssessmentProgress.currentQuestionId ?? fallbackQuestionId,
      selectedAnswerIds: savedProgress.timedAssessmentProgress.selectedAnswerIds,
      writtenAnswers: savedProgress.timedAssessmentProgress.writtenAnswers,
      notes: savedProgress.timedAssessmentProgress.notes,
      bookmarkedQuestionIds: savedProgress.timedAssessmentProgress.bookmarkedQuestionIds,
    },
  };
}
