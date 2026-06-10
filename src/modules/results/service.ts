import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import {
  buildAccessibilityPreferenceChips,
  buildAccessibilitySupportSummary,
} from "@/modules/accessibility/presentation";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getSavedProgressSessionInsights } from "@/modules/saved-progress/insights-service";
import {
  findSavedProgressSessionSummary,
  getSavedProgressOverview,
} from "@/modules/saved-progress/overview-service";
import { listSavedProgressByUser } from "@/modules/saved-progress/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { ResultTrend, ResultsOverview, SessionResultSummary } from "./types";

export async function getResultsOverview(userId = "guest-preview"): Promise<ResultsOverview> {
  const [papers, assessments, powerGrid, savedProgressOverview, savedProgressRecords] = await Promise.all([
    Promise.resolve(getMockExamPapers()),
    Promise.resolve(getMockTimedAssessments()),
    getMockPowerGridSummary({ userId }),
    getSavedProgressOverview({ userId }),
    listSavedProgressByUser(userId),
  ]);

  await Promise.all([
    ...papers.map((paper) => getMockExamSession(paper.examId, { userId })),
    ...assessments.map((assessment) =>
      getMockTimedAssessmentAttemptSeed(assessment.assessmentId, { userId }),
    ),
  ]);

  const examResults = await Promise.all(
    papers.map(async (paper) => {
      const session = await getMockExamSession(paper.examId, { userId });
      const savedSession = findSavedProgressSessionSummary(
        savedProgressOverview.sessions,
        "exam-session",
        session.examSessionId,
      );
      const savedRecord = savedProgressRecords.find(
        (record) => record.entityType === "exam-session" && record.entityId === session.examSessionId,
      );
      const noteCount =
        savedRecord?.examProgress?.questionResponses.filter((response) => response.workingNotes?.trim()).length ??
        session.questionResponses.filter((response) => response.workingNotes?.trim()).length;
      const status = savedSession?.status === "submitted" ? "submitted" : "in-progress";
      const insights = savedRecord
        ? getSavedProgressSessionInsights(savedRecord)
        : {
            scorePercentage: 0,
            answeredCount: 0,
            totalCount: 0,
            reviewItemCount: 0,
          };

      return buildResultSummary({
        resultId: `result-${session.examSessionId}`,
        kind: "exam",
        title: paper.title,
        subtitle: `${paper.board} ${paper.paperName} • attempt ${session.attemptNumber}`,
        status,
        href: savedSession?.href ?? `/exams?examId=${paper.examId}`,
        actionLabel: status === "submitted" ? "Reopen paper review" : "Resume paper",
        scorePercentage: insights.scorePercentage,
        answeredCount: insights.answeredCount,
        totalCount: insights.totalCount,
        flaggedCount: insights.reviewItemCount,
        reviewLabel:
          status === "submitted"
            ? "Submitted and ready for review"
            : noteCount > 0
              ? `${noteCount} working note${noteCount === 1 ? "" : "s"} still in progress`
              : "Still active in the exam flow",
        strengths: paper.skillsFocus.slice(0, 2),
        supportSummary: buildAccessibilitySupportSummary(savedRecord?.accessArrangementSnapshot),
        supportPreferenceChips: buildAccessibilityPreferenceChips(savedRecord?.accessArrangementSnapshot),
        nextStep: `Return to ${paper.skillsFocus[0]} before attempting the next paper.`,
      });
    }),
  );

  const assessmentResults = await Promise.all(
    assessments.map(async (assessment) => {
      const seed = await getMockTimedAssessmentAttemptSeed(assessment.assessmentId, { userId });
      const savedSession = findSavedProgressSessionSummary(
        savedProgressOverview.sessions,
        "timed-assessment-attempt",
        seed.attempt.attemptId,
      );
      const savedRecord = savedProgressRecords.find(
        (record) =>
          record.entityType === "timed-assessment-attempt" && record.entityId === seed.attempt.attemptId,
      );
      const status = savedSession?.status === "submitted" ? "submitted" : "in-progress";
      const insights = savedRecord
        ? getSavedProgressSessionInsights(savedRecord)
        : {
            scorePercentage: 0,
            answeredCount: 0,
            totalCount: 0,
            reviewItemCount: 0,
          };

      return buildResultSummary({
        resultId: `result-${seed.attempt.attemptId}`,
        kind: "assessment",
        title: assessment.title,
        subtitle: `${assessment.subject} timed checkpoint`,
        status,
        href:
          savedSession?.href ??
          `/assessments?assessmentId=${assessment.assessmentId}&durationMinutes=${seed.attempt.selectedDurationMinutes}`,
        actionLabel: status === "submitted" ? "Reopen checkpoint review" : "Resume checkpoint",
        scorePercentage: insights.scorePercentage,
        answeredCount: insights.answeredCount,
        totalCount: insights.totalCount,
        flaggedCount: insights.reviewItemCount,
        reviewLabel:
          status === "submitted"
            ? "Submitted and ready for review"
            : insights.reviewItemCount > 0
              ? `${insights.reviewItemCount} bookmarked item${
                  insights.reviewItemCount === 1 ? "" : "s"
                } still open`
              : "Still active in the checkpoint flow",
        strengths: [assessment.subject, "Timed recall"],
        supportSummary: buildAccessibilitySupportSummary(savedRecord?.accessArrangementSnapshot),
        supportPreferenceChips: buildAccessibilityPreferenceChips(savedRecord?.accessArrangementSnapshot),
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
    submittedCount:
      examResults.filter((result) => result.status === "submitted").length +
      assessmentResults.filter((result) => result.status === "submitted").length,
    readyForReviewCount:
      examResults.filter((result) => result.status === "submitted").length +
      assessmentResults.filter((result) => result.status === "submitted").length,
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
