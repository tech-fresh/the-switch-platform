import { redirect } from "next/navigation";

import { SignInBrandMark } from "@/components/sign-in-brand-mark";
import { UnifiedSignInCard } from "@/components/unified-sign-in-card";
import { getAccountOverviewApiData } from "@/lib/api/server";

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

function sanitizeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ authError?: string | string[] | undefined; returnTo?: string | string[] | undefined }>;
}) {
  const [account, resolvedSearchParams] = await Promise.all([
    getAccountOverviewApiData(),
    searchParams ?? Promise.resolve({}),
  ]);

  const rawReturnTo = resolvedSearchParams.returnTo;
  const returnTo = sanitizeReturnTo(
    Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo,
  );
  const rawAuthError = resolvedSearchParams.authError;
  const authError = Array.isArray(rawAuthError) ? rawAuthError[0] : rawAuthError;

  if (account.isAuthenticated) {
    redirect(returnTo);
  }

  return (
    <main className="min-h-screen bg-white text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="pb-8">
          <SignInBrandMark />
        </header>

        <div className="flex flex-1 items-start justify-center pb-10 pt-4">
          <UnifiedSignInCard
            signInOptions={account.signInOptions}
            returnTo={returnTo}
            authErrorMessage={getAuthErrorMessage(authError)}
          />
        </div>
      </div>
    </main>
  );
}
