import type { SavedProgressRecord } from "./types";

export interface SavedProgressSessionInsights {
  answeredCount: number;
  totalCount: number;
  correctCount: number;
  scorePercentage: number;
  completionPercentage: number;
  reviewItemCount: number;
  supportCount: number;
  hasAccessSnapshot: boolean;
  readAloudEnabled: boolean;
  timeRemainingMinutes: number;
}

export function getSavedProgressSessionInsights(record: SavedProgressRecord): SavedProgressSessionInsights {
  if (record.entityType === "exam-session" && record.examProgress) {
    const totalCount = record.examProgress.questionSet.length;
    const answeredCount = record.examProgress.questionResponses.filter(
      (response) => response.selectedOptionId,
    ).length;
    const correctCount = record.examProgress.questionResponses.filter((response) => {
      const question = record.examProgress?.questionSet.find(
        (candidate) => candidate.questionId === response.questionId,
      );

      return Boolean(
        response.selectedOptionId &&
          question?.correctOptionId &&
          response.selectedOptionId === question.correctOptionId,
      );
    }).length;

    return {
      answeredCount,
      totalCount,
      correctCount,
      scorePercentage: toPercentage(correctCount, totalCount),
      completionPercentage: toPercentage(answeredCount, totalCount),
      reviewItemCount: record.examProgress.flaggedQuestionIds.length,
      supportCount: record.accessArrangementSnapshot?.activeAccessArrangements.length ?? 0,
      hasAccessSnapshot: Boolean(record.accessArrangementSnapshot),
      readAloudEnabled: record.accessArrangementSnapshot?.textToSpeechEnabled ?? false,
      timeRemainingMinutes: Math.max(0, record.examProgress.timeRemainingMinutes),
    };
  }

  if (record.entityType === "timed-assessment-attempt" && record.timedAssessmentProgress) {
    const totalCount = record.timedAssessmentProgress.questionSet.length;
    const answeredCount = record.timedAssessmentProgress.selectedAnswerIds.length;
    const answerKey = new Map(
      record.timedAssessmentProgress.questionSet.map((question) => [
        question.questionId,
        question.correctOptionId,
      ]),
    );
    const correctCount = record.timedAssessmentProgress.selectedAnswerIds.filter((answerId) => {
      const [questionId, selectedOptionId] = answerId.split(":");

      return Boolean(selectedOptionId && answerKey.get(questionId) === selectedOptionId);
    }).length;

    return {
      answeredCount,
      totalCount,
      correctCount,
      scorePercentage: toPercentage(correctCount, totalCount),
      completionPercentage: toPercentage(answeredCount, totalCount),
      reviewItemCount: record.timedAssessmentProgress.bookmarkedQuestionIds.length,
      supportCount: record.accessArrangementSnapshot?.activeAccessArrangements.length ?? 0,
      hasAccessSnapshot: Boolean(record.accessArrangementSnapshot),
      readAloudEnabled: record.accessArrangementSnapshot?.textToSpeechEnabled ?? false,
      timeRemainingMinutes: Math.max(0, record.timedAssessmentProgress.timeRemainingMinutes),
    };
  }

  return {
    answeredCount: 0,
    totalCount: 0,
    correctCount: 0,
    scorePercentage: 0,
    completionPercentage: 0,
    reviewItemCount: 0,
    supportCount: 0,
    hasAccessSnapshot: Boolean(record.accessArrangementSnapshot),
    readAloudEnabled: record.accessArrangementSnapshot?.textToSpeechEnabled ?? false,
    timeRemainingMinutes: 0,
  };
}

function toPercentage(value: number, total: number): number {
  return Math.round((value / Math.max(total, 1)) * 100);
}
