import Link from "next/link";

import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { premiumUi } from "@/components/premium/premium-ui";
import { Mark32HeroRow } from "@/components/streamlined/mark32-hero-row";
import { WeeklyPlannerGrid } from "@/components/weekly-planner-grid";

const PREVIEW_PREFIX = "/preview";

export default function PreviewDashboardPage() {
  const data = buildMockPreviewDashboardData();

  const appCards = [
    {
      href: "/preview/subjects",
      eyebrow: "Subjects",
      title: "Open revision topics",
      description: "Browse subject routes, open topics, and try the premium quiz flow in preview mode.",
    },
    {
      href: "/preview/exams",
      eyebrow: "Exams",
      title: "Browse full papers",
      description: "See live paper cards, boards, tiers, and question previews for the selected paper.",
    },
    {
      href: "/preview/progress",
      eyebrow: "Progress",
      title: "Inspect the Power Grid",
      description: "Open the weekly planner and full Power Grid journey without leaving preview mode.",
    },
    {
      href: "/preview/account",
      eyebrow: "Profile",
      title: "See the student profile preview",
      description: "Preview landing point for the account tab in the mobile and desktop nav.",
    },
  ];

  return (
    <StudentAppShell
      displayName="Preview student"
      powerGridLevel={data.summary.overallLevel}
      xpTotal={data.summary.xpTotal}
      studyDaysThisWeek={2}
      hrefPrefix={PREVIEW_PREFIX}
      showUtilityLinks={false}
      accountHref="/preview/account"
    >
      <div className="space-y-8">
        <section className={premiumUi.card}>
          <p className={premiumUi.eyebrowAccent}>Preview mode</p>
          <h1 className={`mt-3 ${premiumUi.heading}`}>Linear-style command centre dashboard</h1>
          <p className={`mt-3 max-w-3xl ${premiumUi.body}`}>
            Premium dark dashboard with Today&apos;s Goal, Continue Revision, Power Level, and Weak Topics — same layout
            as the signed-in `/dashboard` route.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mock-idea-preview" className={premiumUi.secondaryBtn}>
              Back to gallery
            </Link>
            <Link href="/preview/subjects" className={premiumUi.primaryBtn}>
              Try quiz flow
            </Link>
          </div>
        </section>

        <Mark32HeroRow data={data} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {appCards.map((card) => (
            <Link key={card.href} href={card.href} className={premiumUi.cardHover}>
              <p className={premiumUi.eyebrow}>{card.eyebrow}</p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-white">{card.title}</h2>
              <p className={`mt-2 ${premiumUi.body}`}>{card.description}</p>
            </Link>
          ))}
        </section>

        <WeeklyPlannerGrid planner={data.weeklyPlanner} hrefPrefix={PREVIEW_PREFIX} />
      </div>
    </StudentAppShell>
  );
}
