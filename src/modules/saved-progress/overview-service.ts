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
    const supportCount = record.accessArrangementSnapshot?.activeAccessArrangements.length ?? 0;

    return {
      progressId: record.progressId,
      entityId: record.entityId,
      entityType: record.entityType,
      title: paper.title,
      subtitle: `${paper.board} ${paper.paperName} • ${paper.durationMinutes} mins official`,
      href: "/exams",
      status: record.status,
      lastActivityAt: record.lastActivityAt,
      completionPercentage: toPercentage(answeredCount, paper.questions.length),
      currentQuestionLabel: `Resume from ${record.examProgress.currentQuestionId}`,
      timeRemainingLabel: `${record.examProgress.timeRemainingMinutes} mins remaining`,
      supportSummary:
        supportCount > 0
          ? `${supportCount} access adjustments stored with this session`
          : "Support snapshot ready for future access needs",
      reviewSummary:
        flaggedCount > 0
          ? `${flaggedCount} flagged questions waiting for review`
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
      href: "/assessments",
      status: record.status,
      lastActivityAt: record.lastActivityAt,
      completionPercentage: toPercentage(
        record.timedAssessmentProgress.selectedAnswerIds.length,
        assessment.questionCount,
      ),
      currentQuestionLabel: record.timedAssessmentProgress.currentQuestionId
        ? `Resume from ${record.timedAssessmentProgress.currentQuestionId}`
        : "Ready to start",
      timeRemainingLabel: `${record.timedAssessmentProgress.timeRemainingMinutes} mins remaining`,
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

function getRecommendedAction(sessions: SavedProgressSessionSummary[]): string {
  const mostUrgent = [...sessions].sort((left, right) => left.completionPercentage - right.completionPercentage)[0];

  if (!mostUrgent) {
    return "Start a timed assessment or exam to create your first saved session.";
  }

  return `Resume ${mostUrgent.title} next and pick up from the saved checkpoint.`;
}
