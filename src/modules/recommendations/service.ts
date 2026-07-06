import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { buildAcademicReinforcementOverview } from "@/modules/academic-coverage/reinforcement-service";
import {
  buildAccessibilityPreferenceChips,
  buildAccessibilitySupportSummary,
} from "@/modules/accessibility/presentation";
import {
  listStudentVisibleContentSubjects,
  listStudentVisibleContentTopics,
} from "@/modules/content/service";
import { getRouteCopy } from "@/modules/language/service";
import { getOnboardingOverview } from "@/modules/onboarding/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getRecallStrengthSnapshot } from "@/modules/recall-strength/service";
import { getResultsOverview } from "@/modules/results/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { listSavedProgressByUser } from "@/modules/saved-progress/service";
import { listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";
import { getWeeklyPlannerSummary } from "@/modules/weekly-planner/service";
import {
  RECOMMENDATION_SIGNAL_WEIGHTS,
  sortRankingSignals,
  type RankingSignal,
} from "./ranking";
import type { Recommendation, RecommendationsPageData } from "./types";

export async function getStudentRecommendations(userId: string): Promise<Recommendation[]> {
  const data = await buildRecommendationData(userId);

  return buildBaseRecommendations(data);
}

export async function buildRankingSignals(userId: string): Promise<RankingSignal[]> {
  const data = await buildRecommendationData(userId);
  const recommendations = buildBaseRecommendations(data);
  const recommendationsByCategory = new Map(
    recommendations.map((recommendation) => [recommendation.category, recommendation] as const),
  );
  const signals: RankingSignal[] = [];
  const plannerItems = data.weeklyPlanner.days.flatMap((day) => day.items);
  const completedPlannerDays = data.weeklyPlanner.days.filter((day) =>
    day.items.some((item) => item.status === "completed"),
  ).length;

  const resumeSavedRecommendation = recommendationsByCategory.get("resume-saved");
  if (data.savedProgress.continuity.activeSession && resumeSavedRecommendation) {
    signals.push({
      id: "active-saved-session",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.activeSavedSession,
      recommendation: resumeSavedRecommendation,
    });
  }

  const reviewResultsRecommendation = recommendationsByCategory.get("review-results");
  if (data.results.readyForReviewCount > 0 && reviewResultsRecommendation) {
    signals.push({
      id: "review-ready-results",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.reviewReadyResults,
      recommendation: reviewResultsRecommendation,
    });
  }

  const reviseNextRecommendation = recommendationsByCategory.get("revise-next");
  if (data.recallStrength.nextDueTopic && reviseNextRecommendation) {
    signals.push({
      id: "recall-strength-due",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.recallStrengthDue,
      recommendation: reviseNextRecommendation,
    });
  }

  if (data.weakestTopic && reviseNextRecommendation) {
    signals.push({
      id: "weakest-topic",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.weakestTopic,
      recommendation: reviseNextRecommendation,
    });
  }

  const nextPlannerItem = plannerItems.find((item) => item.kind === "exam" || item.kind === "assessment");
  if (nextPlannerItem) {
    const plannerRecommendation =
      nextPlannerItem.kind === "exam"
        ? recommendationsByCategory.get("exam-readiness")
        : recommendationsByCategory.get("timed-practice");

    if (plannerRecommendation) {
      signals.push({
        id: "next-exam-in-planner",
        weight: RECOMMENDATION_SIGNAL_WEIGHTS.nextExamInPlanner,
        recommendation: plannerRecommendation,
      });
    }
  }

  const onboardingGapRecommendation = recommendationsByCategory.get("revise-next");
  if ((!data.onboardingOverview?.isComplete || data.savedProgress.sessionCount === 0) && onboardingGapRecommendation) {
    signals.push({
      id: "onboarding-gap",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.onboardingGap,
      recommendation: onboardingGapRecommendation,
    });
  }

  const revisionStreakRecommendation = recommendationsByCategory.get("timed-practice");
  if (completedPlannerDays >= 2 && revisionStreakRecommendation) {
    signals.push({
      id: "revision-streak",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.revisionStreak,
      recommendation: revisionStreakRecommendation,
    });
  }

  const accessibilityRecommendation = recommendationsByCategory.get("access-support");
  if (
    accessibilityRecommendation &&
    (data.accessibility.settings.textToSpeechEnabled ||
      data.supportPreferenceChips.length > 0)
  ) {
    signals.push({
      id: "accessibility-friendly",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.accessibilityFriendly,
      recommendation: accessibilityRecommendation,
    });
  }

  const powerGridRecommendation = pickPowerGridRecommendation(
    data.summary.nextBestActionHref,
    recommendationsByCategory,
  );
  if (powerGridRecommendation) {
    signals.push({
      id: "power-grid-next-best-action",
      weight: RECOMMENDATION_SIGNAL_WEIGHTS.powerGridNextBestAction,
      recommendation: powerGridRecommendation,
    });
  }

  return signals;
}

export async function getRankedRecommendations(userId: string): Promise<Recommendation[]> {
  const [signals, fallbackRecommendations] = await Promise.all([
    buildRankingSignals(userId),
    getStudentRecommendations(userId),
  ]);

  const ranked = sortRankingSignals(signals).map((signal) => signal.recommendation);
  const deduped = new Map<string, Recommendation>();

  for (const recommendation of [...ranked, ...fallbackRecommendations]) {
    deduped.set(recommendation.recommendationId, recommendation);
  }

  return [...deduped.values()];
}

async function buildRecommendationData(userId: string) {
  const [summary, accessibility, savedProgress, results, routeCopy, savedProgressRecords, weeklyPlanner, onboardingOverview, recallStrength] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getAccessibilitySnapshot(userId),
    getSavedProgressOverview({ userId }),
    getResultsOverview(userId),
    getRouteCopy(),
    listSavedProgressByUser(userId),
    getWeeklyPlannerSummary({ userId }),
    userId === "guest-preview" ? Promise.resolve(null) : getOnboardingOverview(userId),
    getRecallStrengthSnapshot(userId),
  ]);
  const reinforcementOverview = buildAcademicReinforcementOverview({
    records: savedProgressRecords,
    subjects: listStudentVisibleContentSubjects().map((subject) => ({
      subjectId: subject.subjectId,
      name: subject.name,
    })),
    topics: listStudentVisibleContentTopics().map((topic) => ({
      topicId: topic.topicId,
      subjectId: topic.subjectId,
      name: topic.name,
    })),
    examPapers: listStudentVisibleExamPapers().map((paper) => ({
      examId: paper.examId,
      subject: paper.subject,
    })),
    timedAssessments: getMockTimedAssessments().map((assessment) => ({
      assessmentId: assessment.assessmentId,
      subject: assessment.subject,
    })),
  });
  const lowestSubject = [...summary.subjectProgress].sort(
    (left, right) => left.readinessScore - right.readinessScore,
  )[0];
  const strongestSubject = [...summary.subjectProgress].sort(
    (left, right) => right.readinessScore - left.readinessScore,
  )[0];
  const activeSavedSession = savedProgress.continuity.activeSession;
  const submittedSavedSession = savedProgress.continuity.reviewSession;
  const hasReviewReadyResults = results.readyForReviewCount > 0;
  const weakestTopic = reinforcementOverview.weakestTopic;
  const supportSummary = buildAccessibilitySupportSummary(
    accessibility.studentAccessProfile
      ? {
          activeAccessArrangements: accessibility.studentAccessProfile.activeAccessArrangements,
          preferredReadingSpeed: accessibility.studentAccessProfile.preferredReadingSpeed,
          preferredFontSize: accessibility.studentAccessProfile.preferredFontSize,
          preferredColourScheme: accessibility.studentAccessProfile.preferredColourScheme,
          textToSpeechEnabled: accessibility.studentAccessProfile.textToSpeechEnabled,
          accessibilityPreferences: accessibility.studentAccessProfile.accessibilityPreferences,
          capturedAt: new Date().toISOString(),
        }
      : undefined,
  );
  const supportPreferenceChips = buildAccessibilityPreferenceChips(
    accessibility.studentAccessProfile
      ? {
          activeAccessArrangements: accessibility.studentAccessProfile.activeAccessArrangements,
          preferredReadingSpeed: accessibility.studentAccessProfile.preferredReadingSpeed,
          preferredFontSize: accessibility.studentAccessProfile.preferredFontSize,
          preferredColourScheme: accessibility.studentAccessProfile.preferredColourScheme,
          textToSpeechEnabled: accessibility.studentAccessProfile.textToSpeechEnabled,
          accessibilityPreferences: accessibility.studentAccessProfile.accessibilityPreferences,
          capturedAt: new Date().toISOString(),
        }
      : undefined,
  );

  return {
    userId,
    summary,
    accessibility,
    savedProgress,
    results,
    routeCopy,
    savedProgressRecords,
    weeklyPlanner,
    onboardingOverview,
    recallStrength,
    reinforcementOverview,
    lowestSubject,
    strongestSubject,
    activeSavedSession,
    submittedSavedSession,
    hasReviewReadyResults,
    weakestTopic,
    supportSummary,
    supportPreferenceChips,
  };
}

function buildBaseRecommendations(data: Awaited<ReturnType<typeof buildRecommendationData>>): Recommendation[] {
  const {
    userId,
    lowestSubject,
    strongestSubject,
    activeSavedSession,
    submittedSavedSession,
    hasReviewReadyResults,
    recallStrength,
    weakestTopic,
    supportSummary,
    supportPreferenceChips,
    accessibility,
    routeCopy,
    savedProgress,
    results,
  } = data;

  return [
    {
      recommendationId: "rec-revise-next",
      userId,
      category: "revise-next",
      eyebrow: "Revise next",
      title: recallStrength.nextDueTopic
        ? `Review ${recallStrength.nextDueTopic.topicId} next`
        : weakestTopic
          ? `Revise ${weakestTopic.topic} in ${weakestTopic.subject} next`
          : `Revise ${lowestSubject?.subject ?? "your weakest subject"} next`,
      description:
        recallStrength.nextDueTopic
          ? "Recall Strength shows this topic is due for review now."
          : weakestTopic?.evidence ??
            lowestSubject?.recommendedFocus ??
            "Open a subject route and continue with the next recommended topic.",
      actionLabel:
        recallStrength.nextDueTopic
          ? "Review due topic"
          : weakestTopic?.href
          ? "Open revision topic"
          : lowestSubject?.subjectHref && lowestSubject.recommendedTopicId
          ? "Open revision topic"
          : routeCopy["/subjects"].label,
      href:
        (recallStrength.nextDueTopic
          ? `/subjects?subjectId=${recallStrength.nextDueTopic.subjectId}&topicId=${recallStrength.nextDueTopic.topicId}`
          : weakestTopic?.href) ??
        lowestSubject?.subjectHref ??
        "/subjects",
      priority: activeSavedSession ? "medium" : "high",
    },
    {
      recommendationId: "rec-resume-saved",
      userId,
      category: "resume-saved",
      eyebrow: "Saved progress",
      title: activeSavedSession
        ? `Resume ${activeSavedSession.title} next`
        : submittedSavedSession
          ? `Review ${submittedSavedSession.title} next`
          : "No saved sessions yet",
      description: activeSavedSession
        ? savedProgress.continuity.primaryAction.description
        : submittedSavedSession
          ? "Your latest completed session is ready to review through the results flow."
          : "As soon as a student starts an exam or assessment, autosave records will appear here.",
      supportSummary: activeSavedSession?.supportSummary,
      supportPreferenceChips: activeSavedSession?.supportPreferenceChips,
      actionLabel: activeSavedSession
        ? routeCopy["/saved-progress"].label
        : submittedSavedSession
          ? routeCopy["/results"].label
          : routeCopy["/saved-progress"].label,
      href: savedProgress.continuity.primaryAction.href,
      priority: activeSavedSession ? "high" : submittedSavedSession ? "medium" : "low",
    },
    {
      recommendationId: "rec-exam-readiness",
      userId,
      category: "exam-readiness",
      eyebrow: "Exam readiness",
      title: `Protect your strongest momentum in ${strongestSubject?.subject ?? "your strongest subject"}`,
      description:
        "Resume a paper while your strongest subject is still moving upward, then use the Power Grid to compare confidence and completion.",
      actionLabel: routeCopy["/exams"].label,
      href: "/exams",
      priority: hasReviewReadyResults ? "low" : "medium",
    },
    {
      recommendationId: "rec-timed-practice",
      userId,
      category: "timed-practice",
      eyebrow: "Timed practice",
      title: "Use a short timed checkpoint to lock in the topic",
      description:
        "Timed assessments now carry duration rules, saved progress, and access arrangement support.",
      actionLabel: routeCopy["/assessments"].label,
      href: "/assessments",
      priority: activeSavedSession ? "medium" : "high",
    },
    {
      recommendationId: "rec-access-support",
      userId,
      category: "access-support",
      eyebrow: "Access support",
      title: accessibility.settings.textToSpeechEnabled
        ? "Your read aloud support is switched on"
        : "Review your support settings before the next session",
      description: accessibility.settings.textToSpeechEnabled
        ? "Your current profile is already ready to carry text-to-speech through saved sessions."
        : "Set text size, focus mode, and read aloud preferences so support settings travel with saved progress.",
      supportSummary,
      supportPreferenceChips,
      actionLabel: routeCopy["/accessibility"].label,
      href: "/accessibility",
      priority: "medium",
    },
    {
      recommendationId: "rec-review-results",
      userId,
      category: "review-results",
      eyebrow: "Review results",
      title: hasReviewReadyResults
        ? `Review ${results.readyForReviewCount} submitted session${results.readyForReviewCount === 1 ? "" : "s"}`
        : `Use results to protect your strongest area: ${results.strongestArea}`,
      description: hasReviewReadyResults
        ? "Submitted exam and timed assessment work is now ready for review in the results route."
        : results.nextPriority,
      actionLabel: routeCopy["/results"].label,
      href: "/results",
      priority: hasReviewReadyResults ? "high" : "medium",
    },
  ];
}

export async function getRecommendationsPageData(userId: string): Promise<RecommendationsPageData> {
  const [data, recommendations] = await Promise.all([
    buildRecommendationData(userId),
    getRankedRecommendations(userId),
  ]);
  const supportSummary = buildAccessibilitySupportSummary({
    activeAccessArrangements: data.accessibility.studentAccessProfile.activeAccessArrangements,
    preferredReadingSpeed: data.accessibility.studentAccessProfile.preferredReadingSpeed,
    preferredFontSize: data.accessibility.studentAccessProfile.preferredFontSize,
    preferredColourScheme: data.accessibility.studentAccessProfile.preferredColourScheme,
    textToSpeechEnabled: data.accessibility.studentAccessProfile.textToSpeechEnabled,
    accessibilityPreferences: data.accessibility.studentAccessProfile.accessibilityPreferences,
    capturedAt: new Date().toISOString(),
  });

  return {
    title: "Student recommendations built from readiness, autosave, support, and results signals.",
    description:
      "This route turns the recommendation module into a real student product surface. It gathers progress, support, saved state, and outcome signals into one ordered action list without pushing the decision logic into the frontend.",
    nextBestAction: data.savedProgress.continuity.primaryAction.title,
    routeSummary: data.routeCopy["/recommendations"].description,
    insights: [
      {
        label: "Next best action",
        value: data.savedProgress.continuity.primaryAction.title,
        detail: `${data.summary.overallLevel} level with a ${data.summary.overallTrend} trend`,
      },
      {
        label: "Saved sessions",
        value: String(data.savedProgress.activeCount),
        detail:
          data.savedProgress.submittedCount > 0
            ? `${data.savedProgress.submittedCount} completed session${
                data.savedProgress.submittedCount === 1 ? "" : "s"
              } ready for review`
            : `${data.savedProgress.recoveryReadyCount} resume-ready session${
                data.savedProgress.recoveryReadyCount === 1 ? "" : "s"
              } already captured`,
      },
      {
        label: "Strongest area",
        value: data.results.strongestArea,
        detail:
          data.results.readyForReviewCount > 0
            ? `${data.results.readyForReviewCount} submitted result${
                data.results.readyForReviewCount === 1 ? "" : "s"
              } ready to open`
            : data.results.nextPriority,
      },
      {
        label: "Support profile",
        value: data.accessibility.settings.textToSpeechEnabled ? "Support active" : "Support ready",
        detail: supportSummary,
        supportSummary,
      },
    ],
    recommendations,
  };
}

function pickPowerGridRecommendation(
  nextBestActionHref: string | undefined,
  recommendationsByCategory: Map<Recommendation["category"], Recommendation>,
): Recommendation | undefined {
  if (!nextBestActionHref) {
    return undefined;
  }

  if (nextBestActionHref.startsWith("/exams")) {
    return recommendationsByCategory.get("exam-readiness");
  }

  if (nextBestActionHref.startsWith("/assessments")) {
    return recommendationsByCategory.get("timed-practice");
  }

  if (nextBestActionHref.startsWith("/accessibility")) {
    return recommendationsByCategory.get("access-support");
  }

  if (nextBestActionHref.startsWith("/results")) {
    return recommendationsByCategory.get("review-results");
  }

  return recommendationsByCategory.get("revise-next");
}
