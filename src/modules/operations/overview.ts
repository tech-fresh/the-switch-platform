import type {
  OperationsAlert,
  OperationsDomainSummary,
  OperationsOverview,
  OperationsPerformanceBudget,
  OperationsRecoveryItem,
  OperationsStatus,
} from "./types";

export interface BuildOperationsOverviewInput {
  generatedAt?: string;
  authMode: "preview-cookie" | "oidc" | "external-header";
  allowRedirectSignIn: boolean;
  activeAuthSessions: number;
  persistenceDriver: "local-json" | "sqlite" | "memory";
  isPrototypePersistence: boolean;
  dataDirectory: string;
  totalSavedProgressRecords: number;
  submittedSavedProgressCount: number;
  savedProgressWithSupportSnapshots: number;
  assessmentCount: number;
  examPaperCount: number;
  contentTopicCount: number;
  cmsBackendMode: "live" | "read-only";
  queuedReviewCount: number;
  blockedCount: number;
  rollbackCount: number;
}

export function buildOperationsOverview(input: BuildOperationsOverviewInput): OperationsOverview {
  const domains: OperationsDomainSummary[] = [
    {
      domainId: "auth",
      label: "Auth",
      status: input.authMode === "preview-cookie" ? "warning" : "healthy",
      headline:
        input.authMode === "preview-cookie"
          ? "Preview auth is still active."
          : "Production-style auth is active.",
      detail:
        input.authMode === "preview-cookie"
          ? "Launch monitoring should move away from preview-cookie mode before the product is treated as fully live."
          : "The sign-in boundary is running in a production-style mode with redirect or header-based identity handling.",
      metricLabel: "Active sessions",
      metricValue: String(input.activeAuthSessions),
    },
    {
      domainId: "persistence",
      label: "Persistence",
      status:
        input.persistenceDriver === "memory"
          ? "critical"
          : input.isPrototypePersistence
            ? "warning"
            : "healthy",
      headline:
        input.persistenceDriver === "memory"
          ? "Data would reset on restart."
          : input.isPrototypePersistence
            ? "Student data is still tied to a provisional local storage setup."
            : "Persistence runtime looks launch-ready.",
      detail:
        input.persistenceDriver === "memory"
          ? "In-memory storage is useful for previews, but it is not safe for live student continuity."
          : input.isPrototypePersistence
            ? `Student data is currently written to ${input.dataDirectory}, so backup and restore checks should stay visible until the intended live data location is fully settled.`
            : "The persistence layer is no longer relying on a prototype-only runtime shape.",
      metricLabel: "Saved records",
      metricValue: String(input.totalSavedProgressRecords),
    },
    {
      domainId: "saved-progress",
      label: "Saved progress",
      status:
        input.totalSavedProgressRecords > 0 &&
        input.savedProgressWithSupportSnapshots === input.totalSavedProgressRecords
          ? "healthy"
          : "warning",
      headline:
        input.totalSavedProgressRecords > 0
          ? "Resume and review coverage is active."
          : "No saved session evidence is stored yet.",
      detail:
        input.savedProgressWithSupportSnapshots === input.totalSavedProgressRecords
          ? "Current saved-session records carry support snapshots and stay ready for resume or review paths."
          : "Some saved-session records are missing support snapshots, so continuity checks should stay visible.",
      metricLabel: "Submitted sessions",
      metricValue: String(input.submittedSavedProgressCount),
    },
    {
      domainId: "assessments",
      label: "Timed assessments",
      status: input.assessmentCount >= 4 ? "healthy" : "warning",
      headline:
        input.assessmentCount >= 4
          ? "Checkpoint inventory is broad enough for current launch scope."
          : "Checkpoint coverage is still narrow.",
      detail:
        input.assessmentCount >= 4
          ? "Timed checkpoints now cover multiple subjects and can be monitored as a real student product surface."
          : "More checkpoint breadth is still needed before this area can be treated as comfortably launch-ready.",
      metricLabel: "Checkpoint count",
      metricValue: String(input.assessmentCount),
    },
    {
      domainId: "exams",
      label: "Exams",
      status: input.examPaperCount >= 4 ? "healthy" : "warning",
      headline:
        input.examPaperCount >= 4
          ? "Exam inventory is in a usable launch range."
          : "Exam inventory still needs broader coverage.",
      detail:
        input.examPaperCount >= 4
          ? "Exam papers, resume paths, and result review flows can now be tracked as one operational slice."
          : "The live exam path exists, but broader paper coverage still needs attention before launch confidence is high.",
      metricLabel: "Paper count",
      metricValue: String(input.examPaperCount),
    },
    {
      domainId: "editorial",
      label: "Editorial",
      status:
        input.cmsBackendMode === "read-only" || input.blockedCount > 0 ? "warning" : "healthy",
      headline:
        input.cmsBackendMode === "read-only"
          ? "Editorial writes are intentionally limited."
          : input.blockedCount > 0
            ? "Some content is blocked and needs attention."
            : "Editorial workflow is active and writable.",
      detail:
        input.cmsBackendMode === "read-only"
          ? "The launch view should keep highlighting that content review is visible, but not yet fully writable."
          : input.blockedCount > 0
            ? "Blocked items are part of safe publishing, but they should stay visible until resolved."
            : "Review, approval, rollback, and publish checks are all available through the current workflow path.",
      metricLabel: "Queued review",
      metricValue: String(input.queuedReviewCount),
    },
  ];

  const alerts: OperationsAlert[] = [];

  if (input.authMode === "preview-cookie") {
    alerts.push({
      alertId: "auth-preview-mode",
      severity: "warning",
      title: "Auth is still in preview mode",
      detail: "Preview-cookie mode keeps local development moving, but it should not be treated as the final live monitoring setup.",
      recommendedAction: "Switch launch environments onto the production identity path before final release checks.",
    });
  }

  if (input.persistenceDriver === "memory") {
    alerts.push({
      alertId: "persistence-memory-driver",
      severity: "critical",
      title: "Persistence is running in memory",
      detail: "A restart would wipe live continuity data, which makes this unsafe for real student use.",
      recommendedAction: "Use a durable persistence driver before launch testing continues.",
    });
  } else if (input.isPrototypePersistence) {
    alerts.push({
      alertId: "persistence-local-json",
      severity: "warning",
      title: "Persistence still needs backup and restore checks",
      detail: `Student data is currently tied to ${input.dataDirectory}, so recovery procedures should stay visible until the live data location is fully settled.`,
      recommendedAction: "Complete backup, restore, and operational recovery checks for the active data directory.",
    });
  }

  if (input.cmsBackendMode === "read-only") {
    alerts.push({
      alertId: "editorial-read-only",
      severity: "warning",
      title: "Editorial backend is read-only",
      detail: "Trust review is visible, but live content operations are still intentionally limited.",
      recommendedAction: "Connect the intended writable editorial path before final launch sign-off.",
    });
  }

  if (input.blockedCount > 0) {
    alerts.push({
      alertId: "editorial-blocked-items",
      severity: "warning",
      title: "Blocked editorial items need review",
      detail: `${input.blockedCount} content item${input.blockedCount === 1 ? "" : "s"} are blocked in the current workflow queue.`,
      recommendedAction: "Review blocked content before treating the visible catalog as fully settled.",
    });
  }

  if (
    input.totalSavedProgressRecords > 0 &&
    input.savedProgressWithSupportSnapshots < input.totalSavedProgressRecords
  ) {
    alerts.push({
      alertId: "saved-progress-support-gap",
      severity: "warning",
      title: "Some saved sessions are missing support snapshots",
      detail: "Support carry-over should stay visible in every saved session before launch confidence is treated as complete.",
      recommendedAction: "Check continuity records and confirm support snapshots remain attached across resume and review paths.",
    });
  }

  const performanceBudgets: OperationsPerformanceBudget[] = [
    {
      budgetId: "catalog-size",
      label: "Content load watch",
      status: input.contentTopicCount <= 30 ? "within-budget" : "watch",
      currentValue: `${input.contentTopicCount} topics`,
      targetValue: "30 topics or fewer in the current MVP scope",
      detail: "The content catalog is still small enough that route payload growth should stay manageable for this launch phase.",
    },
    {
      budgetId: "session-payloads",
      label: "Saved-session payload watch",
      status: input.totalSavedProgressRecords <= 250 ? "within-budget" : "watch",
      currentValue: `${input.totalSavedProgressRecords} saved records`,
      targetValue: "250 records or fewer before deeper storage review",
      detail: "This is a simple launch watch point to keep saved-session payload growth visible while the dataset is still small.",
    },
    {
      budgetId: "inventory-size",
      label: "Assessment inventory watch",
      status: input.assessmentCount + input.examPaperCount <= 25 ? "within-budget" : "watch",
      currentValue: `${input.assessmentCount + input.examPaperCount} live inventory items`,
      targetValue: "25 items or fewer in the current seeded launch scope",
      detail: "This keeps route rendering and seeded data growth visible while the product is still in launch preparation mode.",
    },
  ];

  const recoveryReadiness: OperationsRecoveryItem[] = [
    {
      itemId: "auth-recovery",
      label: "Account recovery path",
      status: input.allowRedirectSignIn ? "ready" : "watch",
      detail: input.allowRedirectSignIn
        ? "Redirect-based sign-in is available for launch-style account recovery."
        : "The current auth mode does not yet expose the intended redirect-based recovery path.",
    },
    {
      itemId: "data-recovery",
      label: "Data recovery path",
      status: input.persistenceDriver === "memory" ? "watch" : "ready",
      detail:
        input.persistenceDriver === "memory"
          ? "Memory mode is not durable enough for restart recovery."
          : `The active data path is ${input.dataDirectory}, so backup and restore checks can be run against one known location.`,
    },
    {
      itemId: "session-recovery",
      label: "Session continuity path",
      status: input.totalSavedProgressRecords > 0 ? "ready" : "watch",
      detail:
        input.totalSavedProgressRecords > 0
          ? "Saved session records exist for resume and review continuity checks."
          : "No saved-session evidence has been recorded yet in this runtime.",
    },
    {
      itemId: "editorial-recovery",
      label: "Editorial rollback path",
      status: input.cmsBackendMode === "live" ? "ready" : "watch",
      detail:
        input.cmsBackendMode === "live"
          ? `${input.rollbackCount} rollback event${input.rollbackCount === 1 ? "" : "s"} recorded so far in the workflow history.`
          : "Rollback intent is visible, but the current backend mode still limits full editorial recovery operations.",
    },
  ];

  const overallStatus: OperationsStatus = alerts.some((alert) => alert.severity === "critical")
    ? "critical"
    : alerts.length > 0
      ? "warning"
      : "healthy";

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    overallStatus,
    alertCount: alerts.length,
    domains,
    alerts,
    performanceBudgets,
    recoveryReadiness,
  };
}
