import type { QuizQuestion } from "./types";
import { getStudentVisibleContentTopic } from "@/modules/content/service";

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
  };
}
