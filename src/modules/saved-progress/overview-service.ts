import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import {
  buildAccessibilityPreferenceChips,
  buildAccessibilitySupportSummary,
} from "@/modules/accessibility/presentation";
import { getSavedProgressSessionInsights } from "./insights-service";
import { listSavedProgressByUser } from "./service";
import type {
  SavedProgressOverview,
  SavedProgressRecord,
  SavedProgressRepository,
  SavedProgressSessionSummary,
} from "./types";

export async function getSavedProgressOverview(
  options?: {
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<SavedProgressOverview> {
  const userId = options?.userId ?? "student-demo";
  const repository = options?.savedProgressRepository;

  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();

  await Promise.all([
    ...papers.map((paper) => getMockExamSession(paper.examId, { userId, savedProgressRepository: repository })),
    ...assessments.map((assessment) =>
      getMockTimedAssessmentAttemptSeed(assessment.assessmentId, {
        userId,
        savedProgressRepository: repository,
      }),
    ),
  ]);

  const records = await listSavedProgressByUser(userId, repository);
  const sessions = records
    .map((record) => buildSessionSummary(record, papers, assessments))
    .filter((session): session is SavedProgressSessionSummary => Boolean(session));

  const latestActivityAt = sessions[0]?.lastActivityAt;
  const activeCount = records.filter((record) => record.status !== "submitted").length;
  const submittedCount = records.filter((record) => record.status === "submitted").length;
  const accessSnapshotCount = records.filter((record) => record.accessArrangementSnapshot).length;
  const resumeSession = sessions.find((session) => session.recoveryState === "resume-ready");
  const reviewSession = sessions.find((session) => session.recoveryState === "review-ready");

  return {
    sessionCount: sessions.length,
    activeCount,
    submittedCount,
    recoveryReadyCount: sessions.filter((session) => session.recoveryState === "resume-ready").length,
    reviewReadyCount: sessions.filter((session) => session.recoveryState === "review-ready").length,
    accessSnapshotCount,
    latestActivityAt,
    recommendedAction: getRecommendedAction(sessions),
    recommendedActionHref: getRecommendedActionHref(sessions),
    resumeSessionHref: resumeSession?.href,
    reviewSessionHref: reviewSession?.href,
    latestSessionHref: sessions[0]?.href,
    sessions,
  };
}

function buildSessionSummary(
  record: SavedProgressRecord,
  papers: ReturnType<typeof getMockExamPapers>,
  assessments: ReturnType<typeof getMockTimedAssessments>,
): SavedProgressSessionSummary | null {
  if (record.entityType === "exam-session" && record.examProgress) {
    const examId = record.entityId.replace(/-session-\d+$/, "");
    const paper = papers.find((candidate) => candidate.examId === examId);

    if (!paper) {
      return buildFallbackSessionSummary(record);
    }

    const insights = getSavedProgressSessionInsights(record);
    const noteCount = record.examProgress.questionResponses.filter(
      (response) => response.workingNotes?.trim(),
    ).length;

    return {
      progressId: record.progressId,
      entityId: record.entityId,
      entityType: record.entityType,
      title: paper.title,
      subtitle: `${paper.board} ${paper.paperName} • attempt ${record.entityId.match(/-session-(\d+)$/)?.[1] ?? "001"}`,
      href: buildSavedProgressHref(record),
      actionLabel: record.status === "submitted" ? "Open results" : "Open and resume",
      status: record.status,
      recoveryState: record.status === "submitted" ? "review-ready" : "resume-ready",
      lastActivityAt: record.lastActivityAt,
      completionPercentage: insights.completionPercentage,
      currentQuestionLabel:
        record.status === "submitted"
          ? "Submitted and ready for review"
          : `Resume from ${record.examProgress.currentQuestionId}`,
      timeRemainingLabel:
        record.status === "submitted"
          ? "Timing closed for this paper"
          : `${insights.timeRemainingMinutes} mins remaining`,
      supportSummary: buildAccessibilitySupportSummary(record.accessArrangementSnapshot),
      supportPreferenceChips: buildAccessibilityPreferenceChips(record.accessArrangementSnapshot),
      reviewSummary:
        insights.reviewItemCount > 0
          ? `${insights.reviewItemCount} flagged questions waiting for review`
          : noteCount > 0
            ? `${noteCount} working note${noteCount === 1 ? "" : "s"} saved in this session`
            : "No flagged questions in the saved state",
    };
  }

  if (record.entityType === "timed-assessment-attempt" && record.timedAssessmentProgress) {
    const assessment = assessments.find((candidate) =>
      record.entityId.startsWith(`${candidate.assessmentId}-attempt-`),
    );

    if (!assessment) {
      return buildFallbackSessionSummary(record);
    }

    const insights = getSavedProgressSessionInsights(record);

    return {
      progressId: record.progressId,
      entityId: record.entityId,
      entityType: record.entityType,
      title: assessment.title,
      subtitle: `${assessment.subject} • cap ${assessment.officialDurationMinutes} mins`,
      href: buildSavedProgressHref(record),
      actionLabel: record.status === "submitted" ? "Open results" : "Open and resume",
      status: record.status,
      recoveryState: record.status === "submitted" ? "review-ready" : "resume-ready",
      lastActivityAt: record.lastActivityAt,
      completionPercentage: insights.completionPercentage,
      currentQuestionLabel:
        record.status === "submitted"
          ? "Submitted and ready for review"
          : record.timedAssessmentProgress.currentQuestionId
            ? `Resume from ${record.timedAssessmentProgress.currentQuestionId}`
            : "Ready to start",
      timeRemainingLabel:
        record.status === "submitted"
          ? "Timing closed for this checkpoint"
          : `${insights.timeRemainingMinutes} mins remaining`,
      supportSummary: buildAccessibilitySupportSummary(record.accessArrangementSnapshot),
      supportPreferenceChips: buildAccessibilityPreferenceChips(record.accessArrangementSnapshot),
      reviewSummary:
        insights.reviewItemCount > 0
          ? `${insights.reviewItemCount} bookmarked questions to revisit`
          : "No bookmarked questions in the saved state",
    };
  }

  return buildFallbackSessionSummary(record);
}

function toPercentage(answeredCount: number, totalCount: number): number {
  return Math.round((answeredCount / Math.max(totalCount, 1)) * 100);
}

function buildExamResumeHref(entityId: string, currentQuestionId: string): string {
  const examId = entityId.replace(/-session-\d+$/, "");
  const searchParams = new URLSearchParams({
    examId,
    questionId: currentQuestionId,
  });

  return `/exams?${searchParams.toString()}`;
}

function buildAssessmentResumeHref(
  assessmentId: string,
  durationMinutes: number,
  currentQuestionId?: string,
): string {
  const searchParams = new URLSearchParams({
    assessmentId,
    durationMinutes: String(durationMinutes),
  });

  if (currentQuestionId) {
    searchParams.set("questionId", currentQuestionId);
  }

  return `/assessments?${searchParams.toString()}`;
}

function getRecommendedAction(sessions: SavedProgressSessionSummary[]): string {
  const activeSessions = sessions.filter((session) => session.status !== "submitted");
  const mostUrgent = [...activeSessions].sort(
    (left, right) => left.completionPercentage - right.completionPercentage,
  )[0];

  if (mostUrgent) {
    return `Resume ${mostUrgent.title} next and pick up from the saved checkpoint.`;
  }

  const mostRecentSubmitted = sessions.find((session) => session.status === "submitted");

  if (mostRecentSubmitted) {
    return `Review ${mostRecentSubmitted.title} next from the saved completed sessions.`;
  }

  return "Start a timed assessment or exam to create your first saved session.";
}

function getRecommendedActionHref(sessions: SavedProgressSessionSummary[]): string {
  const activeSession = sessions.find((session) => session.recoveryState === "resume-ready");

  if (activeSession) {
    return activeSession.href;
  }

  const reviewSession = sessions.find((session) => session.recoveryState === "review-ready");

  if (reviewSession) {
    return reviewSession.href;
  }

  return "/saved-progress";
}

export function buildSavedProgressHref(record: SavedProgressRecord): string {
  if (record.status === "submitted") {
    return "/results";
  }

  if (record.entityType === "exam-session" && record.examProgress) {
    return buildExamResumeHref(record.entityId, record.examProgress.currentQuestionId);
  }

  if (record.entityType === "timed-assessment-attempt" && record.timedAssessmentProgress) {
    const assessmentId = record.entityId.replace(/-attempt-.+$/, "");

    return buildAssessmentResumeHref(
      assessmentId,
      record.timedAssessmentProgress.selectedDurationMinutes,
      record.timedAssessmentProgress.currentQuestionId,
    );
  }

  return "/saved-progress";
}

export function findSavedProgressSessionSummary(
  sessions: SavedProgressSessionSummary[],
  entityType: SavedProgressRecord["entityType"],
  entityId: string,
): SavedProgressSessionSummary | undefined {
  return sessions.find((session) => session.entityType === entityType && session.entityId === entityId);
}

function buildFallbackSessionSummary(record: SavedProgressRecord): SavedProgressSessionSummary {
  const isSubmitted = record.status === "submitted";
  const examQuestionCount = record.examProgress?.questionSet.length ?? 0;
  const examAnsweredCount =
    record.examProgress?.questionResponses.filter((response) => response.selectedOptionId).length ?? 0;
  const assessmentQuestionCount = record.timedAssessmentProgress?.questionSet.length ?? 0;
  const assessmentAnsweredCount = record.timedAssessmentProgress?.selectedAnswerIds.length ?? 0;
  const completionPercentage =
    record.entityType === "exam-session"
      ? toPercentage(examAnsweredCount, examQuestionCount)
      : toPercentage(assessmentAnsweredCount, assessmentQuestionCount);

  const insights = getSavedProgressSessionInsights(record);

  return {
    progressId: record.progressId,
    entityId: record.entityId,
    entityType: record.entityType,
    title: record.entityType === "exam-session" ? "Unavailable exam session" : "Unavailable timed assessment",
    subtitle: "Saved progress still exists, even though the linked source record is currently unavailable.",
    href: buildSavedProgressHref(record),
    actionLabel: isSubmitted ? "Open results" : "Open saved session",
    status: record.status,
    recoveryState: isSubmitted ? "review-ready" : "resume-ready",
    lastActivityAt: record.lastActivityAt,
    completionPercentage: completionPercentage || insights.completionPercentage,
    currentQuestionLabel: isSubmitted
      ? "Submitted and still available for review"
      : "Resume from the safest saved checkpoint",
    timeRemainingLabel: isSubmitted
      ? "Timing closed for this saved session"
      : `${insights.timeRemainingMinutes} mins remaining`,
    supportSummary: buildAccessibilitySupportSummary(record.accessArrangementSnapshot),
    supportPreferenceChips: buildAccessibilityPreferenceChips(record.accessArrangementSnapshot),
    reviewSummary:
      `${insights.reviewItemCount} review item${insights.reviewItemCount === 1 ? "" : "s"} still stored`,
  };
}
