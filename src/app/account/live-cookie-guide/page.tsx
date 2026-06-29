import Link from "next/link";

import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

export const dynamic = "force-dynamic";

const browserSteps = [
  {
    browser: "Chrome or Edge",
    path: "Application -> Storage -> Cookies -> your deployed site domain",
  },
  {
    browser: "Firefox",
    path: "Storage -> Cookies -> your deployed site domain",
  },
  {
    browser: "Safari",
    path: "Develop -> Show Web Inspector -> Storage -> Cookies",
  },
];

const finalEnvExample = `SWITCH_LIVE_BASE_URL=https://your-live-domain.com
SWITCH_LIVE_STUDENT_COOKIE=switch_auth_session=student-cookie-value
SWITCH_LIVE_ADMIN_COOKIE=switch_auth_session=admin-cookie-value`;

export default function LiveCookieGuidePage() {
  return (
    <main className={mark32Ui.publicMain}>
      <div className={`${mark32Ui.contentWrap} max-w-5xl`}>
        <Mark32PageHeader
          eyebrow="Live auth guide"
          title="Copy the two live auth cookies needed for the final launch walkthrough."
          description="Use this page when you need the exact switch_auth_session cookie for one student account and one admin account from the deployed platform."
          aside={
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Important</p>
              <p className="mt-3 text-sm leading-6 text-amber-950">
                Use your deployed site for this process, not localhost. Copy only the cookie name and value. Do
                not copy Path, Expires, HttpOnly, or other cookie metadata.
              </p>
            </div>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-6">
            <article className={mark32Ui.card}>
              <div className="border-b border-violet-100 pb-5">
                <p className={mark32Ui.eyebrow}>Step by step</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Student cookie first, admin cookie second
                </h2>
              </div>

              <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Open your deployed site in a normal browser window and sign in as the student user.
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Open browser developer tools.
                  <div className="mt-2 text-slate-600">
                    Mac: <span className="font-medium text-slate-950">Cmd + Option + I</span>
                    {" · "}Windows: <span className="font-medium text-slate-950">Ctrl + Shift + I</span>
                  </div>
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Open the cookie storage panel for your browser.
                  <div className="mt-3 grid gap-3">
                    {browserSteps.map((step) => (
                      <div key={step.browser} className="rounded-xl border border-violet-100 bg-white p-3">
                        <p className="font-bold text-slate-950">{step.browser}</p>
                        <p className="mt-1 text-slate-600">{step.path}</p>
                      </div>
                    ))}
                  </div>
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Find the cookie named{" "}
                  <span className="font-bold text-slate-950">switch_auth_session</span>.
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Copy it in this exact format:
                  <pre className="mt-3 overflow-x-auto rounded-xl border border-violet-100 bg-white p-3 text-xs text-slate-950">
                    <code>switch_auth_session=PASTE_THE_COOKIE_VALUE_HERE</code>
                  </pre>
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Save that value as{" "}
                  <span className="font-bold text-slate-950">SWITCH_LIVE_STUDENT_COOKIE</span>.
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Sign out, or open a separate browser profile or private window, then sign in as the admin
                  user.
                </li>
                <li className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                  Repeat the same cookie steps and save that value as{" "}
                  <span className="font-bold text-slate-950">SWITCH_LIVE_ADMIN_COOKIE</span>.
                </li>
              </ol>
            </article>

            <article className={mark32Ui.card}>
              <div className="border-b border-violet-100 pb-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Env file target</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Paste both cookie values into `.env.local`
                </h2>
              </div>
              <pre className="mt-5 overflow-x-auto rounded-xl border border-violet-100 bg-violet-50/40 p-4 text-xs text-slate-950">
                <code>{finalEnvExample}</code>
              </pre>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Once those values are in `.env.local`, the live verification scripts can reuse them for the
                final auth walkthrough.
              </p>
            </article>
          </div>

          <aside className="space-y-6">
            <section className={mark32Ui.statCard}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Exact output needed</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                <li>`SWITCH_LIVE_STUDENT_COOKIE=switch_auth_session=...`</li>
                <li>`SWITCH_LIVE_ADMIN_COOKIE=switch_auth_session=...`</li>
              </ul>
            </section>

            <section className={mark32Ui.statCard}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Do not copy</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                <li>localhost cookies</li>
                <li>Path or Expires fields</li>
                <li>HttpOnly or SameSite labels</li>
                <li>cookies from the wrong account type</li>
              </ul>
            </section>

            <section className={mark32Ui.statCard}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Quick links</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/account" className={mark32Ui.secondaryBtn}>
                  Back to account
                </Link>
                <Link href="/admin" className={mark32Ui.secondaryBtn}>
                  Open admin route
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
