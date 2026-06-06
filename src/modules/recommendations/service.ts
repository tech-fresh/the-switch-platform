import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import type { Recommendation } from "./types";

export async function getStudentRecommendations(userId: string): Promise<Recommendation[]> {
  const [summary, accessibility] = await Promise.all([
    getMockPowerGridSummary(),
    getAccessibilitySnapshot(userId),
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
      title: `Revise ${lowestSubject?.subject ?? "your weakest subject"} next`,
      description:
        lowestSubject?.recommendedFocus ??
        "Open a subject route and continue with the next recommended topic.",
      actionLabel: "Open subjects",
      href: "/subjects",
      priority: "high",
    },
    {
      recommendationId: "rec-timed-practice",
      userId,
      category: "timed-practice",
      title: "Use a short timed checkpoint to lock in the topic",
      description:
        "Timed assessments now carry duration rules, saved progress, and access arrangement support.",
      actionLabel: "Open assessments",
      href: "/assessments",
      priority: "high",
    },
    {
      recommendationId: "rec-exam-readiness",
      userId,
      category: "exam-readiness",
      title: `Protect your strongest momentum in ${strongestSubject?.subject ?? "your strongest subject"}`,
      description:
        "Resume a paper while your strongest subject is still moving upward, then use the Power Grid to compare confidence and completion.",
      actionLabel: "Open exams",
      href: "/exams",
      priority: "medium",
    },
    {
      recommendationId: "rec-access-support",
      userId,
      category: "access-support",
      title: accessibility.settings.textToSpeechEnabled
        ? "Your read aloud support is switched on"
        : "Review your support settings before the next session",
      description: accessibility.settings.textToSpeechEnabled
        ? "Your current profile is already ready to carry text-to-speech through saved sessions."
        : "Set text size, focus mode, and read aloud preferences so support settings travel with saved progress.",
      actionLabel: "Open accessibility",
      href: "/accessibility",
      priority: "medium",
    },
  ];
}
