import type { ExamPaper, ExamSession } from "./types";

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
          { optionId: "b", label: "B", text: '"The single light blinked across the empty moor."' },
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
          { optionId: "b", label: "B", text: "It narrows the reader's attention and increases tension." },
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

export function getMockExamSession(examId: string): ExamSession {
  const paper = mockExamPapers.find((item) => item.examId === examId);

  if (!paper) {
    throw new Error(`Unknown mock exam paper: ${examId}`);
  }

  const baseResponses = paper.questions.map((question, index) => ({
    questionId: question.questionId,
    status: index === 0 ? ("in-progress" as const) : ("not-started" as const),
    selectedOptionId:
      examId === "aqa-maths-higher-paper-1" && question.questionId === "q1"
        ? "a"
        : undefined,
    flagged: question.questionId === "q2",
  }));

  const answeredCount = baseResponses.filter(
    (response) => response.selectedOptionId,
  ).length;

  return {
    examSessionId: `${examId}-session-001`,
    examId: paper.examId,
    userId: "student-demo",
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: "2026-06-05T09:08:00.000Z",
    durationMinutes: paper.durationMinutes,
    timeRemainingMinutes: Math.max(paper.durationMinutes - (18 + answeredCount), 12),
    questionResponses: baseResponses,
  };
}
