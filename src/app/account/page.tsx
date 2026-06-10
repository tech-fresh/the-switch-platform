import Link from "next/link";
import { AccountAuthControls } from "@/components/account-auth-controls";
import { getAccountOverviewApiData } from "@/lib/api/server";

function formatSignedInAt(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}

export default async function AccountPage() {
  const account = await getAccountOverviewApiData();
  const authenticatedSession =
    account.session.status === "authenticated" ? account.session : null;

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
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
                  Signed in via {authenticatedSession.provider} at{" "}
                  {formatSignedInAt(authenticatedSession.signedInAt)}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-stone-950">Signed out</p>
                <p className="text-sm text-stone-600">
                  Sign in to keep progress, support settings, and resume links tied to one student account.
                </p>
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
                  {!account.isAuthenticated ? (
                    <p className="mt-4 text-sm leading-6 text-stone-600">
                      Use any provider above to start the same seeded student profile through a real cookie-backed session.
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
                <li>Student identity now has a real cookie-backed session flow instead of a hardcoded signed-in default.</li>
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
