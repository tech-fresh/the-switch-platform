import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import type { ExamPaper } from "@/modules/exam-engine/types";
import { listSavedProgressByUser } from "@/modules/saved-progress/service";
import type { SavedProgressRecord, SavedProgressRepository } from "@/modules/saved-progress/types";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { TimedAssessmentDefinition } from "@/modules/timed-assessment/types";
import {
  listStudentVisibleContentSubjects,
  listStudentVisibleContentTopicsForSubject,
} from "@/modules/content/service";
import type { MvpCatalogSubject, MvpCatalogTopic } from "@/modules/content/types";
import type { PowerGridLevel, PowerGridSummary, PowerGridSubjectProgress, PowerGridTrend } from "./types";

const powerGridLevels: PowerGridLevel[] = [
  "Ignition",
  "Powered Up",
  "Current Flow",
  "Voltage Rising",
  "Full Circuit",
  "High Voltage",
  "Grid Master",
  "Power Station",
  "Switch Legend",
];

interface TrackedSubject {
  subject: string;
  subjectId?: string;
  topics: MvpCatalogTopic[];
  papers: ExamPaper[];
  assessments: TimedAssessmentDefinition[];
}

export async function getMockPowerGridSummary(options?: {
  userId?: string;
  savedProgressRepository?: SavedProgressRepository;
}): Promise<PowerGridSummary> {
  const userId = options?.userId ?? "student-demo";
  const repository = options?.savedProgressRepository;
  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();
  const contentSubjects = listStudentVisibleContentSubjects();

  await Promise.all(
    papers.map((paper) =>
      getMockExamSession(paper.examId, { userId, savedProgressRepository: repository }),
    ),
  );
  await Promise.all(
    assessments.map((assessment) =>
      getMockTimedAssessmentAttemptSeed(assessment.assessmentId, {
        userId,
        savedProgressRepository: repository,
      }),
    ),
  );
  const records = await listSavedProgressByUser(userId, repository);
  const trackedSubjects = buildTrackedSubjects(papers, assessments, contentSubjects);

  const subjectProgress = trackedSubjects
    .map((trackedSubject) => buildSubjectProgress(trackedSubject, records))
    .filter((subject): subject is PowerGridSubjectProgress => Boolean(subject));

  const overallReadinessScore = Math.round(
    subjectProgress.reduce((total, subject) => total + subject.readinessScore, 0) /
      Math.max(subjectProgress.length, 1),
  );
  const activeCount = records.filter((record) => record.status !== "submitted").length;
  const completedCount = records.filter((record) => record.status === "submitted").length;
  const accessSnapshotCoverage = calculateCompletionScore(
    records.filter((record) => record.accessArrangementSnapshot).length,
    records.length,
  );
  const latestActivityAt = records[0]?.lastActivityAt;
  const nextBestActionHref = getNextBestActionHref(subjectProgress);

  return {
    overallLevel: getLevelFromScore(overallReadinessScore),
    overallTrend: getTrendFromScore(overallReadinessScore),
    examReadinessScore: overallReadinessScore,
    completedSessionCount: completedCount,
    activeSessionCount: activeCount,
    trackedSubjectCount: subjectProgress.length,
    subjectsNeedingAttentionCount: subjectProgress.filter((subject) => subject.readinessScore < 50).length,
    accessSnapshotCoverage,
    latestActivityAt,
    resumeHref: getResumeHref(records),
    nextBestAction: getNextBestAction(subjectProgress),
    nextBestActionHref,
    subjectProgress,
  };
}

function buildTrackedSubjects(
  papers: ExamPaper[],
  assessments: TimedAssessmentDefinition[],
  contentSubjects: MvpCatalogSubject[],
): TrackedSubject[] {
  const trackedSubjects = new Map<string, TrackedSubject>();

  for (const paper of papers) {
    const key = normalizeLabel(paper.subject);
    const matchingSubject = findMatchingContentSubject(paper.subject, contentSubjects);
    const existing = trackedSubjects.get(key);

    trackedSubjects.set(key, {
      subject: paper.subject,
      subjectId: matchingSubject?.subjectId ?? existing?.subjectId,
      topics:
        existing?.topics ??
        (matchingSubject ? listStudentVisibleContentTopicsForSubject(matchingSubject.subjectId) : []),
      papers: [...(existing?.papers ?? []), paper],
      assessments: existing?.assessments ?? [],
    });
  }

  for (const assessment of assessments) {
    const key = normalizeLabel(assessment.subject);
    const matchingSubject = findMatchingContentSubject(assessment.subject, contentSubjects);
    const existing = trackedSubjects.get(key);

    trackedSubjects.set(key, {
      subject: existing?.subject ?? assessment.subject,
      subjectId: existing?.subjectId ?? matchingSubject?.subjectId,
      topics:
        existing?.topics ??
        (matchingSubject ? listStudentVisibleContentTopicsForSubject(matchingSubject.subjectId) : []),
      papers: existing?.papers ?? [],
      assessments: [...(existing?.assessments ?? []), assessment],
    });
  }

  return [...trackedSubjects.values()];
}

function buildSubjectProgress(
  trackedSubject: TrackedSubject,
  records: SavedProgressRecord[],
): PowerGridSubjectProgress | null {
  const subjectRecords = records.filter((record) => belongsToTrackedSubject(record, trackedSubject));

  if (subjectRecords.length === 0) {
    return null;
  }

  const examRecords = subjectRecords.filter(
    (record): record is SavedProgressRecord & { examProgress: NonNullable<SavedProgressRecord["examProgress"]> } =>
      record.entityType === "exam-session" && Boolean(record.examProgress),
  );
  const assessmentRecords = subjectRecords.filter(
    (
      record,
    ): record is SavedProgressRecord & {
      timedAssessmentProgress: NonNullable<SavedProgressRecord["timedAssessmentProgress"]>;
    } => record.entityType === "timed-assessment-attempt" && Boolean(record.timedAssessmentProgress),
  );

  const examCompletion = getAverageScore(
    examRecords.map((record) =>
      calculateCompletionScore(
        record.examProgress.questionResponses.filter((response) => response.selectedOptionId).length,
        record.examProgress.questionSet.length,
      ),
    ),
  );
  const assessmentCompletion = getAverageScore(
    assessmentRecords.map((record) => {
      const assessment = trackedSubject.assessments.find((candidate) =>
        record.entityId.startsWith(`${candidate.assessmentId}-attempt-`),
      );

      return calculateCompletionScore(
        record.timedAssessmentProgress.selectedAnswerIds.length,
        assessment?.questionCount ?? 1,
      );
    }),
  );
  const completionScore = getAverageScore(
    [examCompletion, assessmentCompletion].filter((score) => score > 0),
  );
  const completedSessionCount = subjectRecords.filter((record) => record.status === "submitted").length;
  const activeSessionCount = subjectRecords.length - completedSessionCount;
  const reviewItemCount =
    examRecords.reduce(
      (total, record) => total + record.examProgress.flaggedQuestionIds.length,
      0,
    ) +
    assessmentRecords.reduce(
      (total, record) => total + record.timedAssessmentProgress.bookmarkedQuestionIds.length,
      0,
    );
  const accessSnapshotCount = subjectRecords.filter((record) => record.accessArrangementSnapshot).length;
  const completionCoverage = calculateCompletionScore(completedSessionCount, subjectRecords.length);
  const accessCoverage = calculateCompletionScore(accessSnapshotCount, subjectRecords.length);
  const reviewStabilityScore = Math.max(0, 100 - Math.min(reviewItemCount * 15, 80));
  const activityDepthScore = Math.min(subjectRecords.length * 25, 100);
  const readinessScore = Math.round(
    completionScore * 0.55 +
      completionCoverage * 0.2 +
      accessCoverage * 0.1 +
      reviewStabilityScore * 0.1 +
      activityDepthScore * 0.05,
  );
  const recommendedFocus = getRecommendedFocus(trackedSubject);
  const recommendedTopic = trackedSubject.topics.find(
    (topic) => normalizeLabel(topic.name) === normalizeLabel(recommendedFocus),
  );
  const resumeRecord = subjectRecords.find((record) => record.status !== "submitted") ?? subjectRecords[0];
  const lastActivityAt = subjectRecords[0]?.lastActivityAt;

  return {
    subject: trackedSubject.subject,
    subjectId: trackedSubject.subjectId,
    level: getLevelFromScore(readinessScore),
    trend: getTrendFromSubject(readinessScore, completedSessionCount, reviewItemCount),
    readinessScore,
    completionScore,
    activeSessionCount,
    completedSessionCount,
    reviewItemCount,
    accessSnapshotCount,
    recommendedFocus,
    recommendedTopicId: recommendedTopic?.topicId,
    subjectHref: buildSubjectHref(trackedSubject.subjectId, recommendedTopic?.topicId),
    resumeHref: resumeRecord ? buildResumeHref(resumeRecord) : undefined,
    lastActivityAt,
    evidence: buildSubjectEvidence({
      activeSessionCount,
      completedSessionCount,
      reviewItemCount,
      accessSnapshotCount,
    }),
  };
}

function calculateCompletionScore(answeredCount: number, totalCount: number): number {
  return Math.round((answeredCount / Math.max(totalCount, 1)) * 100);
}

function getAverageScore(scores: number[]): number {
  if (scores.length === 0) {
    return 0;
  }

  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

function getLevelFromScore(score: number): PowerGridLevel {
  const index = Math.min(
    powerGridLevels.length - 1,
    Math.max(0, Math.floor(score / 12)),
  );

  return powerGridLevels[index];
}

function getTrendFromScore(score: number): PowerGridTrend {
  if (score >= 65) {
    return "improving";
  }

  if (score >= 35) {
    return "stable";
  }

  return "declining";
}

function getTrendFromSubject(
  readinessScore: number,
  completedSessionCount: number,
  reviewItemCount: number,
): PowerGridTrend {
  if (completedSessionCount > 0 || readinessScore >= 65) {
    return "improving";
  }

  if (reviewItemCount >= 3 && readinessScore < 45) {
    return "declining";
  }

  return "stable";
}

function getNextBestAction(subjectProgress: PowerGridSubjectProgress[]): string {
  const activeLowest = [...subjectProgress]
    .filter((subject) => subject.activeSessionCount > 0)
    .sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (activeLowest) {
    return `Resume ${activeLowest.subject} next and finish the saved work already in progress.`;
  }

  const reviewLowest = [...subjectProgress]
    .filter((subject) => subject.reviewItemCount > 0)
    .sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (reviewLowest) {
    return `Review ${reviewLowest.subject} next, starting with the saved questions marked for attention.`;
  }

  const lowest = [...subjectProgress].sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (!lowest) {
    return "Start a timed assessment to generate your first progress signals.";
  }

  return `Revise ${lowest.subject} next, starting with ${lowest.recommendedFocus}.`;
}

function getNextBestActionHref(subjectProgress: PowerGridSubjectProgress[]): string {
  const activeLowest = [...subjectProgress]
    .filter((subject) => subject.activeSessionCount > 0)
    .sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (activeLowest?.resumeHref) {
    return activeLowest.resumeHref;
  }

  const reviewLowest = [...subjectProgress]
    .filter((subject) => subject.reviewItemCount > 0)
    .sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (reviewLowest?.resumeHref) {
    return reviewLowest.resumeHref;
  }

  const lowest = [...subjectProgress].sort((left, right) => left.readinessScore - right.readinessScore)[0];

  return lowest?.resumeHref ?? lowest?.subjectHref ?? "/subjects";
}

function findMatchingContentSubject(
  subjectName: string,
  subjects: ReturnType<typeof listStudentVisibleContentSubjects>,
) {
  return subjects.find((subject) => normalizeLabel(subject.name).includes(normalizeLabel(subjectName)));
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function buildSubjectHref(subjectId?: string, topicId?: string): string {
  if (!subjectId) {
    return "/subjects";
  }

  const searchParams = new URLSearchParams({
    subjectId,
  });

  if (topicId) {
    searchParams.set("topicId", topicId);
  }

  return `/subjects?${searchParams.toString()}`;
}

function belongsToTrackedSubject(record: SavedProgressRecord, trackedSubject: TrackedSubject): boolean {
  if (record.entityType === "exam-session") {
    return trackedSubject.papers.some((paper) => record.entityId.startsWith(`${paper.examId}-session-`));
  }

  if (record.entityType === "timed-assessment-attempt") {
    return trackedSubject.assessments.some((assessment) =>
      record.entityId.startsWith(`${assessment.assessmentId}-attempt-`),
    );
  }

  return false;
}

function getRecommendedFocus(trackedSubject: TrackedSubject): string {
  return trackedSubject.papers[0]?.skillsFocus[0] ?? trackedSubject.topics[0]?.name ?? "Revision practice";
}

function buildSubjectEvidence(input: {
  activeSessionCount: number;
  completedSessionCount: number;
  reviewItemCount: number;
  accessSnapshotCount: number;
}): string {
  if (input.reviewItemCount > 0) {
    return `${input.reviewItemCount} review item${input.reviewItemCount === 1 ? "" : "s"} still need attention across saved activity.`;
  }

  if (input.completedSessionCount > 0) {
    return `${input.completedSessionCount} completed session${input.completedSessionCount === 1 ? "" : "s"} already contribute evidence for this subject.`;
  }

  if (input.activeSessionCount > 0) {
    return `${input.activeSessionCount} active session${input.activeSessionCount === 1 ? "" : "s"} are building readiness signals for this subject.`;
  }

  return input.accessSnapshotCount > 0
    ? "Saved access snapshots are already attached to this subject activity."
    : "Activity is seeded and ready to build stronger evidence.";
}

function getResumeHref(records: SavedProgressRecord[]): string | undefined {
  return buildResumeHref(records.find((record) => record.status !== "submitted") ?? records[0]);
}

function buildResumeHref(record?: SavedProgressRecord): string | undefined {
  if (!record) {
    return undefined;
  }

  if (record.status === "submitted") {
    return "/results";
  }

  if (record.entityType === "exam-session" && record.examProgress) {
    const examId = record.entityId.replace(/-session-\d+$/, "");
    const searchParams = new URLSearchParams({
      examId,
      questionId: record.examProgress.currentQuestionId,
    });

    return `/exams?${searchParams.toString()}`;
  }

  if (record.entityType === "timed-assessment-attempt" && record.timedAssessmentProgress) {
    const assessmentId = record.entityId.replace(/-attempt-.+$/, "");
    const searchParams = new URLSearchParams({
      assessmentId,
      durationMinutes: String(record.timedAssessmentProgress.selectedDurationMinutes),
    });

    if (record.timedAssessmentProgress.currentQuestionId) {
      searchParams.set("questionId", record.timedAssessmentProgress.currentQuestionId);
    }

    return `/assessments?${searchParams.toString()}`;
  }

  return undefined;
}
