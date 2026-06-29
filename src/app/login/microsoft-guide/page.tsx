import Image from "next/image";
import Link from "next/link";

import { PublicMarketingPage } from "@/components/public-marketing-page";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

export const dynamic = "force-dynamic";

const azureSteps = [
  "Open Azure Portal → Microsoft Entra ID → App registrations.",
  "Create or open your Switch app registration.",
  "Supported account types: multitenant + personal Microsoft accounts (Hotmail/Outlook).",
  "Authentication → Add platform → Web.",
  "Add redirect URI: https://theswitchplatform.com/api/auth/callback",
  "Copy Application (client) ID (a UUID) and a new client secret into Fly secrets — not placeholder text.",
];

const envExample = `SWITCH_OIDC_MICROSOFT_CLIENT_ID=your-azure-client-id
SWITCH_OIDC_MICROSOFT_CLIENT_SECRET=your-azure-client-secret
SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
SWITCH_OIDC_MICROSOFT_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
SWITCH_OIDC_MICROSOFT_USERINFO_URL=https://graph.microsoft.com/oidc/userinfo
SWITCH_OIDC_MICROSOFT_SCOPES=openid profile email`;

export default function MicrosoftLoginGuidePage() {
  return (
    <PublicMarketingPage>
      <Mark32PageHeader
        eyebrow="Resources"
        title="Turn on Continue with Microsoft for students and admin."
        description="This page explains the live Microsoft sign-in path in plain language. The login button lives on `/login`, but the real session is still created by the auth module through `/api/auth/start` and `/api/auth/callback`."
        aside={
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-800">Learner-friendly rule</p>
            <p className="mt-3 text-sm leading-6 text-violet-950">
              Seeing the Microsoft button only means the website knows Microsoft sign-in is configured. A
              real Microsoft login is only proven when the browser leaves the site, returns through the
              callback, and opens your dashboard signed in.
            </p>
          </div>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className={mark32Ui.card}>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            What happens when someone presses the button
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
            <Image
              src="/docs/microsoft-sign-in-flow.png"
              alt="Diagram showing Log in, Microsoft sign-in, return to The Switch, and dashboard access"
              width={1200}
              height={675}
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-700">
            <li>Open `/login` and press **Continue with Microsoft**.</li>
            <li>Sign in on the Microsoft page with a school or work account.</li>
            <li>Microsoft sends the browser back to The Switch callback route.</li>
            <li>The platform creates `switch_auth_session` and opens the dashboard.</li>
          </ol>
        </article>

        <aside className="space-y-4">
          <section className={mark32Ui.statCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick links</p>
            <div className="mt-4 grid gap-2 text-sm">
              <Link href="/login" className={mark32Ui.linkAccent}>
                Open login page
              </Link>
              <Link href="/account" className="font-medium text-slate-700 underline underline-offset-2">
                Open account page
              </Link>
            </div>
          </section>
          <section className={`${mark32Ui.statCard} text-sm leading-6 text-slate-700`}>
            Admin access still comes from email allowlists: `SWITCH_AUTH_ADMIN_EMAILS` and
            `SWITCH_AUTH_EDITOR_EMAILS`.
          </section>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className={mark32Ui.card}>
          <h2 className="text-xl font-bold text-slate-950">Azure setup checklist</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            {azureSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <article className={mark32Ui.card}>
          <h2 className="text-xl font-bold text-slate-950">Environment block</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            {envExample}
          </pre>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Full operator notes live in `docs/MICROSOFT_OAUTH_LIVE.md`. Run `npm run setup:microsoft-oauth-live`
            to open Azure and print the redirect URI.
          </p>
        </article>
      </section>
    </PublicMarketingPage>
  );
}
