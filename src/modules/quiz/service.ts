import type { QuizQuestion } from "./types";

const mockQuizQuestions: QuizQuestion[] = [
  {
    questionId: "quiz-maths-algebra-1",
    topicId: "maths-algebra",
    prompt: "Which expression is equivalent to 5(x + 2) - x?",
    options: [
      { optionId: "a", label: "A", text: "4x + 2" },
      { optionId: "b", label: "B", text: "4x + 10" },
      { optionId: "c", label: "C", text: "5x + 2" },
      { optionId: "d", label: "D", text: "6x + 10" },
    ],
    correctOptionId: "b",
  },
  {
    questionId: "quiz-maths-ratio-1",
    topicId: "maths-ratio",
    prompt: "A ratio is 2:3. If the total is 20, what is the larger part?",
    options: [
      { optionId: "a", label: "A", text: "8" },
      { optionId: "b", label: "B", text: "10" },
      { optionId: "c", label: "C", text: "12" },
      { optionId: "d", label: "D", text: "15" },
    ],
    correctOptionId: "c",
  },
  {
    questionId: "quiz-english-language-analysis-1",
    topicId: "english-language-analysis",
    prompt: "What is the strongest opening move in a language analysis paragraph?",
    options: [
      { optionId: "a", label: "A", text: "Summarise the plot" },
      { optionId: "b", label: "B", text: "Choose a short quotation and identify the writer's method" },
      { optionId: "c", label: "C", text: "State your final judgement only" },
      { optionId: "d", label: "D", text: "List every adjective in the extract" },
    ],
    correctOptionId: "b",
  },
  {
    questionId: "quiz-english-structure-1",
    topicId: "english-structure",
    prompt: "What should you track first in a structure answer?",
    options: [
      { optionId: "a", label: "A", text: "Every adjective in the extract" },
      { optionId: "b", label: "B", text: "How the focus of the text moves" },
      { optionId: "c", label: "C", text: "The writer's favourite punctuation mark" },
      { optionId: "d", label: "D", text: "The exact number of paragraphs only" },
    ],
    correctOptionId: "b",
  },
  {
    questionId: "quiz-science-chemical-changes-1",
    topicId: "science-chemical-changes",
    prompt: "What helps you decide if a displacement reaction will happen?",
    options: [
      { optionId: "a", label: "A", text: "The colour of the solution" },
      { optionId: "b", label: "B", text: "The reactivity series" },
      { optionId: "c", label: "C", text: "The mass number only" },
      { optionId: "d", label: "D", text: "The test tube size" },
    ],
    correctOptionId: "b",
  },
  {
    questionId: "quiz-science-energy-1",
    topicId: "science-energy",
    prompt: "In an efficiency question, what should you compare?",
    options: [
      { optionId: "a", label: "A", text: "Useful output against total input" },
      { optionId: "b", label: "B", text: "Only the wasted output" },
      { optionId: "c", label: "C", text: "Mass against temperature" },
      { optionId: "d", label: "D", text: "Voltage against colour" },
    ],
    correctOptionId: "a",
  },
];

export function getMockQuizQuestion(topicId: string): QuizQuestion {
  const question = mockQuizQuestions.find((item) => item.topicId === topicId);

  if (!question) {
    throw new Error(`Unknown mock quiz question for topic: ${topicId}`);
  }

  return question;
}
