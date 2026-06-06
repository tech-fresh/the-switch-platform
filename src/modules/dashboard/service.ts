import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type {
  DashboardFocusCard,
  DashboardHomeData,
  DashboardMetric,
  DashboardRouteCard,
  DashboardSessionCard,
} from "./types";

export async function getDashboardHomeData(): Promise<DashboardHomeData> {
  const [summary, savedProgress] = await Promise.all([
    getMockPowerGridSummary(),
    getSavedProgressOverview(),
  ]);
  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();

  const examSessions = await Promise.all(
    papers.map(async (paper) => ({ paper, session: await getMockExamSession(paper.examId) })),
  );
  const assessmentSessions = await Promise.all(
    assessments.map(async (assessment) => ({
      assessment,
      seed: await getMockTimedAssessmentAttemptSeed(assessment.assessmentId),
    })),
  );

  const metrics: DashboardMetric[] = [
    {
      label: "Power Grid level",
      value: summary.overallLevel,
      detail: `${summary.overallTrend} trend from current student activity`,
      tone: "teal",
    },
    {
      label: "Exam readiness",
      value: `${summary.examReadinessScore} / 100`,
      detail: "Calculated from live exam and timed assessment signals",
      tone: "emerald",
    },
    {
      label: "Active sessions",
      value: String(summary.activeSessionCount),
      detail: `${summary.completedSessionCount} already fully completed`,
      tone: "amber",
    },
    {
      label: "Subjects watched",
      value: String(summary.subjectProgress.length),
      detail: "Each subject gets its own focus and readiness signal",
      tone: "sky",
    },
  ];

  const routeCards: DashboardRouteCard[] = [
    {
      href: "/dashboard",
      eyebrow: "Student home",
      title: "Open the live dashboard",
      description: "See readiness, next-step guidance, and session status in one place.",
      stat: `${summary.examReadinessScore} / 100 readiness`,
      tone: "teal",
    },
    {
      href: "/account",
      eyebrow: "Account",
      title: "Open your student account",
      description: "See signed-in identity, account-linked support, and quick routes back into study.",
      stat: "Account-linked MVP",
      tone: "sky",
    },
    {
      href: "/progress",
      eyebrow: "Power Grid",
      title: "Inspect revision momentum",
      description: "Track subject trends, evidence, and the next best revision move.",
      stat: summary.overallLevel,
      tone: "sky",
    },
    {
      href: "/exams",
      eyebrow: "Exam Engine",
      title: "Resume a full paper",
      description: "Continue a paper with autosave state, flags, and adjusted exam timing.",
      stat: `${examSessions.length} mock papers ready`,
      tone: "teal",
    },
    {
      href: "/assessments",
      eyebrow: "Timed practice",
      title: "Start a short checkpoint",
      description: "Choose a capped duration and jump back into a saved assessment attempt.",
      stat: `${assessmentSessions.length} timed checkpoints`,
      tone: "emerald",
    },
    {
      href: "/saved-progress",
      eyebrow: "Saved Progress",
      title: "Resume from autosave",
      description: "See every in-progress exam and checkpoint record in one resume surface.",
      stat: `${savedProgress.activeCount} active resumes`,
      tone: "amber",
    },
    {
      href: "/support",
      eyebrow: "Support Hub",
      title: "Open trusted student support",
      description: "Find reputable UK support links, urgent help routes, and exam stress guides.",
      stat: "NHS + charity signposting",
      tone: "sky",
    },
    {
      href: "/recommendations",
      eyebrow: "Recommendations",
      title: "Follow the next best move",
      description: "See ordered student actions built from readiness, support, results, and saved activity.",
      stat: summary.nextBestAction,
      tone: "rose",
    },
    {
      href: "/accessibility",
      eyebrow: "Accessibility",
      title: "Prepare support settings",
      description: "Keep read aloud and future access arrangements connected through the service layer.",
      stat: "Snapshot-aware foundation",
      tone: "amber",
    },
    {
      href: "/results",
      eyebrow: "Results",
      title: "Review completed session outcomes",
      description: "See score summaries, review flags, and next-step guidance after practice and exam sessions.",
      stat: `${summary.activeSessionCount} result sources`,
      tone: "rose",
    },
  ];

  const examSessionCards: DashboardSessionCard[] = examSessions.map(({ paper, session }) => {
    const answeredCount = session.questionResponses.filter((response) => response.selectedOptionId).length;
    const flaggedCount = session.questionResponses.filter((response) => response.flagged).length;
    const completionPercentage = Math.round((answeredCount / Math.max(paper.questions.length, 1)) * 100);
    const supportCount =
      session.accessArrangements?.accessArrangementApplication.activeAccessArrangements.length ?? 0;
    const readAloudEnabled =
      session.accessArrangements?.accessArrangementApplication.readAloud.enabled ?? false;

    return {
      sessionId: session.examSessionId,
      href: "/exams",
      kind: "exam",
      title: paper.title,
      subtitle: `${paper.board} ${paper.paperName} • ${paper.durationMinutes} mins official`,
      completionPercentage,
      timeLabel: `${session.timeRemainingMinutes} mins remaining`,
      statusLabel: flaggedCount > 0 ? `${flaggedCount} flagged for review` : "No flagged questions",
      supportLabel:
        supportCount > 0
          ? `${supportCount} support adjustments active`
          : readAloudEnabled
            ? "Read aloud enabled"
            : "Support-ready through access profile layer",
      focusLabel: paper.skillsFocus[0] ?? "Exam focus available",
      reviewCount: flaggedCount,
    };
  });

  const assessmentSessionCards: DashboardSessionCard[] = assessmentSessions.map(
    ({ assessment, seed }) => {
      const completionPercentage = Math.round(
        (seed.selectedAnswerIds.length / Math.max(assessment.questionCount, 1)) * 100,
      );

      return {
        sessionId: seed.attempt.attemptId,
        href: "/assessments",
        kind: "assessment",
        title: assessment.title,
        subtitle: `${assessment.subject} • cap ${assessment.officialDurationMinutes} mins`,
        completionPercentage,
        timeLabel: `${seed.attempt.timeRemainingMinutes} mins remaining`,
        statusLabel: `${seed.bookmarkedQuestionIds.length} bookmarked checkpoint items`,
        supportLabel: seed.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot
          ? "Access snapshot captured for resume"
          : "No access snapshot yet",
        focusLabel: seed.currentQuestionId ? `Resume from ${seed.currentQuestionId}` : "Ready to start",
        reviewCount: seed.bookmarkedQuestionIds.length,
      };
    },
  );

  const focusCards: DashboardFocusCard[] = summary.subjectProgress.map((subject) => ({
    subject: subject.subject,
    level: subject.level,
    trend: subject.trend,
    readinessScore: subject.readinessScore,
    recommendedFocus: subject.recommendedFocus,
    evidence: subject.evidence,
  }));

  const strongestSubject = [...focusCards].sort(
    (left, right) => right.readinessScore - left.readinessScore,
  )[0];
  const weakestSubject = [...focusCards].sort(
    (left, right) => left.readinessScore - right.readinessScore,
  )[0];
  const readAloudReadyCount = examSessions.filter(
    ({ session }) => session.accessArrangements?.accessArrangementApplication.readAloud.enabled,
  ).length;

  return {
    summary,
    metrics,
    routeCards,
    examSessions: examSessionCards,
    assessmentSessions: assessmentSessionCards,
    focusCards,
    strongestSubject,
    weakestSubject,
    recommendedAction: summary.nextBestAction,
    supportSnapshotSummary:
      readAloudReadyCount > 0
        ? `${readAloudReadyCount} active exam sessions already have read aloud enabled.`
        : "Saved progress already stores access snapshots, so future support settings can travel with the student session.",
  };
}
