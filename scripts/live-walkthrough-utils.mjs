import { createHmac } from "node:crypto";

import { assert } from "./launch-utils.mjs";

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function splitList(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback;
}

function createExternalAuthSignature(secret, headers) {
  const payload = [
    headers["x-switch-auth-session-id"] ?? "",
    headers["x-switch-auth-user-id"] ?? "",
    headers["x-switch-auth-email"] ?? "",
    headers["x-switch-auth-roles"] ?? "",
    headers["x-switch-auth-provider"] ?? "",
    headers["x-switch-auth-expires-at"] ?? "",
    headers["x-switch-auth-timestamp"] ?? "",
  ].join("|");

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function buildExternalHeaders(audience, env) {
  const prefix = audience === "admin" ? "SWITCH_LIVE_ADMIN" : "SWITCH_LIVE_STUDENT";
  const userId = env[`${prefix}_USER_ID`]?.trim();
  const displayName = env[`${prefix}_DISPLAY_NAME`]?.trim();
  const email = env[`${prefix}_EMAIL`]?.trim();

  assert(userId, `${prefix}_USER_ID is required for external-header live walkthrough mode.`);
  assert(displayName, `${prefix}_DISPLAY_NAME is required for external-header live walkthrough mode.`);
  assert(email, `${prefix}_EMAIL is required for external-header live walkthrough mode.`);
  assert(
    env.SWITCH_EXTERNAL_AUTH_HEADER_SECRET?.trim(),
    "SWITCH_EXTERNAL_AUTH_HEADER_SECRET is required for external-header live walkthrough mode.",
  );

  const signedInAt =
    env[`${prefix}_SIGNED_IN_AT`]?.trim() ?? new Date().toISOString();
  const expiresAt =
    env[`${prefix}_EXPIRES_AT`]?.trim() ??
    new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const timestamp = String(Date.now());
  const headers = {
    "x-switch-auth-session-id":
      env[`${prefix}_SESSION_ID`]?.trim() ?? `${audience}-live-session`,
    "x-switch-auth-user-id": userId,
    "x-switch-auth-display-name": displayName,
    "x-switch-auth-email": email,
    "x-switch-auth-provider":
      env[`${prefix}_PROVIDER`]?.trim() ?? "google",
    "x-switch-auth-roles":
      audience === "admin"
        ? splitList(env[`${prefix}_ROLES`], ["admin"]).join(",")
        : splitList(env[`${prefix}_ROLES`], ["student"]).join(","),
    "x-switch-auth-year-group":
      env[`${prefix}_YEAR_GROUP`]?.trim() ??
      (audience === "admin" ? "Operations" : "Year 11"),
    "x-switch-auth-target-qualifications":
      splitList(env[`${prefix}_TARGET_QUALIFICATIONS`], ["GCSE"]).join(","),
    "x-switch-auth-signed-in-at": signedInAt,
    "x-switch-auth-expires-at": expiresAt,
    "x-switch-auth-timestamp": timestamp,
  };

  headers["x-switch-auth-signature"] = createExternalAuthSignature(
    env.SWITCH_EXTERNAL_AUTH_HEADER_SECRET.trim(),
    headers,
  );

  return headers;
}

function buildCookieHeaders(audience, env) {
  const cookie =
    audience === "admin"
      ? env.SWITCH_LIVE_ADMIN_COOKIE?.trim()
      : env.SWITCH_LIVE_STUDENT_COOKIE?.trim();

  assert(
    cookie,
    `${audience === "admin" ? "SWITCH_LIVE_ADMIN_COOKIE" : "SWITCH_LIVE_STUDENT_COOKIE"} is required for live walkthrough cookie mode.`,
  );

  return {
    cookie,
  };
}

export function getLiveWalkthroughConfig(env = process.env) {
  const authMode = (env.SWITCH_AUTH_MODE ?? "oidc").trim();
  const liveBaseUrl = env.SWITCH_LIVE_BASE_URL?.trim();

  assert(liveBaseUrl, "SWITCH_LIVE_BASE_URL is required for the live route walkthrough.");

  const baseUrl = normalizeBaseUrl(liveBaseUrl);
  const studentHeaders =
    authMode === "external-header"
      ? buildExternalHeaders("student", env)
      : buildCookieHeaders("student", env);
  const adminHeaders =
    authMode === "external-header"
      ? buildExternalHeaders("admin", env)
      : buildCookieHeaders("admin", env);

  return {
    authMode,
    baseUrl,
    studentHeaders,
    adminHeaders,
  };
}
