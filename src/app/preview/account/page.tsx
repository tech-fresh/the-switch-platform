import Link from "next/link";

import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";

const PREVIEW_PREFIX = "/preview";

export default function PreviewAccountPage() {
  const data = buildMockPreviewDashboardData();

  return (
    <StudentAppShell
      displayName="Preview student"
      powerGridLevel={data.summary.overallLevel}
      hrefPrefix={PREVIEW_PREFIX}
      showUtilityLinks={false}
      accountHref="/preview/account"
    >
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Profile preview</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">Preview account landing point</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          The preview nav now has a stable profile destination, so the shell can be used like a working app instead
          of dropping you out of preview mode.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/preview/dashboard"
            className="rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Back to dashboard preview
          </Link>
          <Link
            href="/mock-idea-preview"
            className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-sky-300 hover:bg-sky-50"
          >
            Return to gallery
          </Link>
        </div>
      </section>
    </StudentAppShell>
  );
}
