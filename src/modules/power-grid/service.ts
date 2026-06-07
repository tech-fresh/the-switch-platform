import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import { listSeedContentSubjects, listSeedContentTopicsForSubject } from "@/modules/content/service";
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

export async function getMockPowerGridSummary(): Promise<PowerGridSummary> {
  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();
  const contentSubjects = listSeedContentSubjects();

  const examSessions = await Promise.all(
    papers.map((paper) => getMockExamSession(paper.examId)),
  );
  const assessmentSeeds = await Promise.all(
    assessments.map((assessment) => getMockTimedAssessmentAttemptSeed(assessment.assessmentId)),
  );

  const subjectProgress = papers.map((paper) => {
    const matchingSubject = findMatchingContentSubject(paper.subject, contentSubjects);
    const matchingTopics = matchingSubject
      ? listSeedContentTopicsForSubject(matchingSubject.subjectId)
      : [];
    const matchingExamSession = examSessions.find((session) => session.examId === paper.examId);
    const matchingAssessments = assessmentSeeds.filter(
      (seed) =>
        assessments.find((assessment) => assessment.assessmentId === seed.attempt.assessmentId)?.subject ===
        paper.subject,
    );

    const examCompletion = matchingExamSession
      ? calculateCompletionScore(
          matchingExamSession.questionResponses.filter((response) => response.selectedOptionId).length,
          matchingExamSession.questions.length,
        )
      : 0;

    const assessmentCompletion =
      matchingAssessments.length > 0
        ? Math.round(
            matchingAssessments.reduce(
              (total, seed) =>
                total +
                calculateCompletionScore(
                  seed.selectedAnswerIds.length,
                  assessments.find((assessment) => assessment.assessmentId === seed.attempt.assessmentId)
                    ?.questionCount ?? 1,
                ),
              0,
            ) / matchingAssessments.length,
          )
        : 0;

    const readinessScore = Math.round(examCompletion * 0.6 + assessmentCompletion * 0.4);
    const trend = getTrendFromScore(readinessScore);
    const recommendedFocus = paper.skillsFocus[0] ?? "Revision practice";
    const recommendedTopic = matchingTopics.find(
      (topic) => normalizeLabel(topic.name) === normalizeLabel(recommendedFocus),
    );

    return {
      subject: paper.subject,
      subjectId: matchingSubject?.subjectId,
      level: getLevelFromScore(readinessScore),
      trend,
      readinessScore,
      completionScore: Math.round((examCompletion + assessmentCompletion) / 2),
      recommendedFocus,
      recommendedTopicId: recommendedTopic?.topicId,
      subjectHref: buildSubjectHref(matchingSubject?.subjectId, recommendedTopic?.topicId),
      evidence:
        matchingExamSession && matchingExamSession.questionResponses.some((response) => response.flagged)
          ? "Flagged review points still open in the latest session."
          : "Recent activity is moving steadily through the current paper.",
    } satisfies PowerGridSubjectProgress;
  });

  const overallReadinessScore = Math.round(
    subjectProgress.reduce((total, subject) => total + subject.readinessScore, 0) /
      Math.max(subjectProgress.length, 1),
  );

  return {
    overallLevel: getLevelFromScore(overallReadinessScore),
    overallTrend: getTrendFromScore(overallReadinessScore),
    examReadinessScore: overallReadinessScore,
    completedSessionCount: examSessions.filter((session) =>
      session.questionResponses.every((response) => response.selectedOptionId),
    ).length,
    activeSessionCount: examSessions.length + assessmentSeeds.length,
    nextBestAction: getNextBestAction(subjectProgress),
    nextBestActionHref: getNextBestActionHref(subjectProgress),
    subjectProgress,
  };
}

function calculateCompletionScore(answeredCount: number, totalCount: number): number {
  return Math.round((answeredCount / Math.max(totalCount, 1)) * 100);
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

function getNextBestAction(subjectProgress: PowerGridSubjectProgress[]): string {
  const lowest = [...subjectProgress].sort((left, right) => left.readinessScore - right.readinessScore)[0];

  if (!lowest) {
    return "Start a timed assessment to generate your first progress signals.";
  }

  return `Revise ${lowest.subject} next, starting with ${lowest.recommendedFocus}.`;
}

function getNextBestActionHref(subjectProgress: PowerGridSubjectProgress[]): string {
  const lowest = [...subjectProgress].sort((left, right) => left.readinessScore - right.readinessScore)[0];

  return lowest?.subjectHref ?? "/subjects";
}

function findMatchingContentSubject(
  subjectName: string,
  subjects: ReturnType<typeof listSeedContentSubjects>,
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
