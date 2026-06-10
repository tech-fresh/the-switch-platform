import { randomUUID } from "node:crypto";

import {
  readPersistedAuthSessions,
  writePersistedAuthSessions,
} from "@/lib/persistence/auth-session-store";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getRouteCopy } from "@/modules/language/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getStudentRecommendations } from "@/modules/recommendations/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { getMockSubjects } from "@/modules/subjects/service";
import type {
  AccountLink,
  AccountMetric,
  AccountOverview,
  AuthProvider,
  AuthSession,
  AuthUser,
  SignInOption,
} from "./types";

export const AUTH_SESSION_COOKIE_NAME = "switch_auth_session";
export const DEFAULT_AUTH_USER_ID = "student-demo";
export const GUEST_AUTH_USER_ID = "guest-preview";

const authUsers: Record<string, AuthUser> = {
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

const signInOptions: SignInOption[] = [
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

interface GetCurrentAuthSessionOptions {
  sessionToken?: string | null;
}

interface GetAccountOverviewOptions {
  session?: AuthSession;
}

export async function getCurrentAuthSession(
  options?: GetCurrentAuthSessionOptions,
): Promise<AuthSession> {
  const sessionToken = options?.sessionToken;

  if (!sessionToken) {
    return {
      status: "signed-out",
    };
  }

  const persistedSessions = await readPersistedAuthSessions();
  const record = persistedSessions.find((session) => session.sessionToken === sessionToken);
  const user = record ? authUsers[record.userId] : undefined;

  if (!record || !user) {
    return {
      status: "signed-out",
    };
  }

  return {
    sessionId: record.sessionId,
    user,
    provider: record.provider,
    signedInAt: record.signedInAt,
    status: "authenticated",
  };
}

export async function createAuthSession(
  provider: AuthProvider,
  userId = DEFAULT_AUTH_USER_ID,
): Promise<{ session: AuthSession; sessionToken: string }> {
  const user = authUsers[userId] ?? authUsers[DEFAULT_AUTH_USER_ID];

  if (!user) {
    throw new Error("Unable to create auth session for unknown user.");
  }

  const sessionToken = randomUUID();
  const sessionId = `session-${user.userId}-${randomUUID()}`;
  const signedInAt = new Date().toISOString();
  const sessions = await readPersistedAuthSessions();

  await writePersistedAuthSessions(
    sessions
      .filter((existingSession) => existingSession.userId !== user.userId)
      .concat({
        sessionToken,
        sessionId,
        userId: user.userId,
        provider,
        signedInAt,
      }),
  );

  return {
    session: {
      sessionId,
      user,
      provider,
      signedInAt,
      status: "authenticated",
    },
    sessionToken,
  };
}

export async function clearAuthSession(sessionToken?: string | null): Promise<void> {
  if (!sessionToken) {
    return;
  }

  const sessions = await readPersistedAuthSessions();

  await writePersistedAuthSessions(
    sessions.filter((session) => session.sessionToken !== sessionToken),
  );
}

export async function getSignInOptions(): Promise<SignInOption[]> {
  return signInOptions;
}

export function getAuthUserIdFromSession(session: AuthSession): string {
  return session.status === "authenticated" ? session.user.userId : GUEST_AUTH_USER_ID;
}

export async function getAccountOverview(
  options?: GetAccountOverviewOptions,
): Promise<AccountOverview> {
  const session = options?.session ?? { status: "signed-out" as const };
  const userId = getAuthUserIdFromSession(session);
  const [summary, savedProgress, accessibility, recommendations, routeCopy] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getSavedProgressOverview({ userId }),
    getAccessibilitySnapshot(userId),
    getStudentRecommendations(userId),
    getRouteCopy(),
  ]);

  const subjects = getMockSubjects();
  const signedInLabel =
    session.status === "authenticated" ? session.user.displayName : "Guest preview";
  const signedInDetail =
    session.status === "authenticated"
      ? `${session.user.yearGroup} • ${session.user.email}`
      : "Sign in to keep saved progress, support settings, and session recovery tied to a named student profile.";

  const metrics: AccountMetric[] = [
    {
      label: "Signed in as",
      value: signedInLabel,
      detail: signedInDetail,
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
        : session.status === "authenticated"
          ? "Ready"
          : "Sign in to keep",
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
    isAuthenticated: session.status === "authenticated",
    session,
    signInOptions,
    metrics,
    quickLinks,
    supportSummary:
      session.status === "authenticated"
        ? accessibility.studentAccessProfile.textToSpeechEnabled
          ? "Text to speech is enabled in the current profile and can travel with saved sessions."
          : "Support settings are account-linked and ready to carry through future web and app clients."
        : "Sign in to keep support preferences, accessibility settings, and saved session snapshots tied to one student account.",
    nextBestAction:
      session.status === "authenticated"
        ? recommendations[0]?.title ?? summary.nextBestAction
        : "Sign in to keep progress, support settings, and resume links connected.",
    signedOutTitle: "Sign in to turn the preview into a personal study account.",
    signedOutDescription:
      "The website can still load in preview mode, but signed-in auth is what keeps saved sessions, support settings, and account-linked recovery paths connected to the same learner.",
  };
}

function buildAccountLink(href: string, label: string, description: string): AccountLink {
  return {
    href,
    label,
    description,
  };
}
