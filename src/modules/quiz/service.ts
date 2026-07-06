import { getDefaultQuizProgressRepository } from "@/lib/server/repositories";
import { getStudentVisibleContentTopic } from "@/modules/content/service";
import type {
  QuizProgressRecord,
  QuizProgressRepository,
  QuizQuestion,
  SubmitQuizAnswerResult,
} from "./types";

const defaultRepository = getDefaultQuizProgressRepository();

export function getMockQuizQuestion(topicId: string): QuizQuestion {
  const topic = getStudentVisibleContentTopic(topicId);

  if (!topic) {
    throw new Error(`Unknown mock quiz question for topic: ${topicId}`);
  }

  return {
    questionId: topic.quiz.questionId,
    topicId: topic.topicId,
    prompt: topic.quiz.prompt,
    options: topic.quiz.options.map((option) => ({ ...option })),
    correctOptionId: topic.quiz.correctOptionId,
    explanation: topic.quiz.explanation,
  };
}

export async function getQuizProgressByTopicId(
  topicId: string,
  userId: string,
  repository: QuizProgressRepository = defaultRepository,
): Promise<QuizProgressRecord | null> {
  return repository.getByTopicId(userId, topicId);
}

export async function listQuizProgressByUser(
  userId: string,
  repository: QuizProgressRepository = defaultRepository,
): Promise<QuizProgressRecord[]> {
  return repository.listByUserId(userId);
}

export async function submitQuizAnswer(
  topicId: string,
  input: {
    userId: string;
    selectedOptionId: string;
  },
  repository: QuizProgressRepository = defaultRepository,
): Promise<SubmitQuizAnswerResult> {
  const question = getMockQuizQuestion(topicId);
  const selectedOption = question.options.find((option) => option.optionId === input.selectedOptionId);
  const correctOption = question.options.find((option) => option.optionId === question.correctOptionId);

  if (!selectedOption || !correctOption) {
    throw new Error("Quiz answer payload is invalid for this topic.");
  }

  const existing = await repository.getByTopicId(input.userId, topicId);
  const isCorrect = input.selectedOptionId === question.correctOptionId;
  const attemptsCount = (existing?.attemptsCount ?? 0) + 1;
  const correctCount = (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const incorrectCount = (existing?.incorrectCount ?? 0) + (isCorrect ? 0 : 1);
  const lastAnsweredAt = new Date().toISOString();

  await repository.save({
    userId: input.userId,
    topicId,
    questionId: question.questionId,
    selectedOptionId: input.selectedOptionId,
    isCorrect,
    attemptsCount,
    correctCount,
    incorrectCount,
    lastAnsweredAt,
  });

  return {
    topicId,
    questionId: question.questionId,
    selectedOptionId: input.selectedOptionId,
    selectedOptionLabel: selectedOption.label,
    correctOptionId: question.correctOptionId,
    correctOptionLabel: correctOption.label,
    isCorrect,
    explanation: question.explanation,
    attemptsCount,
    correctCount,
    incorrectCount,
    accuracyPercentage: Math.round((correctCount / Math.max(attemptsCount, 1)) * 100),
    lastAnsweredAt,
  };
}
