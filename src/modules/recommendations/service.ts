import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getRouteCopy } from "@/modules/language/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getResultsOverview } from "@/modules/results/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import type { Recommendation, RecommendationsPageData } from "./types";

export async function getStudentRecommendations(userId: string): Promise<Recommendation[]> {
  const [summary, accessibility, savedProgress, results, routeCopy] = await Promise.all([
    getMockPowerGridSummary(),
    getAccessibilitySnapshot(userId),
    getSavedProgressOverview({ userId }),
    getResultsOverview(),
    getRouteCopy(),
  ]);
  const lowestSubject = [...summary.subjectProgress].sort(
    (left, right) => left.readinessScore - right.readinessScore,
  )[0];
  const strongestSubject = [...summary.subjectProgress].sort(
    (left, right) => right.readinessScore - left.readinessScore,
  )[0];

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
      actionLabel: routeCopy["/subjects"].label,
      href: "/subjects",
      priority: "high",
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
      priority: "high",
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
      priority: "medium",
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
      actionLabel: routeCopy["/accessibility"].label,
      href: "/accessibility",
      priority: "medium",
    },
    {
      recommendationId: "rec-resume-saved",
      userId,
      category: "resume-saved",
      eyebrow: "Saved progress",
      title:
        savedProgress.activeCount > 0
          ? `Resume one of ${savedProgress.activeCount} active saved sessions`
          : "No saved sessions yet",
      description:
        savedProgress.activeCount > 0
          ? savedProgress.recommendedAction
          : "As soon as a student starts an exam or assessment, autosave records will appear here.",
      actionLabel: routeCopy["/saved-progress"].label,
      href: "/saved-progress",
      priority: savedProgress.activeCount > 0 ? "high" : "low",
    },
    {
      recommendationId: "rec-review-results",
      userId,
      category: "review-results",
      eyebrow: "Review results",
      title: `Use results to protect your strongest area: ${results.strongestArea}`,
      description: results.nextPriority,
      actionLabel: routeCopy["/results"].label,
      href: "/results",
      priority: "medium",
    },
  ];
}

export async function getRecommendationsPageData(userId: string): Promise<RecommendationsPageData> {
  const [summary, savedProgress, results, routes, recommendations] = await Promise.all([
    getMockPowerGridSummary(),
    getSavedProgressOverview({ userId }),
    getResultsOverview(),
    getRouteCopy(),
    getStudentRecommendations(userId),
  ]);

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
        detail: `${savedProgress.accessSnapshotCount} support snapshots already captured`,
      },
      {
        label: "Strongest area",
        value: results.strongestArea,
        detail: results.nextPriority,
      },
    ],
    recommendations,
  };
}
