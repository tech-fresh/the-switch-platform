import type { SupportHubData, SupportRouteGuidance, SupportSafetyReview } from "./types";

const SUPPORT_REVIEWED_AT = "2026-06-14";

export function buildSupportSafetyReview(): SupportSafetyReview {
  return {
    reviewedAt: SUPPORT_REVIEWED_AT,
    reviewedBy: "Switch launch safety review",
    audience: "young-people",
    policySummary:
      "Support routes are signposting-only, keep urgent help visible, and avoid language that sounds like therapy, diagnosis, or crisis handling inside the product.",
    escalationGuidance:
      "If a student feels unsafe, overwhelmed, or at risk, the product should direct them to urgent help options and a trusted adult, teacher, or school safeguarding lead straight away.",
    avoidsTherapeuticClaims: true,
    urgentHelpVisible: true,
  };
}

export function buildSupportRouteGuidance(): SupportRouteGuidance[] {
  return [
    {
      routeId: "/support",
      title: "Open trusted support links when pressure moves beyond study help",
      message:
        "Use Support Hub for reviewed NHS and charity links. The route stays focused on signposting instead of trying to act like a counselling service.",
      actionLabel: "Open support hub",
      href: "/support",
    },
    {
      routeId: "/accessibility",
      title: "Keep accessibility settings separate from crisis support",
      message:
        "Accessibility controls should stay practical and student-led. If support needs become urgent, the student should see clear signposting rather than wellbeing advice generated inside the route.",
      actionLabel: "Review support route",
      href: "/support",
    },
    {
      routeId: "/recommendations",
      title: "Keep next-step study guidance calm, clear, and age-appropriate",
      message:
        "Recommendations can point students toward support settings or trusted help, but they should never imply diagnosis, therapy, or hidden monitoring of personal mental health.",
      actionLabel: "See support guidance",
      href: "/support",
    },
  ];
}

export function validateSupportHubSafety(support: SupportHubData): string[] {
  const issues: string[] = [];

  if (!support.safetyReview.avoidsTherapeuticClaims) {
    issues.push("Support hub must remain signposting-only and avoid therapeutic claims.");
  }

  if (!support.safetyReview.urgentHelpVisible || support.urgentHelp.length < 3) {
    issues.push("Support hub must keep multiple urgent help options visible.");
  }

  if (!support.safetyNotice.toLowerCase().includes("urgent help")) {
    issues.push("Safety notice must direct learners toward urgent help when needed.");
  }

  if (!support.safetyNotice.toLowerCase().includes("trusted adult")) {
    issues.push("Safety notice must mention a trusted adult, teacher, or safeguarding lead.");
  }

  return issues;
}
