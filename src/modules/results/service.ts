import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { ResultTrend, ResultsOverview, SessionResultSummary } from "./types";

const mockExamAnswerKeys: Record<string, Record<string, string>> = {
  "aqa-maths-higher-paper-1": {
    q1: "a",
    q2: "b",
    q3: "c",
    q4: "c",
  },
  "edexcel-english-paper-1": {
    q1: "b",
    q2: "b",
    q3: "b",
  },
};

const mockAssessmentCorrectAnswers: Record<string, string[]> = {
  "aqa-maths-algebra-checkpoint": ["q1:a", "q2:c", "q3:b", "q4:b", "q5:d", "q6:a"],
  "edexcel-english-inference-practice": ["q1:b", "q2:b", "q3:b", "q4:c"],
};

export async function getResultsOverview(): Promise<ResultsOverview> {
  const [papers, assessments, powerGrid] = await Promise.all([
    Promise.resolve(getMockExamPapers()),
    Promise.resolve(getMockTimedAssessments()),
    getMockPowerGridSummary(),
  ]);

  const examResults = await Promise.all(
    papers.map(async (paper) => {
      const session = await getMockExamSession(paper.examId);
      const answerKey = mockExamAnswerKeys[paper.examId] ?? {};
      const correctCount = session.questionResponses.filter(
        (response) => response.selectedOptionId && response.selectedOptionId === answerKey[response.questionId],
      ).length;

      return buildResultSummary({
        resultId: `result-${session.examSessionId}`,
        kind: "exam",
        title: paper.title,
        subtitle: `${paper.board} ${paper.paperName}`,
        scorePercentage: toPercentage(correctCount, paper.questions.length),
        answeredCount: session.questionResponses.filter((response) => response.selectedOptionId).length,
        totalCount: paper.questions.length,
        flaggedCount: session.questionResponses.filter((response) => response.flagged).length,
        strengths: paper.skillsFocus.slice(0, 2),
        nextStep: `Return to ${paper.skillsFocus[0]} before attempting the next paper.`,
      });
    }),
  );

  const assessmentResults = await Promise.all(
    assessments.map(async (assessment) => {
      const seed = await getMockTimedAssessmentAttemptSeed(assessment.assessmentId);
      const correctAnswers = mockAssessmentCorrectAnswers[assessment.assessmentId] ?? [];
      const correctCount = seed.selectedAnswerIds.filter((answerId) => correctAnswers.includes(answerId)).length;

      return buildResultSummary({
        resultId: `result-${seed.attempt.attemptId}`,
        kind: "assessment",
        title: assessment.title,
        subtitle: `${assessment.subject} timed checkpoint`,
        scorePercentage: toPercentage(correctCount, correctAnswers.length || assessment.questionCount),
        answeredCount: seed.selectedAnswerIds.length,
        totalCount: assessment.questionCount,
        flaggedCount: seed.bookmarkedQuestionIds.length,
        strengths: [assessment.subject, "Timed recall"],
        nextStep: `Use the ${assessment.title} checkpoint again after revision to compare progress.`,
      });
    }),
  );

  const overallScorePercentage = Math.round(
    (average(examResults.map((result) => result.scorePercentage)) +
      average(assessmentResults.map((result) => result.scorePercentage))) / 2,
  );

  return {
    overallScorePercentage,
    overallTrend: getTrend(overallScorePercentage),
    completedCount: examResults.length + assessmentResults.length,
    averageExamScore: average(examResults.map((result) => result.scorePercentage)),
    averageAssessmentScore: average(assessmentResults.map((result) => result.scorePercentage)),
    examResults,
    assessmentResults,
    strongestArea: powerGrid.subjectProgress.sort((left, right) => right.readinessScore - left.readinessScore)[0]
      ?.subject ?? "Not enough data yet",
    nextPriority: powerGrid.nextBestAction,
  };
}

function buildResultSummary(
  input: Omit<SessionResultSummary, "trend">,
): SessionResultSummary {
  return {
    ...input,
    trend: getTrend(input.scorePercentage),
  };
}

function toPercentage(score: number, total: number): number {
  return Math.round((score / Math.max(total, 1)) * 100);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getTrend(score: number): ResultTrend {
  if (score >= 70) {
    return "improving";
  }

  if (score >= 45) {
    return "stable";
  }

  return "needs-attention";
}
