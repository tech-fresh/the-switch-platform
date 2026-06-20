import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  AUTH_SESSION_COOKIE_NAME,
  getAuthUserIdFromSession,
  getCurrentAuthSession,
  hasAnyAuthRole,
} from "./service";
import type { AuthRole, AuthSession, AuthenticatedAuthSession } from "./types";
import { getAuthRuntimeConfig } from "./runtime";

function parseExternalRoles(value: string | null): AuthRole[] {
  if (!value) {
    return ["student"];
  }

  const roles = value
    .split(",")
    .map((role) => role.trim())
    .filter((role): role is AuthRole => role === "student" || role === "editor" || role === "admin");

  return roles.length ? roles : ["student"];
}

export async function getRequestAuthSession(): Promise<AuthSession> {
  const runtime = getAuthRuntimeConfig();

  if (runtime.mode === "external-header") {
    const headerStore = await headers();
    const userId = headerStore.get("x-switch-auth-user-id");

    if (!userId) {
      return {
        status: "signed-out",
        reason: "missing-session",
      };
    }

    if (!isTrustedExternalHeaderRequest(headerStore, runtime.externalHeaderSecret)) {
      return {
        status: "signed-out",
        reason: "invalid-session",
      };
    }

    const displayName = headerStore.get("x-switch-auth-display-name") ?? userId;
    const [firstName, ...remainingNameParts] = displayName.split(" ");
    const email = headerStore.get("x-switch-auth-email") ?? `${userId}@external.switch.local`;
    const providerHeader = headerStore.get("x-switch-auth-provider");
    const provider =
      providerHeader === "apple" ||
      providerHeader === "email-magic-link" ||
      providerHeader === "google" ||
      providerHeader === "microsoft"
        ? providerHeader
        : "google";
    const signedInAt = headerStore.get("x-switch-auth-signed-in-at") ?? new Date().toISOString();
    const expiresAt =
      headerStore.get("x-switch-auth-expires-at") ??
      new Date(Date.now() + 60 * 60 * 1000).toISOString();

    return {
      sessionId: headerStore.get("x-switch-auth-session-id") ?? `external-${userId}`,
      user: {
        userId,
        firstName: firstName || userId,
        lastName: remainingNameParts.join(" ") || "External User",
        displayName,
        email,
        yearGroup: headerStore.get("x-switch-auth-year-group") ?? "External identity",
        targetQualifications: headerStore
          .get("x-switch-auth-target-qualifications")
          ?.split(",")
          .map((item) => item.trim())
          .filter(Boolean) ?? [],
        roles: parseExternalRoles(headerStore.get("x-switch-auth-roles")),
      },
      provider,
      signedInAt,
      expiresAt,
      status: "authenticated",
    };
  }

  const cookieStore = await cookies();

  return getCurrentAuthSession({
    sessionToken: cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value,
  });
}

export async function getRequestUserId(): Promise<string> {
  const session = await getRequestAuthSession();

  return getAuthUserIdFromSession(session);
}

export async function requireAuthenticatedRequestSession(redirectTo = "/account"): Promise<AuthenticatedAuthSession> {
  const session = await getRequestAuthSession();

  if (session.status !== "authenticated") {
    redirect(redirectTo);
  }

  return session;
}

export async function requireRequestSessionRoles(
  roles: AuthRole[],
  redirectTo = "/account",
): Promise<AuthenticatedAuthSession> {
  const session = await requireAuthenticatedRequestSession(redirectTo);

  if (!hasAnyAuthRole(session, roles)) {
    redirect(redirectTo);
  }

  return session;
}

function isTrustedExternalHeaderRequest(
  headerStore: Headers,
  secret: string | null,
): boolean {
  if (!secret) {
    return true;
  }

  const timestamp = headerStore.get("x-switch-auth-timestamp");
  const providedSignature = headerStore.get("x-switch-auth-signature");

  if (!timestamp || !providedSignature) {
    return false;
  }

  const timestampValue = Number(timestamp);

  if (!Number.isFinite(timestampValue)) {
    return false;
  }

  if (Math.abs(Date.now() - timestampValue) > 5 * 60 * 1000) {
    return false;
  }

  const payload = [
    headerStore.get("x-switch-auth-session-id") ?? "",
    headerStore.get("x-switch-auth-user-id") ?? "",
    headerStore.get("x-switch-auth-email") ?? "",
    headerStore.get("x-switch-auth-roles") ?? "",
    headerStore.get("x-switch-auth-provider") ?? "",
    headerStore.get("x-switch-auth-expires-at") ?? "",
    timestamp,
  ].join("|");
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");

  return safeCompare(providedSignature, expectedSignature);
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
