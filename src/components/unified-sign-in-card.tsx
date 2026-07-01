import Link from "next/link";

import type { AuthProvider, SignInOption } from "@/modules/auth/types";

interface UnifiedSignInCardProps {
  signInOptions: SignInOption[];
  returnTo: string;
  signInIntent?: "student" | "admin";
  authErrorMessage?: string | null;
  signedInAs?: string | null;
  showReauthNotice?: boolean;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" fill="#F25022" />
      <rect x="13" y="3" width="8" height="8" fill="#7FBA00" />
      <rect x="3" y="13" width="8" height="8" fill="#00A4EF" />
      <rect x="13" y="13" width="8" height="8" fill="#FFB900" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
      <path
        d="M4 7h16v10H4V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function providerLabel(provider: AuthProvider): string {
  if (provider === "google") {
    return "Google";
  }

  if (provider === "microsoft") {
    return "Microsoft";
  }

  if (provider === "email-magic-link") {
    return "email";
  }

  if (provider === "apple") {
    return "Apple";
  }

  return provider;
}

function ProviderIcon({ provider }: { provider: AuthProvider }) {
  if (provider === "google") {
    return <GoogleIcon />;
  }

  if (provider === "microsoft") {
    return <MicrosoftIcon />;
  }

  return <EmailIcon />;
}

function providerButtonClass(provider: AuthProvider): string {
  if (provider === "email-magic-link") {
    return "border-teal-800 bg-teal-800 text-white hover:bg-teal-900";
  }

  return "border-stone-300 bg-white text-stone-900 hover:border-sky-300 hover:bg-sky-50";
}

function buildSignInHref(provider: AuthProvider, returnTo: string): string {
  return `/api/auth/start?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(returnTo)}`;
}

const providerOrder: AuthProvider[] = ["google", "microsoft", "apple", "email-magic-link"];

export function UnifiedSignInCard({
  signInOptions,
  returnTo,
  signInIntent = "student",
  authErrorMessage,
  signedInAs,
  showReauthNotice,
}: UnifiedSignInCardProps) {
  const orderedOptions = providerOrder
    .map((provider) => signInOptions.find((option) => option.provider === provider))
    .filter((option): option is SignInOption => Boolean(option));

  const socialOptions = orderedOptions.filter((option) => option.provider !== "email-magic-link");
  const emailOption = orderedOptions.find((option) => option.provider === "email-magic-link");
  const hasMicrosoftOption = orderedOptions.some((option) => option.provider === "microsoft");

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm sm:px-8">
      <section className="space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              {signInIntent === "admin" ? "Operator sign-in" : "Welcome back!"}
            </h2>
            <p className="text-sm leading-6 text-stone-600">
              {signInIntent === "admin"
                ? "Choose the provider linked to your allowlisted account."
                : "Choose the provider you use for The Switch."}
            </p>
            {signInIntent !== "admin" ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                One sign-in for students and admin
              </p>
            ) : null}
            <p className="text-xs leading-6 text-stone-500">
              {signInIntent === "admin"
                ? "Your admin tools appear after sign-in when your email is allowlisted."
                : "Google and Microsoft both support the normal student login path."}
            </p>
          </div>

          {showReauthNotice && signedInAs ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-left text-sm leading-6 text-teal-950">
              You are already signed in as <strong>{signedInAs}</strong>. Choose a provider below to
              sign in again, or{" "}
              <Link href="/account" className="font-semibold underline underline-offset-2">
                open your account page to sign out
              </Link>
              .
            </div>
          ) : null}

          {authErrorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm leading-6 text-rose-900">
              {authErrorMessage}
            </div>
          ) : null}

          <div className="space-y-3 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Choose a provider
            </p>
            {socialOptions.map((option) => (
              <a
                key={option.provider}
                href={buildSignInHref(option.provider, returnTo)}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${providerButtonClass(option.provider)}`}
              >
                <ProviderIcon provider={option.provider} />
                <span>{`Continue with ${providerLabel(option.provider)}`}</span>
              </a>
            ))}

            {!hasMicrosoftOption ? (
              <Link
                href="/login/microsoft-guide"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-sky-300 hover:bg-sky-50"
              >
                <MicrosoftIcon />
                <span>Continue with Microsoft</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Guide
                </span>
              </Link>
            ) : null}

            {emailOption && socialOptions.length > 0 ? (
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
            ) : null}

            {emailOption ? (
              <a
                href={buildSignInHref(emailOption.provider, returnTo)}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${providerButtonClass(emailOption.provider)}`}
              >
                <ProviderIcon provider={emailOption.provider} />
                <span>Continue with email</span>
              </a>
            ) : null}

            {orderedOptions.length === 0 ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                Production sign-in is enabled, but no live providers are configured in this runtime yet.
                Add the OIDC provider environment values, redeploy, then return here.
              </p>
            ) : null}

            {!hasMicrosoftOption ? (
              <p className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">
                Microsoft sign-in is still part of the login path. If this preview runtime is missing the
                provider setup, open the Microsoft guide and finish the configuration there.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Need help?</p>
            <div className="mt-3 space-y-3 text-sm text-stone-600">
              <p>
                New to The Switch?{" "}
                <Link href="/how-it-works" className="font-semibold text-teal-800 underline underline-offset-2">
                  Learn how the platform works
                </Link>
              </p>
              <p>
                Need admin access?{" "}
                <Link
                  href="/login?intent=admin&returnTo=/admin"
                  className="font-medium text-teal-800 underline underline-offset-2"
                >
                  Open the admin sign-in path
                </Link>
              </p>
              <p>
                <Link
                  href="/login/microsoft-guide"
                  className="font-medium text-stone-700 underline underline-offset-2"
                >
                  Open the Microsoft sign-in guide
                </Link>
              </p>
              <p>
                Already signed in elsewhere?{" "}
                <Link href="/account" className="font-medium text-stone-700 underline underline-offset-2">
                  Open your account page
                </Link>
              </p>
            </div>
          </div>
      </section>
    </div>
  );
}
