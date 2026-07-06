import { getMockExamSession } from "@/modules/exam-engine/service";
import { listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";
import type { ExamPaper } from "@/modules/exam-engine/types";
import { buildAcademicReinforcementOverview } from "@/modules/academic-coverage/reinforcement-service";
import { getSavedProgressSessionInsights } from "@/modules/saved-progress/insights-service";
import {
  findSavedProgressSessionSummary,
  getSavedProgressOverview,
} from "@/modules/saved-progress/overview-service";
import { listSavedProgressByUser } from "@/modules/saved-progress/service";
import type { SavedProgressRecord, SavedProgressRepository } from "@/modules/saved-progress/types";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { TimedAssessmentDefinition } from "@/modules/timed-assessment/types";
import {
  listStudentVisibleContentTopics,
  listStudentVisibleContentSubjects,
  listStudentVisibleContentTopicsForSubject,
} from "@/modules/content/service";
import { listQuizProgressByUser } from "@/modules/quiz/service";
import type { QuizProgressRecord, QuizProgressRepository } from "@/modules/quiz/types";
import type { MvpCatalogSubject, MvpCatalogTopic } from "@/modules/content/types";
import type { PowerGridLevel, PowerGridSummary, PowerGridSubjectProgress, PowerGridTrend } from "./types";
import type { LearnerOnboardingProfile } from "@/modules/onboarding/types";
import {
  filterAssessmentsForOnboardingProfile,
  filterCatalogSubjectsForOnboardingProfile,
  filterExamPapersForOnboardingProfile,
  isOnboardingPersonalizationActive,
} from "@/modules/onboarding/personalization";

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
  quizProgressRepository?: QuizProgressRepository;
  onboardingProfile?: LearnerOnboardingProfile | null;
}): Promise<PowerGridSummary> {
  const userId = options?.userId ?? "student-demo";
  const repository = options?.savedProgressRepository;
  const quizRepository = options?.quizProgressRepository;
  const profile = options?.onboardingProfile ?? null;
  const allPapers = listStudentVisibleExamPapers();
  const allAssessments = getMockTimedAssessments();
  const allContentSubjects = listStudentVisibleContentSubjects();
  const papers =
    profile && isOnboardingPersonalizationActive(profile)
      ? filterExamPapersForOnboardingProfile(allPapers, profile)
      : allPapers;
  const assessments =
    profile && isOnboardingPersonalizationActive(profile)
      ? filterAssessmentsForOnboardingProfile(allAssessments, profile)
      : allAssessments;
  const contentSubjects = filterCatalogSubjectsForOnboardingProfile(allContentSubjects, profile);
  const contentTopics = listStudentVisibleContentTopics().filter((topic) =>
    contentSubjects.some((subject) => subject.subjectId === topic.subjectId),
  );

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
  const quizRecords = await listQuizProgressByUser(userId, quizRepository);
  const savedProgressOverview = await getSavedProgressOverview({
    userId,
    savedProgressRepository: repository,
  });
  const reinforcementOverview = buildAcademicReinforcementOverview({
    records,
    subjects: contentSubjects.map((subject) => ({
      subjectId: subject.subjectId,
      name: subject.name,
    })),
    topics: contentTopics.map((topic) => ({
      topicId: topic.topicId,
      subjectId: topic.subjectId,
      name: topic.name,
    })),
    examPapers: papers.map((paper) => ({
      examId: paper.examId,
      subject: paper.subject,
    })),
    timedAssessments: assessments.map((assessment) => ({
      assessmentId: assessment.assessmentId,
      subject: assessment.subject,
    })),
  });
  const trackedSubjects = buildTrackedSubjects(papers, assessments, contentSubjects);

  const subjectProgress = trackedSubjects
    .map((trackedSubject) =>
      buildSubjectProgress(
        trackedSubject,
        records,
        quizRecords,
        savedProgressOverview.sessions,
        reinforcementOverview,
      ),
    )
    .filter((subject): subject is PowerGridSubjectProgress => Boolean(subject));

  const overallReadinessScore = Math.round(
    subjectProgress.reduce((total, subject) => total + subject.readinessScore, 0) /
      Math.max(subjectProgress.length, 1),
  );
  const activeCount = records.filter((record) => record.status !== "submitted").length;
  const completedCount = records.filter((record) => record.status === "submitted").length;
  const quizAttemptCount = quizRecords.reduce((total, record) => total + record.attemptsCount, 0);
  const quizCorrectCount = quizRecords.reduce((total, record) => total + record.correctCount, 0);
  const quizAccuracyPercentage = calculateCompletionScore(quizCorrectCount, quizAttemptCount);
  const xpTotal = subjectProgress.reduce((total, subject) => total + subject.xpEarned, 0);
  const voltagePointsTotal = subjectProgress.reduce((total, subject) => total + subject.voltagePoints, 0);
  const accessSnapshotCoverage = calculateCompletionScore(
    records.filter((record) => record.accessArrangementSnapshot).length,
    records.length,
  );
  const latestActivityAt = records[0]?.lastActivityAt;
  const subjectsWithoutEvidence = trackedSubjects.filter(
    (trackedSubject) => !subjectProgress.some((subject) => normalizeLabel(subject.subject) === normalizeLabel(trackedSubject.subject)),
  );
  const sourceWarnings: string[] = [];

  if (trackedSubjects.length === 0) {
    sourceWarnings.push("No tracked subjects could be assembled from the current seeded papers and timed assessments.");
  }

  if (subjectsWithoutEvidence.length > 0) {
    sourceWarnings.push(
      `${subjectsWithoutEvidence.length} tracked subject${subjectsWithoutEvidence.length === 1 ? "" : "s"} do not yet have safe saved evidence in the Power Grid summary.`,
    );
  }

  if (subjectProgress.length === 0) {
    sourceWarnings.push("No subject progress summaries could be built from the current saved activity.");
  }

  const dataState = subjectProgress.length === 0 ? "degraded" : "ready";
  const continuityHref = savedProgressOverview.continuity.primaryAction.href;
  const nextBestAction = getNextBestAction(
    subjectProgress,
    sourceWarnings,
    continuityHref,
    savedProgressOverview.continuity.primaryAction.title,
    reinforcementOverview.weakestTopic,
  );
  const nextBestActionHref = getNextBestActionHref(
    subjectProgress,
    sourceWarnings,
    continuityHref,
    reinforcementOverview.weakestTopic?.href,
  );

  return {
    dataState,
    overallLevel: getLevelFromScore(overallReadinessScore),
    overallTrend: getTrendFromScore(overallReadinessScore),
    examReadinessScore: overallReadinessScore,
    completedSessionCount: completedCount,
    activeSessionCount: activeCount,
    quizAttemptCount,
    quizCorrectCount,
    quizAccuracyPercentage,
    xpTotal,
    voltagePointsTotal,
    trackedSubjectCount: subjectProgress.length,
    subjectsNeedingAttentionCount: subjectProgress.filter((subject) => subject.readinessScore < 50).length,
    accessSnapshotCoverage,
    latestActivityAt,
    resumeHref: continuityHref,
    nextBestAction,
    nextBestActionHref,
    recoveryTitle:
      dataState === "degraded" ? "Power Grid does not have enough reliable saved evidence yet." : undefined,
    recoveryDescription:
      dataState === "degraded"
        ? "The route loaded, but there is not enough safe subject evidence to present a trustworthy readiness breakdown. The safest next step is to resume saved work or start a fresh timed checkpoint to rebuild progress signals."
        : undefined,
    sourceWarnings,
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
  quizRecords: QuizProgressRecord[],
  sessions: Awaited<ReturnType<typeof getSavedProgressOverview>>["sessions"],
  reinforcementOverview: ReturnType<typeof buildAcademicReinforcementOverview>,
): PowerGridSubjectProgress | null {
  const subjectRecords = records.filter((record) => belongsToTrackedSubject(record, trackedSubject));
  const subjectTopicIds = new Set(trackedSubject.topics.map((topic) => topic.topicId));
  const subjectQuizRecords = quizRecords.filter((record) => subjectTopicIds.has(record.topicId));

  if (subjectRecords.length === 0 && subjectQuizRecords.length === 0) {
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
    examRecords.map((record) => getSavedProgressSessionInsights(record).completionPercentage),
  );
  const assessmentCompletion = getAverageScore(
    assessmentRecords.map((record) => getSavedProgressSessionInsights(record).completionPercentage),
  );
  const completionScore = getAverageScore(
    [examCompletion, assessmentCompletion, getQuizAccuracyPercentage(subjectQuizRecords)].filter((score) => score > 0),
  );
  const completedSessionCount = subjectRecords.filter((record) => record.status === "submitted").length;
  const activeSessionCount = subjectRecords.length - completedSessionCount;
  const reviewItemCount = subjectRecords.reduce(
    (total, record) => total + getSavedProgressSessionInsights(record).reviewItemCount,
    0,
  );
  const accessSnapshotCount = subjectRecords.filter(
    (record) => getSavedProgressSessionInsights(record).hasAccessSnapshot,
  ).length;
  const completionCoverage = calculateCompletionScore(completedSessionCount, subjectRecords.length);
  const accessCoverage = calculateCompletionScore(accessSnapshotCount, subjectRecords.length);
  const reviewStabilityScore = Math.max(0, 100 - Math.min(reviewItemCount * 15, 80));
  const activityDepthScore = Math.min(subjectRecords.length * 25, 100);
  const quizAttemptCount = subjectQuizRecords.reduce((total, record) => total + record.attemptsCount, 0);
  const quizCorrectCount = subjectQuizRecords.reduce((total, record) => total + record.correctCount, 0);
  const quizAccuracyPercentage = calculateCompletionScore(quizCorrectCount, quizAttemptCount);
  const quizCoverage = calculateCompletionScore(subjectQuizRecords.length, trackedSubject.topics.length);
  const readinessScore = Math.round(
    completionScore * 0.45 +
      completionCoverage * 0.18 +
      accessCoverage * 0.08 +
      reviewStabilityScore * 0.09 +
      activityDepthScore * 0.05 +
      quizAccuracyPercentage * 0.1 +
      quizCoverage * 0.05,
  );
  const xpEarned =
    completedSessionCount * 30 +
    activeSessionCount * 10 +
    quizCorrectCount * 12 +
    Math.max(quizAttemptCount - quizCorrectCount, 0) * 4;
  const voltagePoints = readinessScore + quizCorrectCount * 5 + completedSessionCount * 10;
  const subjectReinforcement = reinforcementOverview.subjectSignals.find(
    (signal) => normalizeLabel(signal.subject) === normalizeLabel(trackedSubject.subject),
  );
  const recommendedFocus = subjectReinforcement?.recommendedFocus ?? getRecommendedFocus(trackedSubject);
  const recommendedTopic = trackedSubject.topics.find(
    (topic) => normalizeLabel(topic.name) === normalizeLabel(recommendedFocus),
  );
  const resumeRecord = subjectRecords.find((record) => record.status !== "submitted") ?? subjectRecords[0];
  const resumeSession = resumeRecord
    ? findSavedProgressSessionSummary(sessions, resumeRecord.entityType, resumeRecord.entityId)
    : undefined;
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
    quizAttemptCount,
    quizCorrectCount,
    quizAccuracyPercentage,
    xpEarned,
    voltagePoints,
    reviewItemCount,
    accessSnapshotCount,
    recommendedFocus,
    recommendedTopicId: subjectReinforcement?.recommendedTopicId ?? recommendedTopic?.topicId,
    subjectHref:
      subjectReinforcement?.primaryTopic?.href ??
      buildSubjectHref(trackedSubject.subjectId, recommendedTopic?.topicId),
    resumeHref: resumeSession?.href,
    lastActivityAt,
    evidence:
      subjectReinforcement?.evidence ??
      buildSubjectEvidence({
        activeSessionCount,
        completedSessionCount,
        quizAttemptCount,
        quizCorrectCount,
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

function getQuizAccuracyPercentage(records: QuizProgressRecord[]): number {
  const attemptsCount = records.reduce((total, record) => total + record.attemptsCount, 0);
  const correctCount = records.reduce((total, record) => total + record.correctCount, 0);

  return calculateCompletionScore(correctCount, attemptsCount);
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

function getNextBestAction(
  subjectProgress: PowerGridSubjectProgress[],
  sourceWarnings: string[],
  resumeHref: string,
  continuityTitle: string,
  weakestTopic?: ReturnType<typeof buildAcademicReinforcementOverview>["weakestTopic"],
): string {
  if (subjectProgress.length === 0) {
    return resumeHref
      ? "Resume the latest saved session first so Power Grid can rebuild from a safe evidence trail."
      : "Start a timed assessment to rebuild the first safe Power Grid signals.";
  }

  if (sourceWarnings.length > 0) {
    const activeLowest = [...subjectProgress]
      .filter((subject) => subject.activeSessionCount > 0)
      .sort((left, right) => left.readinessScore - right.readinessScore)[0];

    if (activeLowest?.resumeHref) {
      return `Resume ${activeLowest.subject} first so Power Grid can rely on a stronger saved evidence trail before comparing subjects.`;
    }

    return "Open saved progress or start a fresh checkpoint before relying on this Power Grid comparison too heavily.";
  }

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

  if (weakestTopic) {
    return `Revise ${weakestTopic.subject} next, starting with ${weakestTopic.topic}.`;
  }

  const lowest = [...subjectProgress].sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (!lowest) {
    return "Start a timed assessment to generate your first progress signals.";
  }

  return `Revise ${lowest.subject} next, starting with ${lowest.recommendedFocus}.`;
}

function getNextBestActionHref(
  subjectProgress: PowerGridSubjectProgress[],
  sourceWarnings: string[],
  resumeHref?: string,
  weakestTopicHref?: string,
): string {
  if (subjectProgress.length === 0) {
    return resumeHref ?? "/assessments";
  }

  if (sourceWarnings.length > 0) {
    const activeLowest = [...subjectProgress]
      .filter((subject) => subject.activeSessionCount > 0)
      .sort((left, right) => left.readinessScore - right.readinessScore)[0];

    return activeLowest?.resumeHref ?? resumeHref ?? "/saved-progress";
  }

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

  if (weakestTopicHref) {
    return weakestTopicHref;
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
  quizAttemptCount: number;
  quizCorrectCount: number;
  reviewItemCount: number;
  accessSnapshotCount: number;
}): string {
  if (input.reviewItemCount > 0) {
    return `${input.reviewItemCount} review item${input.reviewItemCount === 1 ? "" : "s"} still need attention across saved activity.`;
  }

  if (input.quizAttemptCount > 0) {
    return `${input.quizCorrectCount}/${input.quizAttemptCount} quiz answers are now contributing to this subject's XP and voltage totals.`;
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
