import { applyAccessArrangementsToExam } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import { listSavedProgressByUser, saveExamProgress } from "@/modules/saved-progress/service";
import type { SavedProgressRecord, SavedProgressRepository } from "@/modules/saved-progress/types";
import type {
  ExamPaper,
  ExamQuestion,
  ExamQuestionResponse,
  ExamSession,
  ExamSessionGenerationSummary,
} from "./types";

interface ExamPaperBlueprint extends Omit<ExamPaper, "questions"> {
  questionSlots: ExamQuestionSlot[];
}

interface ExamQuestionSlot {
  slotId: string;
  number: number;
  topic: string;
  marks: number;
  type: "multiple-choice";
  guidance?: string;
  variants: ExamQuestion[];
}

const mockExamPaperBlueprints: ExamPaperBlueprint[] = [
  {
    examId: "aqa-maths-higher-paper-1",
    title: "GCSE Mathematics",
    subject: "Mathematics",
    board: "AQA",
    qualificationType: "GCSE",
    tier: "HIGHER",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 90,
    totalMarks: 80,
    skillsFocus: ["Algebra", "Ratio", "Coordinate Geometry"],
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Algebra",
        marks: 2,
        type: "multiple-choice",
        guidance: "Show the expansion of each bracket before combining terms.",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 3(2x - 5) + 4(x + 1). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10x - 11" },
              { optionId: "b", label: "B", text: "6x - 1" },
              { optionId: "c", label: "C", text: "10x - 19" },
              { optionId: "d", label: "D", text: "7x - 11" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v1",
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 2(3x + 4) - (x - 5). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "5x + 9" },
              { optionId: "b", label: "B", text: "6x + 13" },
              { optionId: "c", label: "C", text: "5x + 13" },
              { optionId: "d", label: "D", text: "7x - 1" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v2",
          },
          {
            questionId: "q1-v3",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 5(x - 2) + 2(2x + 3). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "9x - 4" },
              { optionId: "b", label: "B", text: "7x + 1" },
              { optionId: "c", label: "C", text: "9x - 10" },
              { optionId: "d", label: "D", text: "7x - 7" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v3",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Ratio",
        marks: 3,
        type: "multiple-choice",
        guidance: "Convert the scaled distance into centimetres first, then into kilometres.",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Ratio",
            prompt:
              "A map uses a scale of 1:25,000. Two towns are 7.2 cm apart on the map. How many kilometres apart are they in real life?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "1.8 km" },
              { optionId: "b", label: "B", text: "18 km" },
              { optionId: "c", label: "C", text: "180 km" },
              { optionId: "d", label: "D", text: "0.18 km" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v1",
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Ratio",
            prompt:
              "A recipe uses the ratio 3:5 for flour to sugar. If 240 g of sugar is used, how much flour is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "90 g" },
              { optionId: "b", label: "B", text: "144 g" },
              { optionId: "c", label: "C", text: "160 g" },
              { optionId: "d", label: "D", text: "400 g" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v2",
          },
          {
            questionId: "q2-v3",
            number: 2,
            topic: "Ratio",
            prompt:
              "Blue paint and white paint are mixed in the ratio 4:7. If 28 litres of blue paint are used, how much white paint is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "35 litres" },
              { optionId: "b", label: "B", text: "42 litres" },
              { optionId: "c", label: "C", text: "49 litres" },
              { optionId: "d", label: "D", text: "56 litres" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v3",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Coordinate Geometry",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point A is at (2, -1) and point B is at (8, 11). What is the midpoint of AB?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(5, 10)" },
              { optionId: "b", label: "B", text: "(6, 5)" },
              { optionId: "c", label: "C", text: "(5, 5)" },
              { optionId: "d", label: "D", text: "(10, 12)" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v1",
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point C is at (-4, 6) and point D is at (2, 10). What is the midpoint of CD?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(-1, 8)" },
              { optionId: "b", label: "B", text: "(-2, 16)" },
              { optionId: "c", label: "C", text: "(3, 4)" },
              { optionId: "d", label: "D", text: "(-6, 2)" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v2",
          },
          {
            questionId: "q3-v3",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point E is at (1, 3) and point F is at (9, -5). What is the midpoint of EF?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(8, -2)" },
              { optionId: "b", label: "B", text: "(4, -1)" },
              { optionId: "c", label: "C", text: "(5, -1)" },
              { optionId: "d", label: "D", text: "(10, -8)" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v3",
          },
        ],
      },
      {
        slotId: "q4",
        number: 4,
        topic: "Functions",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q4-v1",
            number: 4,
            topic: "Functions",
            prompt: "The function f(x) = 2x + 3. Work out f(7). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10" },
              { optionId: "b", label: "B", text: "14" },
              { optionId: "c", label: "C", text: "17" },
              { optionId: "d", label: "D", text: "21" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v1",
          },
          {
            questionId: "q4-v2",
            number: 4,
            topic: "Functions",
            prompt: "The function g(x) = 3x - 4. Work out g(6). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10" },
              { optionId: "b", label: "B", text: "14" },
              { optionId: "c", label: "C", text: "18" },
              { optionId: "d", label: "D", text: "22" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v2",
          },
          {
            questionId: "q4-v3",
            number: 4,
            topic: "Functions",
            prompt: "The function h(x) = x + 9. Work out h(5). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "4" },
              { optionId: "b", label: "B", text: "9" },
              { optionId: "c", label: "C", text: "14" },
              { optionId: "d", label: "D", text: "45" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v3",
          },
        ],
      },
    ],
  },
  {
    examId: "edexcel-english-paper-1",
    title: "GCSE English Language",
    subject: "English Language",
    board: "Edexcel",
    qualificationType: "GCSE",
    tier: "FOUNDATION",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 105,
    totalMarks: 64,
    skillsFocus: ["Inference", "Language Analysis", "Structure"],
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Inference",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the writer's view of the storm in the extract?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It is calming and familiar." },
              { optionId: "b", label: "B", text: "It feels sudden and dangerous." },
              { optionId: "c", label: "C", text: "It is exaggerated for humour." },
              { optionId: "d", label: "D", text: "It has already passed." },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v1",
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the narrator's view of the abandoned house?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels safe and welcoming." },
              { optionId: "b", label: "B", text: "It seems expensive but empty." },
              { optionId: "c", label: "C", text: "It appears unsettling and secretive." },
              { optionId: "d", label: "D", text: "It reminds them of school." },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v2",
          },
          {
            questionId: "q1-v3",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the writer's view of the market at noon?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels crowded and relentless." },
              { optionId: "b", label: "B", text: "It seems silent and empty." },
              { optionId: "c", label: "C", text: "It is presented as magical." },
              { optionId: "d", label: "D", text: "It has already closed." },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v3",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Language Analysis",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the setting feels isolated?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"Cars hurried by in every lane.\"" },
              { optionId: "b", label: "B", text: "\"The single light blinked across the empty moor.\"" },
              { optionId: "c", label: "C", text: "\"Children shouted from the playground.\"" },
              { optionId: "d", label: "D", text: "\"Music spilled from the open door.\"" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v1",
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the character feels trapped?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"She danced into the square.\"" },
              { optionId: "b", label: "B", text: "\"The locked gate pressed cold against her hands.\"" },
              { optionId: "c", label: "C", text: "\"The sky widened above the field.\"" },
              { optionId: "d", label: "D", text: "\"Laughter rolled through the hall.\"" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v2",
          },
          {
            questionId: "q2-v3",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the beach feels threatening?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"The tide clawed at the broken pier.\"" },
              { optionId: "b", label: "B", text: "\"Children built towers in the sand.\"" },
              { optionId: "c", label: "C", text: "\"The sun warmed the rocks.\"" },
              { optionId: "d", label: "D", text: "\"A gull floated lazily above.\"" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v3",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Structure",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from a wide description of the landscape to a close-up of the window latch?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It speeds up the ending." },
              {
                optionId: "b",
                label: "B",
                text: "It narrows the reader's attention and increases tension.",
              },
              { optionId: "c", label: "C", text: "It makes the scene more humorous." },
              { optionId: "d", label: "D", text: "It reveals the narrator is unreliable." },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v1",
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from the busy station platform to one silent suitcase left behind?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It slows the pace and focuses suspense." },
              { optionId: "b", label: "B", text: "It proves the narrator is lying." },
              { optionId: "c", label: "C", text: "It removes all sense of mystery." },
              { optionId: "d", label: "D", text: "It changes the text into comedy." },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v2",
          },
          {
            questionId: "q3-v3",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from the noisy classroom to the final image of one unopened letter?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It lightens the mood with humour." },
              { optionId: "b", label: "B", text: "It broadens the focus to many characters." },
              { optionId: "c", label: "C", text: "It sharpens the reader's attention onto a key detail." },
              { optionId: "d", label: "D", text: "It removes all tension from the scene." },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v3",
          },
        ],
      },
    ],
  },
];

export function getMockExamPapers(): ExamPaper[] {
  return mockExamPaperBlueprints.map((paper) => ({
    ...paper,
    questions: paper.questionSlots.map((slot) => slot.variants[0]),
  }));
}

export function getMockExamSessionId(examId: string, attemptNumber = 1): string {
  return `${examId}-session-${String(attemptNumber).padStart(3, "0")}`;
}

export async function getMockExamSession(
  examId: string,
  options?: {
    userId?: string;
    startFreshAttempt?: boolean;
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const blueprint = mockExamPaperBlueprints.find((item) => item.examId === examId);

  if (!blueprint) {
    throw new Error(`Unknown mock exam paper: ${examId}`);
  }

  const userId = options?.userId ?? "student-demo";
  const examHistory = await listExamHistory(userId, examId, options?.savedProgressRepository);
  const latestRecord = examHistory[0];

  if (latestRecord && !options?.startFreshAttempt) {
    return buildSessionFromRecord(blueprint, latestRecord, examHistory.slice(1), userId, options);
  }

  const attemptNumber = (latestRecord ? parseAttemptNumber(latestRecord.entityId) : 0) + 1;
  const questions = buildGeneratedQuestionSet(blueprint, examHistory);
  const seededResponses = buildSeededResponses(examId, questions);
  const answeredCount = seededResponses.filter((response) => response.selectedOptionId).length;
  const appliedExam = await applyAccessArrangementsToExam(
    {
      examId: blueprint.examId,
      userId,
      officialDurationMinutes: blueprint.durationMinutes,
      qualificationType: blueprint.qualificationType,
      examBoard: blueprint.board,
      tier: blueprint.tier,
    },
    options?.accessProfileRepository,
  );

  const session: ExamSession = {
    examSessionId: getMockExamSessionId(examId, attemptNumber),
    examId: blueprint.examId,
    userId,
    attemptNumber,
    status: "in-progress",
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: "2026-06-05T09:08:00.000Z",
    durationMinutes: appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes: Math.max(
      appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes - (18 + answeredCount),
      12,
    ),
    accessArrangements: appliedExam,
    questions,
    questionResponses: seededResponses,
    generationSummary: buildGenerationSummary(questions, examHistory),
  };

  await saveExamProgress(
    {
      userId: session.userId,
      examSessionId: session.examSessionId,
      currentQuestionId: getCurrentQuestionId(session),
      questionSet: session.questions,
      questionResponses: session.questionResponses,
      timeRemainingMinutes: session.timeRemainingMinutes,
      status: session.status,
      accessArrangementSnapshot:
        session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    options?.savedProgressRepository,
  );

  return session;
}

export async function saveMockExamSession(
  examId: string,
  input: {
    examSessionId: string;
    currentQuestionId: string;
    questionResponses: ExamQuestionResponse[];
    timeRemainingMinutes: number;
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const session = await getMockExamSession(examId, {
    userId: input.userId,
    savedProgressRepository: input.savedProgressRepository,
  });

  if (session.examSessionId !== input.examSessionId) {
    throw new Error("Exam session mismatch while saving progress.");
  }

  const nextSession: ExamSession = {
    ...session,
    lastSavedAt: new Date().toISOString(),
    timeRemainingMinutes: Math.max(
      0,
      Math.min(input.timeRemainingMinutes, session.durationMinutes),
    ),
    questionResponses: input.questionResponses,
  };

  await saveExamProgress(
    {
      userId: nextSession.userId,
      examSessionId: nextSession.examSessionId,
      currentQuestionId: input.currentQuestionId,
      questionSet: nextSession.questions,
      questionResponses: nextSession.questionResponses,
      timeRemainingMinutes: nextSession.timeRemainingMinutes,
      status: nextSession.status,
      accessArrangementSnapshot:
        nextSession.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    input.savedProgressRepository,
  );

  return nextSession;
}

async function buildSessionFromRecord(
  blueprint: ExamPaperBlueprint,
  record: SavedProgressRecord,
  priorHistory: SavedProgressRecord[],
  userId: string,
  options?: {
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const appliedExam = await applyAccessArrangementsToExam(
    {
      examId: blueprint.examId,
      userId,
      officialDurationMinutes: blueprint.durationMinutes,
      qualificationType: blueprint.qualificationType,
      examBoard: blueprint.board,
      tier: blueprint.tier,
    },
    options?.accessProfileRepository,
  );

  const fallbackQuestions = buildGeneratedQuestionSet(blueprint, []);
  const questions = record.examProgress?.questionSet?.length
    ? record.examProgress.questionSet
    : fallbackQuestions;
  const generationSummary = buildGenerationSummary(questions, priorHistory);

  const session: ExamSession = {
    examSessionId: record.entityId,
    examId: blueprint.examId,
    userId,
    attemptNumber: parseAttemptNumber(record.entityId),
    status: record.status === "submitted" ? "submitted" : "in-progress",
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: record.lastActivityAt,
    durationMinutes: appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes:
      record.examProgress?.timeRemainingMinutes ??
      appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    accessArrangements: appliedExam,
    questions,
    questionResponses: record.examProgress?.questionResponses ?? buildSeededResponses(blueprint.examId, questions),
    generationSummary,
  };

  if (session.status !== "submitted") {
    await saveExamProgress(
      {
        userId: session.userId,
        examSessionId: session.examSessionId,
        currentQuestionId: getCurrentQuestionId(session),
        questionSet: session.questions,
        questionResponses: session.questionResponses,
        timeRemainingMinutes: session.timeRemainingMinutes,
        status: session.status,
        accessArrangementSnapshot:
          session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
      },
      options?.savedProgressRepository,
    );
  }

  return session;
}

function buildGeneratedQuestionSet(
  blueprint: ExamPaperBlueprint,
  history: SavedProgressRecord[],
): ExamQuestion[] {
  const recentQuestionKeys = history
    .slice(0, 2)
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);
  const allQuestionKeys = history
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);

  return blueprint.questionSlots.map((slot) => {
    const variant = [...slot.variants].sort((left, right) => {
      const leftKey = left.sourceQuestionKey ?? left.questionId;
      const rightKey = right.sourceQuestionKey ?? right.questionId;
      const leftRecentPenalty = recentQuestionKeys.includes(leftKey) ? 1 : 0;
      const rightRecentPenalty = recentQuestionKeys.includes(rightKey) ? 1 : 0;

      if (leftRecentPenalty !== rightRecentPenalty) {
        return leftRecentPenalty - rightRecentPenalty;
      }

      const leftSeenCount = allQuestionKeys.filter((key) => key === leftKey).length;
      const rightSeenCount = allQuestionKeys.filter((key) => key === rightKey).length;

      if (leftSeenCount !== rightSeenCount) {
        return leftSeenCount - rightSeenCount;
      }

      return leftKey.localeCompare(rightKey);
    })[0];

    return {
      ...variant,
      number: slot.number,
      topic: slot.topic,
      marks: slot.marks,
      type: slot.type,
      guidance: variant.guidance ?? slot.guidance,
    };
  });
}

function buildSeededResponses(
  examId: string,
  questions: ExamQuestion[],
): ExamQuestionResponse[] {
  return questions.map((question, index) => ({
    questionId: question.questionId,
    status: index === 0 ? "in-progress" : "not-started",
    selectedOptionId: getSeededAnswerSelection(examId, question),
    workingNotes: getSeededWorkingNotes(examId, question),
    flagged: question.number === 2,
  }));
}

function getSeededAnswerSelection(examId: string, question: ExamQuestion): string | undefined {
  if (examId === "aqa-maths-higher-paper-1" && question.number === 1) {
    return question.correctOptionId;
  }

  return undefined;
}

function getSeededWorkingNotes(examId: string, question: ExamQuestion): string | undefined {
  if (examId === "aqa-maths-higher-paper-1" && question.topic === "Ratio") {
    return "Convert or scale the quantities first, then check whether the final unit stays in grams, litres, or kilometres.";
  }

  if (examId === "edexcel-english-paper-1" && question.topic === "Language Analysis") {
    return "Choose the quotation that most strongly matches the effect, not just a quotation from the same setting.";
  }

  return undefined;
}

function buildGenerationSummary(
  questions: ExamQuestion[],
  history: SavedProgressRecord[],
): ExamSessionGenerationSummary {
  const historicalKeys = history
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);

  return {
    strategy: "topic-repeat-question-rotate",
    reusedQuestionCount: questions.filter((question) =>
      historicalKeys.includes(question.sourceQuestionKey ?? question.questionId),
    ).length,
    repeatedTopicCount:
      questions.length - new Set(questions.map((question) => question.topic)).size,
    questionSourceKeys: questions.map((question) => question.sourceQuestionKey ?? question.questionId),
  };
}

async function listExamHistory(
  userId: string,
  examId: string,
  repository?: SavedProgressRepository,
): Promise<SavedProgressRecord[]> {
  const records = await listSavedProgressByUser(userId, repository);

  return records
    .filter(
      (record) =>
        record.entityType === "exam-session" &&
        record.entityId.startsWith(`${examId}-session-`) &&
        record.examProgress,
    )
    .sort((left, right) => parseAttemptNumber(right.entityId) - parseAttemptNumber(left.entityId));
}

function parseAttemptNumber(entityId: string): number {
  const match = entityId.match(/-session-(\d+)$/);

  return match ? Number(match[1]) : 1;
}

function getCurrentQuestionId(session: ExamSession): string {
  const firstActiveResponse = session.questionResponses.find(
    (response) => response.status !== "not-started" || response.selectedOptionId,
  );

  return firstActiveResponse?.questionId ?? session.questionResponses[0]?.questionId ?? "";
}
