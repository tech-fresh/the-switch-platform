import { applyAccessArrangementsToExam } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import { getSavedProgress, saveExamProgress } from "@/modules/saved-progress/service";
import type { SavedProgressRepository } from "@/modules/saved-progress/types";
import type { ExamPaper, ExamQuestionResponse, ExamSession } from "./types";

const mockExamPapers: ExamPaper[] = [
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
    questions: [
      {
        questionId: "q1",
        number: 1,
        topic: "Algebra",
        prompt:
          "Expand and simplify: 3(2x - 5) + 4(x + 1). Which answer is correct?",
        marks: 2,
        type: "multiple-choice",
        options: [
          { optionId: "a", label: "A", text: "10x - 11" },
          { optionId: "b", label: "B", text: "6x - 1" },
          { optionId: "c", label: "C", text: "10x - 19" },
          { optionId: "d", label: "D", text: "7x - 11" },
        ],
        guidance: "Show the expansion of each bracket before combining terms.",
      },
      {
        questionId: "q2",
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
        guidance:
          "Convert the scaled distance into centimetres first, then into kilometres.",
      },
      {
        questionId: "q3",
        number: 3,
        topic: "Coordinate Geometry",
        prompt:
          "Point A is at (2, -1) and point B is at (8, 11). What is the midpoint of AB?",
        marks: 2,
        type: "multiple-choice",
        options: [
          { optionId: "a", label: "A", text: "(5, 10)" },
          { optionId: "b", label: "B", text: "(6, 5)" },
          { optionId: "c", label: "C", text: "(5, 5)" },
          { optionId: "d", label: "D", text: "(10, 12)" },
        ],
      },
      {
        questionId: "q4",
        number: 4,
        topic: "Functions",
        prompt:
          "The function f(x) = 2x + 3. Work out f(7). Which answer is correct?",
        marks: 1,
        type: "multiple-choice",
        options: [
          { optionId: "a", label: "A", text: "10" },
          { optionId: "b", label: "B", text: "14" },
          { optionId: "c", label: "C", text: "17" },
          { optionId: "d", label: "D", text: "21" },
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
    questions: [
      {
        questionId: "q1",
        number: 1,
        topic: "Inference",
        prompt:
          "Which statement best matches the writer's view of the storm in the extract?",
        marks: 1,
        type: "multiple-choice",
        options: [
          { optionId: "a", label: "A", text: "It is calming and familiar." },
          { optionId: "b", label: "B", text: "It feels sudden and dangerous." },
          { optionId: "c", label: "C", text: "It is exaggerated for humour." },
          { optionId: "d", label: "D", text: "It has already passed." },
        ],
      },
      {
        questionId: "q2",
        number: 2,
        topic: "Language Analysis",
        prompt:
          "Which quotation would be strongest evidence that the setting feels isolated?",
        marks: 2,
        type: "multiple-choice",
        options: [
          { optionId: "a", label: "A", text: '"Cars hurried by in every lane."' },
          {
            optionId: "b",
            label: "B",
            text: '"The single light blinked across the empty moor."',
          },
          { optionId: "c", label: "C", text: '"Children shouted from the playground."' },
          { optionId: "d", label: "D", text: '"Music spilled from the open door."' },
        ],
      },
      {
        questionId: "q3",
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
      },
    ],
  },
];

export function getMockExamPapers(): ExamPaper[] {
  return mockExamPapers;
}

export async function getMockExamSession(
  examId: string,
  options?: {
    userId?: string;
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const paper = mockExamPapers.find((item) => item.examId === examId);

  if (!paper) {
    throw new Error(`Unknown mock exam paper: ${examId}`);
  }

  const userId = options?.userId ?? "student-demo";
  const seededResponses = buildSeededResponses(examId, paper.questions.map((question) => question.questionId));
  const answeredCount = seededResponses.filter((response) => response.selectedOptionId).length;

  const appliedExam = await applyAccessArrangementsToExam(
    {
      examId: paper.examId,
      userId,
      officialDurationMinutes: paper.durationMinutes,
      qualificationType: paper.qualificationType,
      examBoard: paper.board,
      tier: paper.tier,
    },
    options?.accessProfileRepository,
  );

  const baseSession: ExamSession = {
    examSessionId: `${examId}-session-001`,
    examId: paper.examId,
    userId,
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: "2026-06-05T09:08:00.000Z",
    durationMinutes: appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes: Math.max(
      appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes - (18 + answeredCount),
      12,
    ),
    accessArrangements: appliedExam,
    questionResponses: seededResponses,
  };

  const resumedSession = await hydrateSessionFromSavedProgress(
    baseSession,
    options?.savedProgressRepository,
  );

  await saveExamProgress(
    {
      userId: resumedSession.userId,
      examSessionId: resumedSession.examSessionId,
      currentQuestionId: getCurrentQuestionId(resumedSession),
      questionResponses: resumedSession.questionResponses,
      timeRemainingMinutes: resumedSession.timeRemainingMinutes,
      accessArrangementSnapshot:
        resumedSession.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    options?.savedProgressRepository,
  );

  return resumedSession;
}

function buildSeededResponses(
  examId: string,
  questionIds: string[],
): ExamQuestionResponse[] {
  return questionIds.map((questionId, index) => ({
    questionId,
    status: index === 0 ? "in-progress" : "not-started",
    selectedOptionId:
      examId === "aqa-maths-higher-paper-1" && questionId === "q1" ? "a" : undefined,
    flagged: questionId === "q2",
  }));
}

async function hydrateSessionFromSavedProgress(
  session: ExamSession,
  repository?: SavedProgressRepository,
): Promise<ExamSession> {
  const savedProgress = await getSavedProgress(
    session.userId,
    "exam-session",
    session.examSessionId,
    repository,
  );

  if (!savedProgress?.examProgress) {
    return session;
  }

  return {
    ...session,
    lastSavedAt: savedProgress.lastActivityAt,
    timeRemainingMinutes: savedProgress.examProgress.timeRemainingMinutes,
    questionResponses: savedProgress.examProgress.questionResponses,
  };
}

function getCurrentQuestionId(session: ExamSession): string {
  const firstActiveResponse = session.questionResponses.find(
    (response) => response.status !== "not-started" || response.selectedOptionId,
  );

  return firstActiveResponse?.questionId ?? session.questionResponses[0]?.questionId ?? "";
}
