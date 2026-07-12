import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { getConfiguredOidcProvider } from "@/modules/auth/provider";
import { getAuthCallbackUrl, getAuthRedirectUrl } from "@/modules/auth/public-origin";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";
import {
  AUTH_FLOW_COOKIE_NAME,
  AUTH_SESSION_COOKIE_NAME,
  createAuthSession,
  getAuthCookieSettings,
  getAuthFlowCookieSettings,
  getAuthFlowTtlSeconds,
} from "@/modules/auth/service";
import { createAuthFlowToken } from "@/modules/auth/session-token";
import type { AuthProvider } from "@/modules/auth/types";

const supportedProviders = new Set<AuthProvider>(["email-magic-link", "google", "apple", "microsoft"]);

export async function GET(request: Request) {
  const runtime = getAuthRuntimeConfig();
  const requestUrl = new URL(request.url);
  const provider = requestUrl.searchParams.get("provider");
  const returnTo = sanitizeReturnTo(requestUrl.searchParams.get("returnTo"));

  if (!provider || !supportedProviders.has(provider as AuthProvider)) {
    return NextResponse.redirect(getAuthRedirectUrl(requestUrl, `/login?authError=unknown-provider`));
  }

  if (runtime.mode === "preview-cookie") {
    const { sessionToken } = await createAuthSession(provider as AuthProvider);
    const response = NextResponse.redirect(getAuthRedirectUrl(requestUrl, returnTo));

    response.cookies.set(AUTH_SESSION_COOKIE_NAME, sessionToken, getAuthCookieSettings());

    return response;
  }

  if (runtime.mode !== "oidc") {
    return NextResponse.redirect(getAuthRedirectUrl(requestUrl, `/login?authError=external-managed`));
  }

  const oidcProvider = getConfiguredOidcProvider(provider as AuthProvider);

  if (!oidcProvider) {
    return NextResponse.redirect(getAuthRedirectUrl(requestUrl, `/login?authError=provider-not-configured`));
  }

  const state = randomBytes(18).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + getAuthFlowTtlSeconds() * 1000).toISOString();
  const redirectUri = getAuthCallbackUrl(requestUrl);
  const authorizationUrl = new URL(oidcProvider.authorizationUrl);

  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", oidcProvider.clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("scope", oidcProvider.scopes.join(" "));
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  if (oidcProvider.prompt) {
    authorizationUrl.searchParams.set("prompt", oidcProvider.prompt);
  }

  const flowToken = createAuthFlowToken(
    {
      provider: oidcProvider.provider,
      state,
      codeVerifier,
      returnTo,
      createdAt: now.toISOString(),
      expiresAt,
    },
    runtime.sessionSecret,
  );

  authorizationUrl.searchParams.set("state", flowToken);

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set(
    AUTH_FLOW_COOKIE_NAME,
    flowToken,
    getAuthFlowCookieSettings(),
  );

  return response;
}

function sanitizeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
