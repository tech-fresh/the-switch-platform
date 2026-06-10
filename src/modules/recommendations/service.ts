import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import {
  buildAccessibilityPreferenceChips,
  buildAccessibilitySupportSummary,
} from "@/modules/accessibility/presentation";
import { getRouteCopy } from "@/modules/language/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getResultsOverview } from "@/modules/results/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import type { Recommendation, RecommendationsPageData } from "./types";

export async function getStudentRecommendations(userId: string): Promise<Recommendation[]> {
  const [summary, accessibility, savedProgress, results, routeCopy] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getAccessibilitySnapshot(userId),
    getSavedProgressOverview({ userId }),
    getResultsOverview(userId),
    getRouteCopy(),
  ]);
  const lowestSubject = [...summary.subjectProgress].sort(
    (left, right) => left.readinessScore - right.readinessScore,
  )[0];
  const strongestSubject = [...summary.subjectProgress].sort(
    (left, right) => right.readinessScore - left.readinessScore,
  )[0];
  const activeSavedSession = savedProgress.sessions.find((session) => session.status !== "submitted");
  const submittedSavedSession = savedProgress.sessions.find((session) => session.status === "submitted");
  const hasReviewReadyResults = results.readyForReviewCount > 0;
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

  return [
    {
      recommendationId: "rec-revise-next",
      userId,
      category: "revise-next",
      eyebrow: "Revise next",
      title: `Revise ${lowestSubject?.subject ?? "your weakest subject"} next`,
      description:
        lowestSubject?.recommendedFocus ??
        "Open a subject route and continue with the next recommended topic.",
      actionLabel:
        lowestSubject?.subjectHref && lowestSubject.recommendedTopicId
          ? "Open revision topic"
          : routeCopy["/subjects"].label,
      href: lowestSubject?.subjectHref ?? "/subjects",
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
        ? savedProgress.recommendedAction
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
      href: savedProgress.recommendedActionHref,
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
  const [summary, accessibility, savedProgress, results, routes, recommendations] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getAccessibilitySnapshot(userId),
    getSavedProgressOverview({ userId }),
    getResultsOverview(userId),
    getRouteCopy(),
    getStudentRecommendations(userId),
  ]);
  const supportSummary = buildAccessibilitySupportSummary({
    activeAccessArrangements: accessibility.studentAccessProfile.activeAccessArrangements,
    preferredReadingSpeed: accessibility.studentAccessProfile.preferredReadingSpeed,
    preferredFontSize: accessibility.studentAccessProfile.preferredFontSize,
    preferredColourScheme: accessibility.studentAccessProfile.preferredColourScheme,
    textToSpeechEnabled: accessibility.studentAccessProfile.textToSpeechEnabled,
    accessibilityPreferences: accessibility.studentAccessProfile.accessibilityPreferences,
    capturedAt: new Date().toISOString(),
  });

  return {
    title: "Student recommendations built from readiness, autosave, support, and results signals.",
    description:
      "This route turns the recommendation module into a real student product surface. It gathers progress, support, saved state, and outcome signals into one ordered action list without pushing the decision logic into the frontend.",
    nextBestAction: summary.nextBestAction,
    routeSummary: routes["/recommendations"].description,
    insights: [
      {
        label: "Next best action",
        value: summary.nextBestAction,
        detail: `${summary.overallLevel} level with a ${summary.overallTrend} trend`,
      },
      {
        label: "Saved sessions",
        value: String(savedProgress.activeCount),
        detail:
          savedProgress.submittedCount > 0
            ? `${savedProgress.submittedCount} completed session${
                savedProgress.submittedCount === 1 ? "" : "s"
              } ready for review`
            : `${savedProgress.recoveryReadyCount} resume-ready session${
                savedProgress.recoveryReadyCount === 1 ? "" : "s"
              } already captured`,
      },
      {
        label: "Strongest area",
        value: results.strongestArea,
        detail:
          results.readyForReviewCount > 0
            ? `${results.readyForReviewCount} submitted result${
                results.readyForReviewCount === 1 ? "" : "s"
              } ready to open`
            : results.nextPriority,
      },
      {
        label: "Support profile",
        value: accessibility.settings.textToSpeechEnabled ? "Support active" : "Support ready",
        detail: supportSummary,
        supportSummary,
      },
    ],
    recommendations,
  };
}
