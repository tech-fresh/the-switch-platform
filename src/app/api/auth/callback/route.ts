import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getConfiguredOidcProvider, mapOidcProfileToAuthUser } from "@/modules/auth/provider";
import { getAuthCallbackUrl, getAuthRedirectUrl } from "@/modules/auth/public-origin";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";
import {
  AUTH_FLOW_COOKIE_NAME,
  AUTH_SESSION_COOKIE_NAME,
  createProviderSession,
  getAuthCookieSettings,
  getAuthFlowCookieSettings,
} from "@/modules/auth/service";
import { readAuthFlowToken } from "@/modules/auth/session-token";

export async function GET(request: Request) {
  const runtime = getAuthRuntimeConfig();
  const requestUrl = new URL(request.url);
  const cookieStore = await cookies();
  const flowToken = cookieStore.get(AUTH_FLOW_COOKIE_NAME)?.value;
  const flowState = readAuthFlowToken(flowToken, runtime.sessionSecret);

  if (runtime.mode !== "oidc") {
    return clearFlowAndRedirect(requestUrl, "/login?authError=callback-not-enabled");
  }

  if (!flowState) {
    return clearFlowAndRedirect(requestUrl, "/login?authError=missing-flow-state");
  }

  if (requestUrl.searchParams.get("error")) {
    return clearFlowAndRedirect(
      requestUrl,
      `/login?authError=${encodeURIComponent(requestUrl.searchParams.get("error") ?? "provider-error")}`,
    );
  }

  const authorizationCode = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  if (!authorizationCode || !state || state !== flowState.state) {
    return clearFlowAndRedirect(requestUrl, "/login?authError=invalid-callback-state");
  }

  const oidcProvider = getConfiguredOidcProvider(flowState.provider);

  if (!oidcProvider) {
    return clearFlowAndRedirect(requestUrl, "/login?authError=provider-not-configured");
  }

  try {
    const redirectUri = getAuthCallbackUrl(requestUrl);
    const tokenResponse = await fetch(oidcProvider.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: redirectUri,
        client_id: oidcProvider.clientId,
        client_secret: oidcProvider.clientSecret,
        code_verifier: flowState.codeVerifier,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return clearFlowAndRedirect(requestUrl, "/login?authError=token-exchange-failed");
    }

    const tokenPayload = (await tokenResponse.json()) as Partial<{
      access_token: string;
      token_type: string;
    }>;

    if (!tokenPayload.access_token) {
      return clearFlowAndRedirect(requestUrl, "/login?authError=missing-access-token");
    }

    const userInfoResponse = await fetch(oidcProvider.userInfoUrl, {
      headers: {
        Authorization: `${tokenPayload.token_type ?? "Bearer"} ${tokenPayload.access_token}`,
      },
      cache: "no-store",
    });

    if (!userInfoResponse.ok) {
      return clearFlowAndRedirect(requestUrl, "/login?authError=user-info-failed");
    }

    const profile = await userInfoResponse.json();
    const user = mapOidcProfileToAuthUser(profile);
    const { sessionToken } = await createProviderSession(flowState.provider, user);
    const response = NextResponse.redirect(getAuthRedirectUrl(requestUrl, flowState.returnTo));

    response.cookies.set(AUTH_SESSION_COOKIE_NAME, sessionToken, getAuthCookieSettings());
    response.cookies.set(AUTH_FLOW_COOKIE_NAME, "", {
      ...getAuthFlowCookieSettings(),
      maxAge: 0,
    });

    return response;
  } catch {
    return clearFlowAndRedirect(requestUrl, "/login?authError=callback-processing-failed");
  }
}

function clearFlowAndRedirect(requestUrl: URL, path: string): NextResponse {
  const response = NextResponse.redirect(getAuthRedirectUrl(requestUrl, path));

  response.cookies.set(AUTH_FLOW_COOKIE_NAME, "", {
    ...getAuthFlowCookieSettings(),
    maxAge: 0,
  });

  return response;
}

