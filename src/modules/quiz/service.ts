import { getDefaultQuizProgressRepository } from "@/lib/server/repositories";
import { appendProgressionEvent } from "@/lib/persistence/progression-event-store";
import { getStudentVisibleContentTopic } from "@/modules/content/service";
import { createProgressionEvent } from "@/modules/power-grid/progression-events";
import { syncLearningLoopAfterQuiz } from "@/modules/learning-loop/service";
import { recordReview } from "@/modules/recall-strength/service";
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
  const topic = getStudentVisibleContentTopic(topicId);
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

  await appendProgressionEvent(
    createProgressionEvent({
      userId: input.userId,
      type: "quiz.completed",
      subjectId: topic?.subjectId,
      topicId,
      occurredAt: lastAnsweredAt,
    }),
  );

  if (topic?.subjectId) {
    await recordReview(input.userId, {
      topicId,
      subjectId: topic.subjectId,
      outcome: isCorrect ? "correct" : "incorrect",
    });
    await syncLearningLoopAfterQuiz(input.userId, topicId, topic.subjectId);
  }

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
