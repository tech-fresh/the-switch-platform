import { redirect } from "next/navigation";

import { PublicMarketingPage } from "@/components/public-marketing-page";
import { AuthAccessPathPanel } from "@/components/auth-access-path-panel";
import { SignInBrandMark } from "@/components/sign-in-brand-mark";
import { UnifiedSignInCard } from "@/components/unified-sign-in-card";
import { getRequestAuthSession } from "@/modules/auth/request";
import { getLoginPageData } from "@/modules/auth/service";

export const dynamic = "force-dynamic";

function getAuthErrorMessage(authError: string | undefined): string | null {
  if (!authError) {
    return null;
  }

  if (authError === "provider-not-configured") {
    return "The selected sign-in provider is not configured in this runtime yet.";
  }

  if (authError === "token-exchange-failed" || authError === "user-info-failed") {
    return "The identity provider responded, but the session could not be completed safely.";
  }

  if (authError === "invalid-callback-state" || authError === "missing-flow-state") {
    return "The sign-in flow expired or could not be verified. Please try again.";
  }

  if (authError === "external-managed") {
    return "This runtime expects sign-in to be handled by a trusted upstream identity layer.";
  }

  return "Sign-in could not be completed. Please try again.";
}

function sanitizeReturnTo(value: string | undefined, intent: "student" | "admin"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return intent === "admin" ? "/admin" : "/dashboard";
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    authError?: string | string[] | undefined;
    returnTo?: string | string[] | undefined;
    reauth?: string | string[] | undefined;
    intent?: string | string[] | undefined;
  }>;
}) {
  const resolvedSearchParams =
    (await searchParams) ??
    ({} as {
      authError?: string | string[] | undefined;
      returnTo?: string | string[] | undefined;
      reauth?: string | string[] | undefined;
      intent?: string | string[] | undefined;
    });

  const rawIntent = resolvedSearchParams.intent;
  const intent = (Array.isArray(rawIntent) ? rawIntent[0] : rawIntent) === "admin" ? "admin" : "student";
  const rawReturnTo = resolvedSearchParams.returnTo;
  const returnTo = sanitizeReturnTo(Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo, intent);
  const rawAuthError = resolvedSearchParams.authError;
  const authError = Array.isArray(rawAuthError) ? rawAuthError[0] : rawAuthError;
  const rawReauth = resolvedSearchParams.reauth;
  const reauth = (Array.isArray(rawReauth) ? rawReauth[0] : rawReauth) === "1";
  const loginPageData = await getRequestAuthSession().then((session) =>
    getLoginPageData(session, intent),
  );

  if (loginPageData.isAuthenticated && !reauth) {
    redirect(returnTo);
  }

  const authenticatedSession =
    loginPageData.session.status === "authenticated" ? loginPageData.session : null;

  return (
    <PublicMarketingPage isAuthenticated={loginPageData.isAuthenticated}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-4">
        <SignInBrandMark />
        {loginPageData.accessPath ? (
          <AuthAccessPathPanel accessPath={loginPageData.accessPath} variant="login" />
        ) : null}
        <UnifiedSignInCard
          signInOptions={loginPageData.signInOptions}
          returnTo={returnTo}
          signInIntent={intent}
          authErrorMessage={getAuthErrorMessage(authError)}
          signedInAs={authenticatedSession?.user.displayName ?? null}
          showReauthNotice={Boolean(authenticatedSession && reauth)}
        />
      </div>
    </PublicMarketingPage>
  );
}
