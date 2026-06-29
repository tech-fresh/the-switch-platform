import Link from "next/link";

import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";

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
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Mark32PageHeader
          eyebrow="Live auth guide"
          title="Copy the two live auth cookies needed for the final launch walkthrough."
          description="Use this page when you need the exact switch_auth_session cookie for one student account and one admin account from the deployed platform."
          aside={
            <div className="border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Important</p>
              <p className="mt-3 text-sm leading-6 text-amber-950">
                Use your deployed site for this process, not localhost. Copy only the cookie name and value.
                Do not copy Path, Expires, HttpOnly, or other cookie metadata.
              </p>
            </div>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
                  Step by step
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Student cookie first, admin cookie second
                </h2>
              </div>

              <ol className="mt-5 space-y-4 text-sm leading-6 text-stone-700">
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Open your deployed site in a normal browser window and sign in as the student
                  user.
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Open browser developer tools.
                  <div className="mt-2 text-stone-600">
                    Mac: <span className="font-medium text-stone-950">Cmd + Option + I</span>
                    {" · "}Windows: <span className="font-medium text-stone-950">Ctrl + Shift + I</span>
                  </div>
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Open the cookie storage panel for your browser.
                  <div className="mt-3 grid gap-3">
                    {browserSteps.map((step) => (
                      <div key={step.browser} className="border border-stone-200 bg-white p-3">
                        <p className="font-semibold text-stone-950">{step.browser}</p>
                        <p className="mt-1 text-stone-600">{step.path}</p>
                      </div>
                    ))}
                  </div>
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Find the cookie named{" "}
                  <span className="font-semibold text-stone-950">switch_auth_session</span>.
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Copy it in this exact format:
                  <pre className="mt-3 overflow-x-auto border border-stone-200 bg-white p-3 text-xs text-stone-950">
                    <code>switch_auth_session=PASTE_THE_COOKIE_VALUE_HERE</code>
                  </pre>
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Save that value as{" "}
                  <span className="font-semibold text-stone-950">SWITCH_LIVE_STUDENT_COOKIE</span>.
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Sign out, or open a separate browser profile or private window, then sign in as
                  the admin user.
                </li>
                <li className="border border-stone-200 bg-stone-50 p-4">
                  Repeat the same cookie steps and save that value as{" "}
                  <span className="font-semibold text-stone-950">SWITCH_LIVE_ADMIN_COOKIE</span>.
                </li>
              </ol>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Env file target
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Paste both cookie values into `.env.local`
                </h2>
              </div>
              <pre className="mt-5 overflow-x-auto border border-stone-200 bg-stone-50 p-4 text-xs text-stone-950">
                <code>{finalEnvExample}</code>
              </pre>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                Once those values are in `.env.local`, the live verification scripts can reuse them
                for the final auth walkthrough.
              </p>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Exact output needed
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>`SWITCH_LIVE_STUDENT_COOKIE=switch_auth_session=...`</li>
                <li>`SWITCH_LIVE_ADMIN_COOKIE=switch_auth_session=...`</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Do not copy
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>localhost cookies</li>
                <li>Path or Expires fields</li>
                <li>HttpOnly or SameSite labels</li>
                <li>cookies from the wrong account type</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Quick links
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/account"
                  className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 transition hover:bg-white"
                >
                  Back to account
                </Link>
                <Link
                  href="/admin"
                  className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 transition hover:bg-white"
                >
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
