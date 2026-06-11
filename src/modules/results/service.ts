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
import type {
  MarkingConfidence,
  ResultQuestionReviewItem,
  ResultTrend,
  ResultsOverview,
  SessionResultSummary,
} from "./types";

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
            correctCount: 0,
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
        actionLabel: status === "submitted" ? "Open review results" : "Resume paper",
        scorePercentage: insights.scorePercentage,
        answeredCount: insights.answeredCount,
        correctCount: insights.correctCount,
        incorrectCount: Math.max(insights.answeredCount - insights.correctCount, 0),
        unansweredCount: Math.max(insights.totalCount - insights.answeredCount, 0),
        totalCount: insights.totalCount,
        flaggedCount: insights.reviewItemCount,
        reviewLabel:
          status === "submitted"
            ? "Submitted and ready for review"
            : noteCount > 0
              ? `${noteCount} working note${noteCount === 1 ? "" : "s"} still in progress`
              : "Still active in the exam flow",
        strengths: paper.skillsFocus.slice(0, 2),
        markingConfidence: getMarkingConfidence(insights.answeredCount, insights.totalCount),
        reviewPriorities: buildExamReviewPriorities(savedRecord, paper.skillsFocus),
        markingNotes: buildExamMarkingNotes(savedRecord, noteCount),
        questionReview: buildExamQuestionReview(savedRecord),
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
            correctCount: 0,
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
        actionLabel: status === "submitted" ? "Open review results" : "Resume checkpoint",
        scorePercentage: insights.scorePercentage,
        answeredCount: insights.answeredCount,
        correctCount: insights.correctCount,
        incorrectCount: Math.max(insights.answeredCount - insights.correctCount, 0),
        unansweredCount: Math.max(insights.totalCount - insights.answeredCount, 0),
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
        markingConfidence: getMarkingConfidence(insights.answeredCount, insights.totalCount),
        reviewPriorities: buildAssessmentReviewPriorities(savedRecord, assessment.subject),
        markingNotes: buildAssessmentMarkingNotes(savedRecord),
        questionReview: buildAssessmentQuestionReview(savedRecord),
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
    continuityStatus: savedProgressOverview.continuity.status,
    continuityTitle: savedProgressOverview.continuity.primaryAction.title,
    continuityDescription: savedProgressOverview.continuity.primaryAction.description,
    continuityHref: savedProgressOverview.continuity.primaryAction.href,
    continuityActionLabel: savedProgressOverview.continuity.primaryAction.actionLabel,
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

function getMarkingConfidence(answeredCount: number, totalCount: number): MarkingConfidence {
  const completion = Math.round((answeredCount / Math.max(totalCount, 1)) * 100);

  if (completion >= 85) {
    return "high";
  }

  if (completion >= 50) {
    return "medium";
  }

  return "low";
}

function buildExamReviewPriorities(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
  strengths: string[],
): string[] {
  if (!savedRecord?.examProgress) {
    return [`Revisit ${strengths[0] ?? "the weakest topic"} through a fresh paper attempt.`];
  }

  const flaggedTopics = savedRecord.examProgress.questionSet
    .filter((question) =>
      savedRecord.examProgress?.flaggedQuestionIds.includes(question.questionId),
    )
    .map((question) => question.topic);

  return uniqueStrings(
    flaggedTopics.length > 0
      ? flaggedTopics.map((topic) => `Review flagged work in ${topic}.`)
      : [`Revisit ${strengths[0] ?? "the main topic"} through the submitted answer review.`],
  );
}

function buildExamMarkingNotes(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
  noteCount: number,
): string[] {
  if (!savedRecord?.examProgress) {
    return ["Marking is limited until a saved exam snapshot is available."];
  }

  return [
    noteCount > 0
      ? `${noteCount} working note${noteCount === 1 ? "" : "s"} can be reviewed alongside the final answers.`
      : "No working notes were saved for this paper.",
    savedRecord.examProgress.flaggedQuestionIds.length > 0
      ? "Flagged questions stay visible inside the result review model."
      : "No flagged questions remain in the submitted review state.",
  ];
}

function buildAssessmentReviewPriorities(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
  subject: string,
): string[] {
  if (!savedRecord?.timedAssessmentProgress) {
    return [`Use another ${subject} checkpoint once more saved evidence is available.`];
  }

  const bookmarkedTopics = savedRecord.timedAssessmentProgress.questionSet
    .filter((question) =>
      savedRecord.timedAssessmentProgress?.bookmarkedQuestionIds.includes(question.questionId),
    )
    .map((question) => question.topic);

  return uniqueStrings(
    bookmarkedTopics.length > 0
      ? bookmarkedTopics.map((topic) => `Revisit bookmarked checkpoint work in ${topic}.`)
      : [`Repeat the ${subject} checkpoint after targeted revision.`],
  );
}

function buildAssessmentMarkingNotes(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
): string[] {
  if (!savedRecord?.timedAssessmentProgress) {
    return ["Checkpoint marking is limited until a saved attempt snapshot is available."];
  }

  return [
    savedRecord.timedAssessmentProgress.bookmarkedQuestionIds.length > 0
      ? "Bookmarked checkpoint questions stay visible as review marks after submission."
      : "No bookmarked checkpoint items remain in the submitted review state.",
    Object.values(savedRecord.timedAssessmentProgress.notes).some((note) => note.trim().length > 0)
      ? "Saved checkpoint notes are still available during result review."
      : "No checkpoint notes were saved for this attempt.",
  ];
}

function buildExamQuestionReview(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
): ResultQuestionReviewItem[] {
  if (!savedRecord?.examProgress) {
    return [];
  }

  return savedRecord.examProgress.questionSet.map((question) => {
    const response = savedRecord.examProgress?.questionResponses.find(
      (candidate) => candidate.questionId === question.questionId,
    );
    const selectedOption = question.options?.find(
      (option) => option.optionId === response?.selectedOptionId,
    );
    const correctOption = question.options?.find(
      (option) => option.optionId === question.correctOptionId,
    );
    const outcome =
      response?.selectedOptionId
        ? response.selectedOptionId === question.correctOptionId
          ? "correct"
          : "incorrect"
        : "unanswered";

    return {
      questionId: question.questionId,
      label: `Question ${question.number}`,
      topic: question.topic,
      selectedAnswerLabel: selectedOption?.label ?? "No answer",
      correctAnswerLabel: correctOption?.label ?? "Unknown",
      outcome,
      flagged: Boolean(response?.flagged),
      hasWorkingNotes: Boolean(response?.workingNotes?.trim()),
    };
  });
}

function buildAssessmentQuestionReview(
  savedRecord: Awaited<ReturnType<typeof listSavedProgressByUser>>[number] | undefined,
): ResultQuestionReviewItem[] {
  if (!savedRecord?.timedAssessmentProgress) {
    return [];
  }

  return savedRecord.timedAssessmentProgress.questionSet.map((question, index) => {
    const selectedAnswerId = savedRecord.timedAssessmentProgress?.selectedAnswerIds.find((answerId) =>
      answerId.startsWith(`${question.questionId}:`),
    );
    const selectedOptionId = selectedAnswerId?.split(":")[1];
    const selectedOption = question.options.find((option) => option.optionId === selectedOptionId);
    const correctOption = question.options.find((option) => option.optionId === question.correctOptionId);
    const outcome =
      selectedOptionId
        ? selectedOptionId === question.correctOptionId
          ? "correct"
          : "incorrect"
        : "unanswered";

    return {
      questionId: question.questionId,
      label: `Checkpoint ${index + 1}`,
      topic: question.topic,
      selectedAnswerLabel: selectedOption?.label ?? "No answer",
      correctAnswerLabel: correctOption?.label ?? "Unknown",
      outcome,
      flagged: savedRecord.timedAssessmentProgress?.bookmarkedQuestionIds.includes(question.questionId) ?? false,
      hasWorkingNotes: Boolean(
        savedRecord.timedAssessmentProgress?.notes[question.questionId]?.trim(),
      ),
    };
  });
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
