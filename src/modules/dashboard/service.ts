import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";
import {
  buildAccessibilityPreferenceChips,
  buildAccessibilitySupportSummary,
} from "@/modules/accessibility/presentation";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import {
  findSavedProgressSessionSummary,
  getSavedProgressOverview,
} from "@/modules/saved-progress/overview-service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type {
  DashboardFocusCard,
  DashboardHomeData,
  DashboardMetric,
  DashboardRouteCard,
  DashboardSessionCard,
} from "./types";

export async function getDashboardHomeData(userId = "guest-preview"): Promise<DashboardHomeData> {
  const [summary, savedProgress] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getSavedProgressOverview({ userId }),
  ]);
  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();

  const examSessions = await Promise.all(
    papers.map(async (paper) => ({
      paper,
      session: await getMockExamSession(paper.examId, { userId }),
    })),
  );
  const assessmentSessions = await Promise.all(
    assessments.map(async (assessment) => ({
      assessment,
      seed: await getMockTimedAssessmentAttemptSeed(assessment.assessmentId, { userId }),
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

  const resumeExamSession = savedProgress.sessions.find((session) => session.entityType === "exam-session");
  const resumeAssessmentSession = savedProgress.sessions.find(
    (session) => session.entityType === "timed-assessment-attempt",
  );
  const resumeAnySessionHref =
    savedProgress.resumeSessionHref ?? savedProgress.reviewSessionHref ?? savedProgress.latestSessionHref;

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
      href: "/how-it-works",
      eyebrow: "Website guide",
      title: "Learn how the website works",
      description: "Follow the student journey step by step and click into each core route.",
      stat: "Step-by-step walkthrough",
      tone: "sky",
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
      href: resumeExamSession?.href ?? "/exams",
      eyebrow: "Exam Engine",
      title: "Resume a full paper",
      description: "Continue a paper with autosave state, flags, and adjusted exam timing.",
      stat: resumeExamSession?.currentQuestionLabel ?? `${examSessions.length} mock papers ready`,
      tone: "teal",
    },
    {
      href: resumeAssessmentSession?.href ?? "/assessments",
      eyebrow: "Timed practice",
      title: "Start a short checkpoint",
      description: "Choose a capped duration and jump back into a saved assessment attempt.",
      stat: resumeAssessmentSession?.currentQuestionLabel ?? `${assessmentSessions.length} timed checkpoints`,
      tone: "emerald",
    },
    {
      href: resumeAnySessionHref ?? "/saved-progress",
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
    const completionPercentage = Math.round((answeredCount / Math.max(session.questions.length, 1)) * 100);
    const supportCount =
      session.accessArrangements?.accessArrangementApplication.activeAccessArrangements.length ?? 0;
    const readAloudEnabled =
      session.accessArrangements?.accessArrangementApplication.readAloud.enabled ?? false;
    const matchingSavedSession = findSavedProgressSessionSummary(
      savedProgress.sessions,
      "exam-session",
      session.examSessionId,
    );
    const status = matchingSavedSession?.status === "submitted" ? "submitted" : "in-progress";

    const supportSnapshot =
      session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot;

    return {
      sessionId: session.examSessionId,
      href: matchingSavedSession?.href ?? "/exams",
      kind: "exam",
      status,
      title: paper.title,
      subtitle: `${paper.board} ${paper.paperName} • attempt ${session.attemptNumber}`,
      completionPercentage,
      timeLabel:
        status === "submitted"
          ? "Paper submitted and ready for review"
          : `${session.timeRemainingMinutes} mins remaining`,
      statusLabel:
        status === "submitted"
          ? "Latest saved snapshot is now locked for review"
          : flaggedCount > 0
            ? `${flaggedCount} flagged for review`
            : "No flagged questions",
      supportLabel:
        supportCount > 0
          ? buildAccessibilitySupportSummary(supportSnapshot)
          : readAloudEnabled
            ? "Read aloud enabled"
            : "Support-ready through access profile layer",
      supportPreferenceChips: buildAccessibilityPreferenceChips(supportSnapshot),
      focusLabel: paper.skillsFocus[0] ?? "Exam focus available",
      reviewCount: flaggedCount,
      actionLabel: status === "submitted" ? "Reopen review" : "Resume paper",
    };
  });

  const assessmentSessionCards: DashboardSessionCard[] = assessmentSessions.map(
    ({ assessment, seed }) => {
      const completionPercentage = Math.round(
        (seed.selectedAnswerIds.length / Math.max(assessment.questionCount, 1)) * 100,
      );
      const matchingSavedSession = findSavedProgressSessionSummary(
        savedProgress.sessions,
        "timed-assessment-attempt",
        seed.attempt.attemptId,
      );
      const status = matchingSavedSession?.status === "submitted" ? "submitted" : "in-progress";
      const supportSnapshot =
        seed.attempt.accessArrangements?.accessArrangementApplication.savedProgressSnapshot;

      return {
        sessionId: seed.attempt.attemptId,
        href: matchingSavedSession?.href ?? "/assessments",
        kind: "assessment",
        status,
        title: assessment.title,
        subtitle: `${assessment.subject} • cap ${assessment.officialDurationMinutes} mins`,
        completionPercentage,
        timeLabel:
          status === "submitted"
            ? "Checkpoint submitted and ready for review"
            : `${seed.attempt.timeRemainingMinutes} mins remaining`,
        statusLabel:
          status === "submitted"
            ? `${seed.bookmarkedQuestionIds.length} bookmarked review item${
                seed.bookmarkedQuestionIds.length === 1 ? "" : "s"
              } saved with the attempt`
            : `${seed.bookmarkedQuestionIds.length} bookmarked checkpoint items`,
        supportLabel: supportSnapshot
          ? buildAccessibilitySupportSummary(supportSnapshot)
          : "No access snapshot yet",
        supportPreferenceChips: buildAccessibilityPreferenceChips(supportSnapshot),
        focusLabel: seed.currentQuestionId ? `Resume from ${seed.currentQuestionId}` : "Ready to start",
        reviewCount: seed.bookmarkedQuestionIds.length,
        actionLabel: status === "submitted" ? "Reopen review" : "Resume checkpoint",
      };
    },
  );

  const sortedExamSessionCards = [...examSessionCards].sort(sortDashboardSessions);
  const sortedAssessmentSessionCards = [...assessmentSessionCards].sort(sortDashboardSessions);

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
  const latestSupportSnapshot =
    savedProgress.sessions.find((session) => session.supportPreferenceChips.length > 0)
      ?.supportPreferenceChips ?? [];

  return {
    summary,
    metrics,
    routeCards,
    examSessions: sortedExamSessionCards,
    assessmentSessions: sortedAssessmentSessionCards,
    focusCards,
    strongestSubject,
    weakestSubject,
    recommendedAction: summary.nextBestAction,
    supportSnapshotSummary:
      readAloudReadyCount > 0
        ? `${readAloudReadyCount} active exam sessions already have read aloud enabled.`
        : "Saved progress already stores access snapshots, so future support settings can travel with the student session.",
    supportPreferenceChips: latestSupportSnapshot,
  };
}

function sortDashboardSessions(
  left: DashboardSessionCard,
  right: DashboardSessionCard,
): number {
  if (left.status !== right.status) {
    return left.status === "in-progress" ? -1 : 1;
  }

  if (left.completionPercentage !== right.completionPercentage) {
    return right.completionPercentage - left.completionPercentage;
  }

  return left.title.localeCompare(right.title);
}
