import {
  getCmsOverviewApiData,
  getLaunchGovernanceOverviewApiData,
  getOperationsOverviewApiData,
  getPastPaperCatalogApiData,
  getPersistenceRuntimeSummaryApiData,
} from "@/lib/api/server";
import { requireRequestSessionRoles } from "@/modules/auth/request";
import { CmsWorkflowControls } from "@/components/cms-workflow-controls";
import { LaunchGovernanceControls } from "@/components/launch-governance-controls";

export const dynamic = "force-dynamic";

function getSyncClasses(status: "healthy" | "warning" | "planned"): string {
  if (status === "healthy") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "warning") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-stone-300 bg-stone-50 text-stone-800";
}

function getReleaseCheckClasses(status: "complete" | "in-progress" | "watch"): string {
  if (status === "complete") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "in-progress") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-stone-300 bg-stone-50 text-stone-800";
}

function getCloseoutClasses(status: "done" | "remaining"): string {
  return status === "done"
    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
    : "border-amber-300 bg-amber-50 text-amber-950";
}

function getPersistenceClasses(
  driver: "local-json" | "sqlite" | "memory",
  isPrototypePersistence: boolean,
): string {
  if (driver === "memory") {
    return "border-rose-300 bg-rose-50 text-rose-950";
  }

  return isPrototypePersistence
    ? "border-amber-300 bg-amber-50 text-amber-950"
    : "border-emerald-300 bg-emerald-50 text-emerald-950";
}

function getOperationsClasses(status: "healthy" | "warning" | "critical"): string {
  if (status === "healthy") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "critical") {
    return "border-rose-300 bg-rose-50 text-rose-950";
  }

  return "border-amber-300 bg-amber-50 text-amber-950";
}

export default async function AdminPage() {
  await requireRequestSessionRoles(["editor", "admin"]);
  const [cms, papers, operations, governance, persistence] = await Promise.all([
    getCmsOverviewApiData(),
    getPastPaperCatalogApiData(),
    getOperationsOverviewApiData(),
    getLaunchGovernanceOverviewApiData(),
    getPersistenceRuntimeSummaryApiData(),
  ]);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Admin + Content Architecture
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Live content and past-paper operating path for the current product runtime.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route now exposes the real operating path for reviewed learning content and
                curated past-paper updates, including where live workflow control ends and future
                source-provider replacement can begin safely.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Content items</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{cms.content.length}</p>
              <p className="mt-1 text-sm text-stone-600">{cms.studentVisibleCount} visible to students</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Paper catalog</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{papers.papers.length}</p>
              <p className="mt-1 text-sm text-stone-600">{papers.cataloguedCount} catalogued entries in controlled source review</p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Editorial queue</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{cms.editorialWorkflow.length}</p>
              <p className="mt-1 text-sm text-stone-600">{cms.editorialWorkflowSummary.queuedReviewCount} waiting for review</p>
            </div>
            <div className={`border p-4 ${getPersistenceClasses(persistence.driver, persistence.isPrototypePersistence)}`}>
              <p className="text-xs uppercase tracking-[0.2em] opacity-75">Persistence driver</p>
              <p className="mt-2 text-lg font-semibold">
                {persistence.driver}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {persistence.driver === "memory"
                  ? "Memory persistence is active, so student data would reset on restart."
                  : persistence.isPrototypePersistence
                  ? `Backup or restore coverage is still incomplete for ${persistence.dataDirectory}.`
                  : `Runtime directory: ${persistence.dataDirectory}`}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {persistence.backupDirectory
                  ? `Backup directory: ${persistence.backupDirectory}`
                  : "Backups are unavailable while memory persistence is active."}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {persistence.driver === "memory"
                  ? "Primary live store: unavailable while memory persistence is active."
                  : `Primary live store: ${persistence.primaryStorePath}`}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {persistence.backupStorePath
                  ? `Backup live store: ${persistence.backupStorePath}`
                  : "Backup live store: unavailable in the current runtime."}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {persistence.recoveryCheckedAt
                  ? `Recovery checks: ${persistence.recoveryReady ? "ready" : `${persistence.recoveryIssueCount} issue${persistence.recoveryIssueCount === 1 ? "" : "s"}`} at ${persistence.recoveryCheckedAt.slice(0, 16).replace("T", " ")}`
                  : "Recovery checks have not run yet."}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">CMS backend mode</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">{cms.backendMode}</p>
              <p className="mt-1 text-sm text-stone-600">
                {cms.backendMode === "read-only"
                  ? "Editorial writes are intentionally blocked until a writable production adapter is connected."
                  : "Editorial workflow is running through the live writable backend path for this runtime."}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Operations view
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Monitoring, alerts, and recovery watch points
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  This is the current launch-style view across auth, persistence, saved sessions,
                  assessments, exams, and editorial trust.
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className={`border p-4 ${getOperationsClasses(operations.overallStatus)}`}>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-75">Overall status</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{operations.overallStatus}</p>
                  <p className="mt-1 text-sm opacity-90">{operations.alertCount} active alert{operations.alertCount === 1 ? "" : "s"}</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Recovery checks</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {operations.recoveryReadiness.filter((item) => item.status === "ready").length}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">areas marked ready</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Generated</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{operations.generatedAt.slice(0, 10)}</p>
                  <p className="mt-1 text-sm text-stone-600">latest operations summary</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {operations.domains.map((domain) => (
                  <article key={domain.domainId} className={`border p-4 ${getOperationsClasses(domain.status)}`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">
                        {domain.label}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] opacity-75 capitalize">
                        {domain.status}
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-semibold">{domain.headline}</p>
                    <p className="mt-2 text-sm leading-6 opacity-90">{domain.detail}</p>
                    <p className="mt-3 text-sm font-medium opacity-90">
                      {domain.metricLabel}: {domain.metricValue}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Active alerts
                  </p>
                  <div className="mt-4 grid gap-3">
                    {operations.alerts.length ? operations.alerts.map((alert) => (
                      <div key={alert.alertId} className={`border p-3 ${getOperationsClasses(alert.severity === "critical" ? "critical" : "warning")}`}>
                        <p className="text-sm font-semibold">{alert.title}</p>
                        <p className="mt-2 text-sm leading-6 opacity-90">{alert.detail}</p>
                        <p className="mt-2 text-sm font-medium opacity-90">{alert.recommendedAction}</p>
                      </div>
                    )) : (
                      <div className="border border-emerald-300 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                        No active alerts in the current launch summary.
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Performance watch
                    </p>
                    <div className="mt-4 grid gap-3">
                      {operations.performanceBudgets.map((budget) => (
                        <div key={budget.budgetId} className="border border-stone-200 bg-white p-3">
                          <p className="text-sm font-semibold text-stone-950">{budget.label}</p>
                          <p className="mt-1 text-sm text-stone-700">{budget.currentValue}</p>
                          <p className="mt-1 text-sm text-stone-600">Target: {budget.targetValue}</p>
                          <p className="mt-2 text-sm leading-6 text-stone-600">{budget.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Recovery readiness
                    </p>
                    <div className="mt-4 grid gap-3">
                      {operations.recoveryReadiness.map((item) => (
                        <div key={item.itemId} className="border border-stone-200 bg-white p-3">
                          <p className="text-sm font-semibold text-stone-950">
                            {item.label} • {item.status}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-stone-600">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Launch governance
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Ownership, compliance review, and final launch checks
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  This is the final launch-readiness layer. It keeps review records, clear owners,
                  smoke checks, and post-launch follow-up routines in one place.
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                <div className={`border p-4 ${getOperationsClasses(governance.overallStatus === "ready" ? "healthy" : "warning")}`}>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-75">Governance</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{governance.overallStatus}</p>
                  <p className="mt-1 text-sm opacity-90">launch governance picture</p>
                </div>
                <div className="border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-700">{governance.finalPathSummary.label}</p>
                  <p className="mt-2 text-lg font-semibold text-amber-950">{governance.finalPathSummary.estimatedCompletionRange}</p>
                  <p className="mt-1 text-sm text-amber-900">toward full production launch</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Reviews</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.reviews.length}</p>
                  <p className="mt-1 text-sm text-stone-600">recorded launch reviews</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Owners</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.ownership.length}</p>
                  <p className="mt-1 text-sm text-stone-600">named responsibility areas</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">What the percentage means</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {governance.finalPathSummary.note}
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Code-complete closeout items</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {governance.finalPathSummary.codeCompleteCount} of {governance.finalPathSummary.totalCount}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">final launch items completed in the codebase</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Smoke checks</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.smokeChecks.length}</p>
                  <p className="mt-1 text-sm text-stone-600">core route checks</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Live environment checks</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.environmentChecks.length}</p>
                  <p className="mt-1 text-sm text-stone-600">deployment readiness checks</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Final sign-off checks</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.signOffChecks.length}</p>
                  <p className="mt-1 text-sm text-stone-600">trust and release approval checks</p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Recorded evidence items</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{governance.evidenceRecords.length}</p>
                  <p className="mt-1 text-sm text-stone-600">launch-proof records across auth, persistence, editorial, environment, and sign-off</p>
                </div>
              </div>
              <div className="mt-5 border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                  Final Path Mark 1
                </p>
                <p className="mt-3 text-sm leading-6 text-amber-950">
                  This is the main final-path checklist for true full completion across code, architecture, operations, and launch proof.
                </p>
                <div className="mt-4 grid gap-3">
                  {governance.finalPathSummary.closeoutItems.map((item, index) => (
                    <div key={item.itemId} className={`border p-3 ${getCloseoutClasses(item.status)}`}>
                      <p className="text-sm font-semibold">
                        {index + 1}. {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 opacity-90">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3">
                  {governance.finalPathSummary.biggestBlockers.map((blocker, index) => (
                    <div key={blocker} className="border border-stone-200 bg-white p-3 text-sm leading-6 text-stone-700">
                      <span className="font-semibold text-stone-950">Big blocker {index + 1}.</span> {blocker}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Launch evidence
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.evidenceRecords.map((record) => (
                      <div key={record.evidenceId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{record.title}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {record.status} • {record.owner}
                          {record.recordedAt ? ` • ${record.recordedAt}` : ""}
                          {record.environment ? ` • ${record.environment}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{record.summary}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                          source: {record.source}
                        </p>
                        <LaunchGovernanceControls
                          mode="evidence"
                          targetId={record.evidenceId}
                          owner={record.owner}
                          environment={record.environment}
                          note={record.summary}
                          status={record.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Recorded reviews
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.reviews.map((review) => (
                      <div key={review.reviewId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{review.title}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {review.status} • {review.owner}
                          {review.completedAt ? ` • ${review.completedAt}` : ""}
                          {review.environment ? ` • ${review.environment}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{review.note}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                          source: {review.source}
                        </p>
                        <LaunchGovernanceControls
                          mode="review"
                          targetId={review.reviewId}
                          owner={review.owner}
                          environment={review.environment}
                          note={review.note}
                          status={review.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Ownership map
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.ownership.map((item) => (
                      <div key={item.areaId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{item.area}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {item.primaryOwner} • backup {item.backupOwner}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{item.responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Live environment readiness
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.environmentChecks.map((check) => (
                      <div key={check.checkId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{check.label}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {check.status}
                          {check.owner ? ` • ${check.owner}` : ""}
                          {check.recordedAt ? ` • ${check.recordedAt.slice(0, 10)}` : ""}
                          {check.environment ? ` • ${check.environment}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{check.detail}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                          source: {check.source}
                        </p>
                        <LaunchGovernanceControls
                          mode="environment"
                          targetId={check.checkId}
                          owner={check.owner ?? "Platform lead"}
                          environment={check.environment}
                          note={check.detail}
                          status={check.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Final sign-off
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.signOffChecks.map((check) => (
                      <div key={check.checkId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{check.label}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {check.status} • {check.owner}
                          {check.recordedAt ? ` • ${check.recordedAt.slice(0, 10)}` : ""}
                          {check.environment ? ` • ${check.environment}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{check.detail}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                          source: {check.source}
                        </p>
                        <LaunchGovernanceControls
                          mode="signoff"
                          targetId={check.checkId}
                          owner={check.owner}
                          environment={check.environment}
                          note={check.detail}
                          status={check.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Final launch smoke checks
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.smokeChecks.map((check) => (
                      <div key={check.checkId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{check.route}</p>
                        <p className="mt-1 text-sm text-stone-700">
                          {check.status}
                          {check.owner ? ` • ${check.owner}` : ""}
                          {check.recordedAt ? ` • ${check.recordedAt.slice(0, 10)}` : ""}
                          {check.environment ? ` • ${check.environment}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{check.note}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                          source: {check.source}
                        </p>
                        <LaunchGovernanceControls
                          mode="smoke"
                          targetId={check.checkId}
                          owner={check.owner ?? "Release manager"}
                          environment={check.environment}
                          note={check.note}
                          status={check.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Post-launch review loops
                  </p>
                  <div className="mt-4 grid gap-3">
                    {governance.followUpLoops.map((loop) => (
                      <div key={loop.loopId} className="border border-stone-200 bg-white p-3">
                        <p className="text-sm font-semibold text-stone-950">{loop.title}</p>
                        <p className="mt-1 text-sm text-stone-700">{loop.cadence} • {loop.owner}</p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{loop.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  MVP release checklist
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Priority modules checked against the current release rule
                </h2>
              </div>
              <div className="mt-5 grid gap-4">
                {cms.releaseChecklist.map((module) => (
                  <article key={module.moduleId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getReleaseCheckClasses(module.status)}`}>
                        {module.status}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                        Priority {module.priorityOrder}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-stone-950">{module.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{module.summary}</p>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {module.checks.map((check) => (
                        <div key={check.checkId} className="border border-stone-200 bg-white p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`border px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${getReleaseCheckClasses(check.status)}`}>
                              {check.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-stone-950">{check.label}</p>
                          <p className="mt-2 text-sm leading-6 text-stone-600">{check.detail}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Editorial workflow
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Controlled review and publish queue for current content
                </h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Queued review</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{cms.editorialWorkflowSummary.queuedReviewCount}</p>
                </div>
                <div className="border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Fact-check</p>
                  <p className="mt-2 text-lg font-semibold text-amber-950">{cms.editorialWorkflowSummary.factCheckCount}</p>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Approved</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-950">{cms.editorialWorkflowSummary.approvedCount}</p>
                </div>
                <div className="border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-700">Blocked</p>
                  <p className="mt-2 text-lg font-semibold text-rose-950">{cms.editorialWorkflowSummary.blockedCount}</p>
                </div>
                <div className="border border-sky-200 bg-sky-50 p-4 sm:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Rollbacks logged</p>
                  <p className="mt-2 text-lg font-semibold text-sky-950">{cms.editorialWorkflowSummary.rollbackCount}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {cms.editorialWorkflow.slice(0, 8).map((item) => (
                  <article key={item.contentId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getSyncClasses(item.readyToPublish ? "healthy" : item.status === "blocked" ? "warning" : "planned")}`}>
                        {item.status}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                        {item.readyToPublish ? "ready-to-publish" : "needs gate checks"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-stone-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.note}</p>
                    <p className="mt-2 text-sm text-stone-700">Owner: {item.owner}</p>
                    <p className="mt-1 text-sm text-stone-700">Updated: {item.updatedAt}</p>
                    <p className="mt-1 text-sm text-stone-700">Last action: {item.lastActionType}</p>
                    <div className="mt-4 border border-stone-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Publish gate
                      </p>
                      <div className="mt-3 grid gap-2">
                        {item.publishGate.checks.map((check) => (
                          <div key={check.checkId} className="border border-stone-200 bg-stone-50 p-3">
                            <p className="text-sm font-semibold text-stone-950">
                              {check.passed ? "Pass" : "Block"} • {check.label}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-stone-700">{check.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 border border-stone-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Recent audit trail
                      </p>
                      {item.actionHistory.slice(-3).reverse().map((event) => (
                        <div key={event.eventId} className="border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                          <p className="font-semibold text-stone-950">{event.actionType} • {event.fromStatus} to {event.toStatus}</p>
                          <p>{event.owner}</p>
                          <p>{event.note || "No note recorded for this step."}</p>
                          <p>{event.createdAt}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <CmsWorkflowControls
                        contentId={item.contentId}
                        note={item.note}
                        status={item.status}
                        owner={item.owner}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Content update architecture
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  How the website now receives updated learning content
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {cms.providers.map((provider) => (
                  <article key={provider.providerId} className="border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getSyncClasses(provider.syncStatus)}`}>
                        {provider.syncStatus}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">{provider.type}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-stone-950">{provider.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{provider.description}</p>
                    <p className="mt-3 text-sm text-stone-700">{provider.nextStep}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                {cms.nextUpdatePlan}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Editorial gate
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  What can safely reach student routes
                </h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Topics</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">
                    {cms.editorialAudit.totalTopicCount}
                  </p>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Student visible</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-950">
                    {cms.editorialAudit.studentVisibleTopicCount}
                  </p>
                </div>
                <div className="border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Blocked</p>
                  <p className="mt-2 text-lg font-semibold text-amber-950">
                    {cms.editorialAudit.blockedTopicCount}
                  </p>
                </div>
                <div className="border border-sky-200 bg-sky-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Trusted sources</p>
                  <p className="mt-2 text-lg font-semibold text-sky-950">
                    {cms.editorialAudit.sourceAttributionCompleteCount}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {cms.editorialAudit.gateDecisions
                  .filter((decision) => !decision.studentVisible)
                  .map((decision) => (
                    <article key={decision.topicId} className="border border-amber-200 bg-amber-50 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                        <span>{decision.publicationStatus}</span>
                        <span>{decision.reviewStatus}</span>
                        <span>{decision.hasTrustedSourceAttribution ? "trusted-source" : "source-check-needed"}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-stone-950">{decision.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-700">{decision.reason}</p>
                      <p className="mt-2 text-sm leading-6 text-stone-700">{decision.nextStep}</p>
                    </article>
                  ))}
              </div>
              <div className="mt-5 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                {cms.editorialAudit.nextEditorialPriority}
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                  Past paper sourcing
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Where updated past papers now move through the platform
                </h2>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {papers.providers.map((provider) => (
                  <article key={provider.providerId} className="border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{provider.type}</p>
                    <h3 className="mt-3 text-lg font-semibold text-stone-950">{provider.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{provider.description}</p>
                    <p className="mt-3 text-sm text-stone-700">Update cadence: {provider.updateCadence}</p>
                    <p className="mt-2 text-sm text-stone-700">{provider.nextStep}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
                {papers.nextUpdatePlan}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What is true right now
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Student content still comes from seeded module data inside the repo.</li>
                <li>Reviewed content updates now move through the live editorial workflow before student visibility changes.</li>
                <li>Past papers now use a real catalog path with direct-link entries and separately catalogued follow-up items.</li>
                <li>The provider boundaries are explicit, so source replacement can happen without rewriting routes.</li>
              </ul>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Content updates now follow an operating path in code, not only planning notes.</li>
                <li>Past paper sourcing now has an active catalog path plus provider boundaries for controlled expansion.</li>
                <li>Website and future app clients can later consume the same CMS and paper catalogs through API routes.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
