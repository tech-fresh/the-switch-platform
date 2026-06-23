import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const azureSteps = [
  "Open Azure Portal → Microsoft Entra ID → App registrations.",
  "Create or open your Switch app registration.",
  "Authentication → Add platform → Web.",
  "Add redirect URI: https://theswitchplatform.com/api/auth/callback",
  "Copy Application (client) ID and a new client secret into your environment.",
];

const envExample = `SWITCH_OIDC_MICROSOFT_CLIENT_ID=your-azure-client-id
SWITCH_OIDC_MICROSOFT_CLIENT_SECRET=your-azure-client-secret
SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
SWITCH_OIDC_MICROSOFT_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
SWITCH_OIDC_MICROSOFT_USERINFO_URL=https://graph.microsoft.com/oidc/userinfo
SWITCH_OIDC_MICROSOFT_SCOPES=openid profile email`;

export default function MicrosoftLoginGuidePage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Microsoft Sign-In Guide
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Turn on Continue with Microsoft for students and admin.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This page explains the live Microsoft sign-in path in plain language. The login
                button lives on `/login`, but the real session is still created by the auth module
                through `/api/auth/start` and `/api/auth/callback`.
              </p>
            </div>
          </div>

          <div className="border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-800">Learner-friendly rule</p>
            <p className="mt-3 text-sm leading-6 text-sky-950">
              Seeing the Microsoft button only means the website knows Microsoft sign-in is
              configured. A real Microsoft login is only proven when the browser leaves the site,
              returns through the callback, and opens your dashboard signed in.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              What happens when someone presses the button
            </h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <Image
                src="/docs/microsoft-sign-in-flow.png"
                alt="Diagram showing Log in, Microsoft sign-in, return to The Switch, and dashboard access"
                width={1200}
                height={675}
                className="h-auto w-full rounded-xl"
                priority
              />
            </div>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-stone-700">
              <li>Open `/login` and press **Continue with Microsoft**.</li>
              <li>Sign in on the Microsoft page with a school or work account.</li>
              <li>Microsoft sends the browser back to The Switch callback route.</li>
              <li>The platform creates `switch_auth_session` and opens the dashboard.</li>
            </ol>
          </article>

          <aside className="space-y-4">
            <section className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Quick links</p>
              <div className="mt-4 grid gap-2 text-sm">
                <Link href="/login" className="font-semibold text-teal-700 underline underline-offset-2">
                  Open login page
                </Link>
                <Link href="/account" className="font-medium text-stone-700 underline underline-offset-2">
                  Open account page
                </Link>
              </div>
            </section>
            <section className="border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-700">
              Admin access still comes from email allowlists:
              `SWITCH_AUTH_ADMIN_EMAILS` and `SWITCH_AUTH_EDITOR_EMAILS`.
            </section>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-stone-950">Azure setup checklist</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              {azureSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-stone-950">Environment block</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-stone-950 p-4 text-xs leading-6 text-stone-100">
              {envExample}
            </pre>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Full operator notes live in `docs/MICROSOFT_OAUTH_LIVE.md`. Run `npm run
              setup:microsoft-oauth-live` to open Azure and print the redirect URI.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
