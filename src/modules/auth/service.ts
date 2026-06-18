import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getRouteCopy } from "@/modules/language/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getStudentRecommendations } from "@/modules/recommendations/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { getMockSubjects } from "@/modules/subjects/service";
import { getAuthRuntimeConfig, getConfiguredSessionProvider } from "./runtime";
import type {
  AccountLink,
  AccountMetric,
  AccountOverview,
  AuthSession,
  AuthUser,
  SignInOption,
} from "./types";

const mockUsers: Record<string, AuthUser> = {
  "student-demo": {
    userId: "student-demo",
    firstName: "Maya",
    lastName: "Okafor",
    displayName: "Maya Okafor",
    email: "maya.okafor@student.switch.local",
    yearGroup: "Year 11",
    targetQualifications: ["GCSE Mathematics", "GCSE English Language", "GCSE Combined Science"],
  },
};

const fallbackSignInOptions: SignInOption[] = [
  {
    provider: "email-magic-link",
    label: "Email magic link",
    description: "Fast sign in for students without needing a password-first flow in the MVP.",
  },
  {
    provider: "google",
    label: "Google",
    description: "Future-ready sign in option for school-managed and personal Google accounts.",
  },
  {
    provider: "apple",
    label: "Apple",
    description: "Future-ready sign in option for mobile and privacy-focused account flows.",
  },
];

export async function getCurrentAuthSession(userId = "student-demo"): Promise<AuthSession> {
  const user = mockUsers[userId] ?? mockUsers["student-demo"];
  const provider = getConfiguredSessionProvider();

  return {
    sessionId: `session-${user.userId}`,
    user,
    provider,
    signedInAt: "2026-06-06T08:15:00.000Z",
    status: "authenticated",
  };
}

export async function getSignInOptions(): Promise<SignInOption[]> {
  const runtime = getAuthRuntimeConfig();

  if (!runtime.isLiveConfigured) {
    return fallbackSignInOptions;
  }

  return [
    {
      provider: "oidc",
      label: runtime.oidcProvider.providerName ?? "OIDC",
      description: `Live OIDC sign in via ${runtime.oidcProvider.issuerUrl}.`,
    },
  ];
}

export async function getAccountOverview(userId = "student-demo"): Promise<AccountOverview> {
  const [session, signInOptions, summary, savedProgress, accessibility, recommendations, routeCopy] =
    await Promise.all([
      getCurrentAuthSession(userId),
      getSignInOptions(),
      getMockPowerGridSummary(),
      getSavedProgressOverview({ userId }),
      getAccessibilitySnapshot(userId),
      getStudentRecommendations(userId),
      getRouteCopy(),
    ]);

  const subjects = getMockSubjects();
  const metrics: AccountMetric[] = [
    {
      label: "Signed in as",
      value: session.user.displayName,
      detail: `${session.user.yearGroup} • ${session.user.email}`,
    },
    {
      label: "Subjects active",
      value: String(subjects.length),
      detail: `${summary.examReadinessScore} / 100 overall readiness`,
    },
    {
      label: "Saved sessions",
      value: String(savedProgress.activeCount),
      detail: `${savedProgress.accessSnapshotCount} support snapshots captured`,
    },
    {
      label: "Support profile",
      value: accessibility.studentAccessProfile.activeAccessArrangements.length
        ? "Configured"
        : "Ready",
      detail: accessibility.studentAccessProfile.activeAccessArrangements.length
        ? accessibility.studentAccessProfile.activeAccessArrangements.join(", ")
        : "No formal arrangements active yet",
    },
  ];

  const quickLinks: AccountLink[] = [
    buildAccountLink("/dashboard", routeCopy["/dashboard"].label, routeCopy["/dashboard"].description),
    buildAccountLink("/saved-progress", routeCopy["/saved-progress"].label, routeCopy["/saved-progress"].description),
    buildAccountLink("/recommendations", routeCopy["/recommendations"].label, routeCopy["/recommendations"].description),
    buildAccountLink("/accessibility", routeCopy["/accessibility"].label, routeCopy["/accessibility"].description),
  ];

  return {
    session,
    signInOptions,
    metrics,
    quickLinks,
    supportSummary: accessibility.studentAccessProfile.textToSpeechEnabled
      ? "Text to speech is enabled in the current profile and can travel with saved sessions."
      : "Support settings are account-linked and ready to carry through future web and app clients.",
    nextBestAction: recommendations[0]?.title ?? summary.nextBestAction,
  };
}

function buildAccountLink(href: string, label: string, description: string): AccountLink {
  return {
    href,
    label,
    description,
  };
}
