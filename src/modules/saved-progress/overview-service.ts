import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
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

  return {
    sessionCount: sessions.length,
    activeCount,
    submittedCount,
    accessSnapshotCount,
    latestActivityAt,
    recommendedAction: getRecommendedAction(sessions),
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
      return null;
    }

    const answeredCount = record.examProgress.questionResponses.filter(
      (response) => response.selectedOptionId,
    ).length;
    const flaggedCount = record.examProgress.flaggedQuestionIds.length;
    const noteCount = record.examProgress.questionResponses.filter(
      (response) => response.workingNotes?.trim(),
    ).length;
    const supportCount = record.accessArrangementSnapshot?.activeAccessArrangements.length ?? 0;

    return {
      progressId: record.progressId,
      entityId: record.entityId,
      entityType: record.entityType,
      title: paper.title,
      subtitle: `${paper.board} ${paper.paperName} • attempt ${record.entityId.match(/-session-(\d+)$/)?.[1] ?? "001"}`,
      href:
        record.status === "submitted"
          ? "/results"
          : buildExamResumeHref(record.entityId, record.examProgress.currentQuestionId),
      actionLabel: record.status === "submitted" ? "Open results" : "Open and resume",
      status: record.status,
      lastActivityAt: record.lastActivityAt,
      completionPercentage: toPercentage(answeredCount, record.examProgress.questionSet.length),
      currentQuestionLabel:
        record.status === "submitted"
          ? "Submitted and ready for review"
          : `Resume from ${record.examProgress.currentQuestionId}`,
      timeRemainingLabel:
        record.status === "submitted"
          ? "Timing closed for this paper"
          : `${record.examProgress.timeRemainingMinutes} mins remaining`,
      supportSummary:
        supportCount > 0
          ? `${supportCount} access adjustments stored with this session`
          : "Support snapshot ready for future access needs",
      reviewSummary:
        flaggedCount > 0
          ? `${flaggedCount} flagged questions waiting for review`
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
      return null;
    }

    const bookmarkedCount = record.timedAssessmentProgress.bookmarkedQuestionIds.length;
    const supportCount = record.accessArrangementSnapshot?.activeAccessArrangements.length ?? 0;

    return {
      progressId: record.progressId,
      entityId: record.entityId,
      entityType: record.entityType,
      title: assessment.title,
      subtitle: `${assessment.subject} • cap ${assessment.officialDurationMinutes} mins`,
      href:
        record.status === "submitted"
          ? "/results"
          : buildAssessmentResumeHref(
              assessment.assessmentId,
              record.timedAssessmentProgress.selectedDurationMinutes,
              record.timedAssessmentProgress.currentQuestionId,
            ),
      actionLabel: record.status === "submitted" ? "Open results" : "Open and resume",
      status: record.status,
      lastActivityAt: record.lastActivityAt,
      completionPercentage: toPercentage(
        record.timedAssessmentProgress.selectedAnswerIds.length,
        assessment.questionCount,
      ),
      currentQuestionLabel:
        record.status === "submitted"
          ? "Submitted and ready for review"
          : record.timedAssessmentProgress.currentQuestionId
            ? `Resume from ${record.timedAssessmentProgress.currentQuestionId}`
            : "Ready to start",
      timeRemainingLabel:
        record.status === "submitted"
          ? "Timing closed for this checkpoint"
          : `${record.timedAssessmentProgress.timeRemainingMinutes} mins remaining`,
      supportSummary:
        supportCount > 0
          ? `${supportCount} access adjustments stored with this attempt`
          : "Snapshot ready for future support-aware resume",
      reviewSummary:
        bookmarkedCount > 0
          ? `${bookmarkedCount} bookmarked questions to revisit`
          : "No bookmarked questions in the saved state",
    };
  }

  return null;
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
