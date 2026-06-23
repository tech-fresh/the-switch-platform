import Link from "next/link";
import { AccountAuthControls } from "@/components/account-auth-controls";
import { getAccountOverviewApiData } from "@/lib/api/server";

export const dynamic = "force-dynamic";

function getAuthReadinessClasses(status: "development-only" | "needs-provider-setup" | "ready" | "external-managed"): string {
  if (status === "ready") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "external-managed") {
    return "border-sky-300 bg-sky-50 text-sky-950";
  }

  return "border-amber-300 bg-amber-50 text-amber-950";
}

function getRoleClasses(role: "student" | "editor" | "admin"): string {
  if (role === "admin") {
    return "border-sky-300 bg-sky-50 text-sky-950";
  }

  if (role === "editor") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  return "border-stone-300 bg-stone-100 text-stone-800";
}

function formatSignedInAt(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}

function formatSessionExpiry(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}

function getAuthErrorMessage(authError: string | undefined): string | null {
  if (!authError) {
    return null;
  }

  if (authError === "provider-not-configured") {
    return "The selected sign-in provider is not configured in this runtime yet. Add the live provider settings before using this sign-in path.";
  }

  if (authError === "token-exchange-failed" || authError === "user-info-failed") {
    return "The production sign-in provider responded, but the session could not be completed safely.";
  }

  if (authError === "invalid-callback-state" || authError === "missing-flow-state") {
    return "The sign-in flow expired or could not be verified. Please start again from this page.";
  }

  if (authError === "external-managed") {
    return "This runtime expects sign-in to be handled by a trusted upstream identity layer.";
  }

  return "Sign-in could not be completed. Please try again.";
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ authError?: string | string[] | undefined }>;
}) {
  const [account, resolvedSearchParams] = await Promise.all([
    getAccountOverviewApiData(),
    searchParams ?? Promise.resolve({} as { authError?: string | string[] | undefined }),
  ]);
  const authenticatedSession =
    account.session.status === "authenticated" ? account.session : null;
  const canOpenAdmin =
    authenticatedSession?.user.roles.some((role) => role === "editor" || role === "admin") ?? false;
  const rawAuthError = resolvedSearchParams.authError;
  const authError = Array.isArray(rawAuthError) ? rawAuthError[0] : rawAuthError;
  const authErrorMessage = getAuthErrorMessage(authError);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {authErrorMessage ? (
          <section className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
            {authErrorMessage}
          </section>
        ) : null}

        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
              Student Account
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {account.isAuthenticated
                  ? "Signed-in student identity, quick account actions, and product-linked support in one route."
                  : account.signedOutTitle}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                {account.isAuthenticated
                  ? "This slice gives the MVP a real account option. Identity stays inside the auth module, while the website reads an account overview model that can later be served through an API to mobile and web clients alike."
                  : account.signedOutDescription}
              </p>
            </div>
          </div>

          <div className="space-y-3 border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Current session</p>
            {authenticatedSession ? (
              <>
                <p className="text-lg font-semibold text-stone-950">
                  {authenticatedSession.user.displayName}
                </p>
                <p className="text-sm text-stone-600">{authenticatedSession.user.email}</p>
                <p className="text-sm text-stone-600">
                  Signed in via {authenticatedSession.provider} at {" "}
                  {formatSignedInAt(authenticatedSession.signedInAt)}
                </p>
                <p className="text-sm text-stone-600">
                  Roles: {authenticatedSession.user.roles.join(", ")}
                </p>
                <p className="text-sm text-stone-600">
                  Session expires at {formatSessionExpiry(authenticatedSession.expiresAt)}
                </p>
                {canOpenAdmin ? (
                  <div className="pt-2">
                    <Link
                      href="/admin"
                      className="inline-flex border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 transition hover:bg-white"
                    >
                      Open admin dashboard
                    </Link>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-stone-950">Signed out</p>
                <p className="text-sm text-stone-600">
                  Sign in to keep progress, support settings, and resume links tied to one student account.
                </p>
                <p className="text-sm text-stone-600">
                  Use the same sign-in for student and admin access. Admin tools open after sign-in when this email is allowlisted for editor or admin roles.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex border border-teal-700 bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  Log in
                </Link>
              </>
            )}
            <div className="pt-2">
              <AccountAuthControls
                isAuthenticated={account.isAuthenticated}
                signInOptions={account.signInOptions}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {account.metrics.map((metric) => (
            <article key={metric.label} className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
	          <div className="grid gap-6">
	            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Account-linked study actions
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  {account.isAuthenticated
                    ? "Jump back into the product from one signed-in home"
                    : "Preview the routes that become account-linked after sign-in"}
                </h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {account.quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border border-stone-200 bg-stone-50 p-4 transition hover:bg-white"
                  >
                    <p className="text-lg font-semibold text-stone-950">{link.label}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{link.description}</p>
                  </Link>
                ))}
              </div>
	            </article>

	            <article className="border border-stone-200 bg-white p-5 sm:p-6">
	              <div className={`border p-4 ${getAuthReadinessClasses(account.authReadiness.status)}`}>
	                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">
	                  Live sign-in readiness
	                </p>
	                <p className="mt-2 text-lg font-semibold">{account.authReadiness.title}</p>
	                <p className="mt-2 text-sm leading-6 opacity-90">{account.authReadiness.detail}</p>
	                <p className="mt-2 text-sm opacity-90">
	                  Mode: {account.authReadiness.mode} • Configured providers: {account.authReadiness.configuredProviderCount}
	                </p>
	              </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    One sign-in, role-based access
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    The website now uses one main sign-in path. Student routes open for every authenticated learner, and admin tools appear automatically when the signed-in email is mapped to editor or admin roles through the auth environment.
                  </p>
                  {authenticatedSession ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {authenticatedSession.user.roles.map((role) => (
                        <span
                          key={role}
                          className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getRoleClasses(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    If this account should open the admin area, add the signed-in email to `SWITCH_AUTH_EDITOR_EMAILS` or `SWITCH_AUTH_ADMIN_EMAILS`, redeploy, then sign in again.
                  </p>
                  {canOpenAdmin ? (
                    <Link
                      href="/admin"
                      className="mt-4 inline-flex border border-sky-300 bg-white px-3 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
                    >
                      Go to admin metrics
                    </Link>
                  ) : null}
                </div>
	              <div className="grid gap-5 lg:grid-cols-2">
	                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Sign-in options
                  </p>
                  <div className="mt-4 space-y-3">
                    {account.signInOptions.map((option) => (
                      <div key={option.provider} className="border border-stone-200 bg-stone-50 p-4">
                        <p className="text-sm font-semibold text-stone-950">{option.label}</p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{option.description}</p>
                      </div>
                    ))}
                  </div>
                  {account.signInOptions.length === 0 ? (
                    <p className="mt-4 text-sm leading-6 text-amber-800">
                      Production auth is active, but no live sign-in providers are configured in this runtime yet.
                    </p>
                  ) : null}
                  {!account.isAuthenticated ? (
                    <p className="mt-4 text-sm leading-6 text-stone-600">
                      Production auth is now the primary route. Preview sign-in remains an explicit development-only mode.
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Support carry-over
                  </p>
                  <div className="mt-4 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                    {account.supportSummary}
                  </div>
                  <Link
                    href="/account/live-cookie-guide"
                    className="mt-4 inline-flex border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-white"
                  >
                    Open live cookie guide
                  </Link>
                  <div className="mt-4 border border-stone-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Next best action</p>
                    <p className="mt-2 text-lg font-semibold text-stone-950">{account.nextBestAction}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Student identity now has a real signed session boundary instead of a hardcoded signed-in default.</li>
                <li>Session expiry and protected admin access now behave more like a real launch path.</li>
                <li>One login path can serve student and admin journeys without splitting auth into two disconnected account systems.</li>
                <li>Account data can aggregate module outputs without moving their logic into the page.</li>
                <li>Website and future mobile clients can consume the same account contracts through an API layer.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
