import { randomUUID } from "node:crypto";

import {
  getAuthReadinessSummary,
  getConfiguredOidcProviders,
  getPreviewUserById,
  listSignInOptions,
  resolvePreviewUserForProvider,
} from "@/modules/auth/provider";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";
import { createSessionToken, readSessionToken } from "@/modules/auth/session-token";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getRouteCopy } from "@/modules/language/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getStudentRecommendations } from "@/modules/recommendations/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { getMockSubjects } from "@/modules/subjects/service";
import { buildSignedOutAccountCopy } from "./account-copy";
import type {
  AccountLink,
  AccountMetric,
  AccountOverview,
  AuthProvider,
  AuthRole,
  AuthSession,
  AuthUser,
  SignInOption,
} from "./types";

export const AUTH_SESSION_COOKIE_NAME = "switch_auth_session";
export const AUTH_FLOW_COOKIE_NAME = "switch_auth_flow";
export const DEFAULT_AUTH_USER_ID = "student-demo";
export const GUEST_AUTH_USER_ID = "guest-preview";
export const DEFAULT_AUTH_SESSION_TTL_SECONDS = 60 * 60 * 12;
export const DEFAULT_AUTH_FLOW_TTL_SECONDS = 60 * 10;

interface GetCurrentAuthSessionOptions {
  sessionToken?: string | null;
}

interface GetAccountOverviewOptions {
  session?: AuthSession;
}

export interface AuthCookieSettings {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
}

export function getAuthSessionTtlSeconds(): number {
  const rawValue = process.env.SWITCH_AUTH_SESSION_TTL_SECONDS?.trim();

  if (!rawValue) {
    return DEFAULT_AUTH_SESSION_TTL_SECONDS;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_AUTH_SESSION_TTL_SECONDS;
  }

  return Math.floor(parsedValue);
}

export function getAuthFlowTtlSeconds(): number {
  const rawValue = process.env.SWITCH_AUTH_FLOW_TTL_SECONDS?.trim();

  if (!rawValue) {
    return DEFAULT_AUTH_FLOW_TTL_SECONDS;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_AUTH_FLOW_TTL_SECONDS;
  }

  return Math.floor(parsedValue);
}

export function getAuthCookieSettings(): AuthCookieSettings {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAuthSessionTtlSeconds(),
  };
}

export function getAuthFlowCookieSettings(): AuthCookieSettings {
  return {
    ...getAuthCookieSettings(),
    maxAge: getAuthFlowTtlSeconds(),
  };
}

export async function getCurrentAuthSession(
  options?: GetCurrentAuthSessionOptions,
): Promise<AuthSession> {
  const sessionToken = options?.sessionToken;

  if (!sessionToken) {
    return {
      status: "signed-out",
      reason: "missing-session",
    };
  }

  const runtime = getAuthRuntimeConfig();
  const session = readSessionToken(sessionToken, runtime.sessionSecret);

  if (!session) {
    return {
      status: "signed-out",
      reason: "invalid-session",
    };
  }

  if (runtime.mode === "preview-cookie") {
    const previewUser = await getPreviewUserById(session.user.userId);

    if (!previewUser) {
      return {
        status: "signed-out",
        reason: "invalid-session",
      };
    }

    return {
      ...session,
      user: previewUser,
    };
  }

  return session;
}

export async function createAuthSession(
  provider: AuthProvider,
  userId?: string,
): Promise<{ session: AuthSession; sessionToken: string }> {
  if (!getAuthRuntimeConfig().allowLocalSessionMutation) {
    throw new Error("Local auth session creation is disabled in the current auth runtime mode.");
  }

  const resolvedSessionUser = await resolvePreviewUserForProvider(provider, userId);
  const user = resolvedSessionUser?.user;

  if (!user) {
    throw new Error("Unable to create auth session for unknown user.");
  }

  const session = buildAuthenticatedSession(user, resolvedSessionUser.provider ?? provider);

  return {
    session,
    sessionToken: createSessionToken(session, getAuthRuntimeConfig().sessionSecret),
  };
}

export async function createProviderSession(
  provider: AuthProvider,
  user: AuthUser,
): Promise<{ session: AuthSession; sessionToken: string }> {
  const session = buildAuthenticatedSession(user, provider);

  return {
    session,
    sessionToken: createSessionToken(session, getAuthRuntimeConfig().sessionSecret),
  };
}

export async function clearAuthSession(): Promise<void> {
  return;
}

export async function getSignInOptions(): Promise<SignInOption[]> {
  return listSignInOptions();
}

export { getAuthReadinessSummary };

export function getAuthUserIdFromSession(session: AuthSession): string {
  return session.status === "authenticated" ? session.user.userId : GUEST_AUTH_USER_ID;
}

export function hasAnyAuthRole(session: AuthSession, roles: AuthRole[]): boolean {
  if (session.status !== "authenticated") {
    return false;
  }

  return roles.some((role) => session.user.roles.includes(role));
}

export async function getAccountOverview(
  options?: GetAccountOverviewOptions,
): Promise<AccountOverview> {
  const session = options?.session ?? { status: "signed-out" as const };
  const userId = getAuthUserIdFromSession(session);
  const [summary, savedProgress, accessibility, recommendations, routeCopy, signInOptions] = await Promise.all([
    getMockPowerGridSummary({ userId }),
    getSavedProgressOverview({ userId }),
    getAccessibilitySnapshot(userId),
    getStudentRecommendations(userId),
    getRouteCopy(),
    getSignInOptions(),
  ]);

  const subjects = getMockSubjects();
  const runtime = getAuthRuntimeConfig();
  const configuredProviders = runtime.mode === "oidc" ? getConfiguredOidcProviders() : [];
  const hasConfiguredProductionProviders = configuredProviders.length > 0;
  const authReadiness = getAuthReadinessSummary();
  const signedOutCopy = buildSignedOutAccountCopy({
    runtimeMode: runtime.mode,
    hasConfiguredProductionProviders,
    configuredProviderCount: configuredProviders.length,
  });
  const signedInLabel =
    session.status === "authenticated"
      ? session.user.displayName
      : signedOutCopy.signedInLabel;
  const signedInDetail =
    session.status === "authenticated"
      ? session.user.yearGroup + " • " + session.user.email
      : signedOutCopy.signedInDetail;

  const metrics: AccountMetric[] = [
    {
      label: "Signed in as",
      value: signedInLabel,
      detail: signedInDetail,
    },
    {
      label: "Access level",
      value:
        session.status === "authenticated"
          ? session.user.roles.join(", ")
          : signedOutCopy.accessLevelLabel,
      detail:
        session.status === "authenticated"
          ? "Role-aware route protection now uses these account roles."
          : "Sign in to unlock account-linked and protected product surfaces.",
    },
    {
      label: "Subjects active",
      value: String(subjects.length),
      detail: String(summary.examReadinessScore) + " / 100 overall readiness",
    },
    {
      label: "Saved sessions",
      value: String(savedProgress.activeCount),
      detail: String(savedProgress.accessSnapshotCount) + " support snapshots captured",
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
    authReadiness,
    metrics,
    quickLinks,
    supportSummary:
      session.status === "authenticated"
        ? accessibility.studentAccessProfile.textToSpeechEnabled
          ? "Text to speech is enabled in the current profile and can travel with saved sessions."
          : "Support settings are account-linked and ready to carry through future web and app clients."
        : signedOutCopy.supportSummary,
    nextBestAction:
      session.status === "authenticated"
        ? recommendations[0]?.title ?? summary.nextBestAction
        : signedOutCopy.nextBestAction,
    signedOutTitle: signedOutCopy.signedOutTitle,
    signedOutDescription: signedOutCopy.signedOutDescription,
  };
}

export function buildAuthenticatedSession(user: AuthUser, provider: AuthProvider) {
  const signedInAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + getAuthSessionTtlSeconds() * 1000).toISOString();

  return {
    sessionId: "session-" + user.userId + "-" + randomUUID(),
    user,
    provider,
    signedInAt,
    expiresAt,
    status: "authenticated" as const,
  };
}

function buildAccountLink(href: string, label: string, description: string): AccountLink {
  return {
    href,
    label,
    description,
  };
}
