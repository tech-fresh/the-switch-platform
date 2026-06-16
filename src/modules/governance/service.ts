import { getPersistenceRuntimeConfig } from "../../lib/persistence/runtime.ts";
import {
  readLaunchGovernanceRecords,
  writeLaunchGovernanceRecords,
} from "../../lib/persistence/launch-governance-store.ts";
import { getCmsRuntimeConfig } from "../cms/runtime.ts";
import type {
  GovernanceCloseoutItem,
  GovernanceEvidenceRecord,
  GovernanceEnvironmentCheck,
  GovernanceFinalPathSummary,
  GovernanceFollowUpLoop,
  GovernanceOwnershipArea,
  GovernanceReviewRecord,
  GovernanceSignOffCheck,
  GovernanceSmokeCheck,
  GovernanceStatus,
  LaunchGovernanceOverview,
  StoredGovernanceEvidenceRecord,
  StoredGovernanceEnvironmentRecord,
  StoredGovernanceRecord,
  StoredGovernanceReviewRecord,
  StoredGovernanceSmokeRecord,
  StoredGovernanceSignOffRecord,
} from "./types";

interface GovernanceReviewDefinition {
  reviewId: string;
  title: string;
  owner: string;
  pendingNote: string;
}

interface GovernanceSignOffDefinition {
  checkId: string;
  label: string;
  owner: string;
  readyDetail: string;
  watchDetail: string;
  isRuntimeReady: (input: GovernanceRuntimeInput) => boolean;
}

interface GovernanceRuntimeEvidenceDefinition {
  evidenceId: string;
  title: string;
  area: GovernanceEvidenceRecord["area"];
  owner: string;
  buildRuntimeRecord: (input: GovernanceRuntimeInput) => GovernanceEvidenceRecord;
}

interface GovernanceRuntimeInput {
  authMode: string;
  authSecretConfigured: boolean;
  authBaseUrl: string | null;
  persistenceRuntime: ReturnType<typeof getPersistenceRuntimeConfig>;
  cmsRuntime: ReturnType<typeof getCmsRuntimeConfig>;
  configuredOidcProviderCount: number;
}

const reviewDefinitions: GovernanceReviewDefinition[] = [
  {
    reviewId: "privacy-retention-review",
    title: "Privacy and retention review",
    owner: "Student data lead",
    pendingNote:
      "Record the final privacy and retention review once the live data location, sign-in boundary, and retention handling have been checked together.",
  },
  {
    reviewId: "safeguarding-signposting-review",
    title: "Safeguarding and support review",
    owner: "Student support lead",
    pendingNote:
      "Record the safeguarding review once urgent-help signposting, support boundaries, and student-facing wording have been checked in the target environment.",
  },
  {
    reviewId: "release-approval-review",
    title: "Release approval path",
    owner: "Launch manager",
    pendingNote:
      "Record the release approval review once the final launch authority, stop-release authority, and environment-specific approval path are confirmed.",
  },
];

const ownership: GovernanceOwnershipArea[] = [
  {
    areaId: "engineering-operations",
    area: "Engineering operations",
    primaryOwner: "Platform lead",
    backupOwner: "Release manager",
    responsibility: "Owns deploy safety, incident handling, monitoring follow-up, and runtime recovery checks.",
  },
  {
    areaId: "editorial-operations",
    area: "Editorial operations",
    primaryOwner: "Editorial lead",
    backupOwner: "Content operations manager",
    responsibility: "Owns review, fact-check, publish approval, rollback decisions, and blocked-content handling.",
  },
  {
    areaId: "student-data-support",
    area: "Student data support",
    primaryOwner: "Student data lead",
    backupOwner: "Support operations lead",
    responsibility: "Owns account-linked data questions, privacy handling, retention follow-up, and access-related requests.",
  },
  {
    areaId: "safeguarding-support",
    area: "Safeguarding and support",
    primaryOwner: "Student support lead",
    backupOwner: "Safeguarding contact",
    responsibility: "Owns support signposting quality, age-appropriate language, and urgent-help route review.",
  },
];

const smokeDefinitions: Array<{
  checkId: string;
  route: string;
  note: string;
}> = [
  {
    checkId: "smoke-dashboard",
    route: "/dashboard",
    note: "Dashboard launch cards, continuity links, and next-step guidance load in a stable way.",
  },
  {
    checkId: "smoke-subjects",
    route: "/subjects",
    note: "Subject navigation, topic visibility, and learning route entry points remain student-safe.",
  },
  {
    checkId: "smoke-assessments",
    route: "/assessments",
    note: "Timed assessment entry, save, resume, submit, and review behaviour can be checked end to end.",
  },
  {
    checkId: "smoke-exams",
    route: "/exams",
    note: "Exam loading, recovery handling, autosave, and result reopen paths are part of the launch smoke pass.",
  },
  {
    checkId: "smoke-saved-results",
    route: "/saved-progress + /results",
    note: "Resume-ready and review-ready records can be checked together through the continuity surfaces.",
  },
  {
    checkId: "smoke-account-admin",
    route: "/account + /admin",
    note: "Signed-in access, route protection, operations visibility, and editorial controls are part of the final launch walk-through.",
  },
];

const signOffDefinitions: GovernanceSignOffDefinition[] = [
  {
    checkId: "signoff-privacy-retention",
    label: "Privacy and retention sign-off",
    owner: "Student data lead",
    readyDetail:
      "Account, session, and saved-progress handling now sit behind a live-style sign-in boundary with a configured secret.",
    watchDetail:
      "Privacy and retention sign-off should stay open until the live sign-in boundary is fully configured and the approval is recorded.",
    isRuntimeReady: (input) => input.authMode !== "preview-cookie" && input.authSecretConfigured,
  },
  {
    checkId: "signoff-safeguarding-support",
    label: "Safeguarding and support sign-off",
    owner: "Student support lead",
    readyDetail:
      "Support remains signposting-only, urgent help stays visible, and the wording is kept inside a named safeguarding review path.",
    watchDetail:
      "Safeguarding and support sign-off still needs a named reviewer, environment, and recorded approval note.",
    isRuntimeReady: () => true,
  },
  {
    checkId: "signoff-alerts-recovery",
    label: "Alerts and recovery sign-off",
    owner: "Platform lead",
    readyDetail:
      "Auth, persistence, saved-session continuity, and editorial watch points now have visible operational checks.",
    watchDetail:
      "This sign-off should stay open until live auth, recovery coverage, and the recorded approval are all in place.",
    isRuntimeReady: (input) =>
      input.authMode !== "preview-cookie" &&
      input.authSecretConfigured &&
      input.persistenceRuntime.driver !== "memory",
  },
  {
    checkId: "signoff-incident-ownership",
    label: "Incident ownership sign-off",
    owner: "Release manager",
    readyDetail:
      "Primary and backup owners are named for engineering operations, editorial operations, student data support, and safeguarding support.",
    watchDetail:
      "Incident ownership sign-off still needs a recorded approval note tied to the target environment.",
    isRuntimeReady: () => true,
  },
  {
    checkId: "signoff-release-approval",
    label: "Final release approval sign-off",
    owner: "Launch manager",
    readyDetail:
      "The release path now has its core trust, runtime, and ownership checks in place for final approval.",
    watchDetail:
      "Final release approval should stay open until the live student-data location, environment proof, and recorded approval are all settled.",
    isRuntimeReady: (input) =>
      input.authMode !== "preview-cookie" &&
      input.authSecretConfigured &&
      input.cmsRuntime.backendMode === "live" &&
      !input.persistenceRuntime.isPrototypePersistence &&
      input.persistenceRuntime.driver !== "memory",
  },
];

const runtimeEvidenceDefinitions: GovernanceRuntimeEvidenceDefinition[] = [
  {
    evidenceId: "evidence-auth-runtime",
    title: "Auth runtime evidence",
    area: "auth",
    owner: "Platform lead",
    buildRuntimeRecord: (input) => ({
      evidenceId: "evidence-auth-runtime",
      title: "Auth runtime evidence",
      area: "auth",
      status:
        input.authMode !== "preview-cookie" && input.authSecretConfigured
          ? "recorded"
          : "still-needed",
      recordedAt:
        input.authMode !== "preview-cookie" && input.authSecretConfigured ? todayDate() : null,
      owner: "Platform lead",
      summary:
        input.authMode !== "preview-cookie" && input.authSecretConfigured
          ? `The runtime resolves sign-in through ${input.authMode} with a configured sign-in secret.`
          : "The runtime still needs a fully recorded live sign-in boundary before final launch proof is complete.",
      environment: null,
      source:
        input.authMode !== "preview-cookie" && input.authSecretConfigured ? "runtime" : "seeded",
    }),
  },
  {
    evidenceId: "evidence-auth-provider",
    title: "Configured provider evidence",
    area: "auth",
    owner: "Platform lead",
    buildRuntimeRecord: (input) => ({
      evidenceId: "evidence-auth-provider",
      title: "Configured provider evidence",
      area: "auth",
      status:
        input.authMode === "oidc" && input.configuredOidcProviderCount > 0
          ? "recorded"
          : input.authMode === "external-header"
            ? "recorded"
            : "still-needed",
      recordedAt:
        (input.authMode === "oidc" && input.configuredOidcProviderCount > 0) ||
        input.authMode === "external-header"
          ? todayDate()
          : null,
      owner: "Platform lead",
      summary:
        input.authMode === "oidc" && input.configuredOidcProviderCount > 0
          ? `${input.configuredOidcProviderCount} production sign-in provider configuration${input.configuredOidcProviderCount === 1 ? "" : "s"} are present in the runtime.`
          : input.authMode === "external-header"
            ? "This runtime records that a trusted upstream identity layer is expected to manage sign-in."
            : "A full live sign-in provider configuration still needs to be recorded for the runtime.",
      environment: null,
      source:
        (input.authMode === "oidc" && input.configuredOidcProviderCount > 0) ||
        input.authMode === "external-header"
          ? "runtime"
          : "seeded",
    }),
  },
  {
    evidenceId: "evidence-persistence-sqlite",
    title: "Shared student-data path evidence",
    area: "persistence",
    owner: "Student data lead",
    buildRuntimeRecord: (input) => {
      const sqliteReady =
        input.persistenceRuntime.driver === "sqlite" &&
        !input.persistenceRuntime.isPrototypePersistence;

      return {
        evidenceId: "evidence-persistence-sqlite",
        title: "Shared student-data path evidence",
        area: "persistence",
        status: sqliteReady ? "recorded" : "still-needed",
        recordedAt: sqliteReady ? todayDate() : null,
        owner: "Student data lead",
        summary: sqliteReady
          ? `The codebase now supports the shared SQLite live data path at ${input.persistenceRuntime.primaryStorePath}.`
          : "The shared SQLite live data path still needs to be the active runtime path before final launch proof is complete.",
        environment: null,
        source: sqliteReady ? "runtime" : "seeded",
      };
    },
  },
  {
    evidenceId: "evidence-persistence-recovery",
    title: "Backup and restore evidence",
    area: "persistence",
    owner: "Student data lead",
    buildRuntimeRecord: (input) => {
      const sqliteReady =
        input.persistenceRuntime.driver === "sqlite" &&
        !input.persistenceRuntime.isPrototypePersistence;

      return {
        evidenceId: "evidence-persistence-recovery",
        title: "Backup and restore evidence",
        area: "persistence",
        status: sqliteReady ? "recorded" : "still-needed",
        recordedAt: sqliteReady ? todayDate() : null,
        owner: "Student data lead",
        summary: sqliteReady
          ? "Migration, restore, and recovery-check tooling now exist for the shared student-data path in the codebase."
          : "Backup, restore, and recovery evidence still needs to be attached to the final live student-data setup.",
        environment: null,
        source: sqliteReady ? "runtime" : "seeded",
      };
    },
  },
  {
    evidenceId: "evidence-editorial-path",
    title: "Editorial operating-path evidence",
    area: "editorial",
    owner: "Editorial lead",
    buildRuntimeRecord: (input) => ({
      evidenceId: "evidence-editorial-path",
      title: "Editorial operating-path evidence",
      area: "editorial",
      status: input.cmsRuntime.backendMode === "live" ? "recorded" : "still-needed",
      recordedAt: input.cmsRuntime.backendMode === "live" ? todayDate() : null,
      owner: "Editorial lead",
      summary:
        input.cmsRuntime.backendMode === "live"
          ? "Reviewed content, managed content sources, controlled imports, and paper updates now sit inside one writable editorial control path."
          : "Editorial publishing is still blocked by read-only mode in this runtime.",
      environment: null,
      source: input.cmsRuntime.backendMode === "live" ? "runtime" : "seeded",
    }),
  },
  {
    evidenceId: "evidence-environment-base-url",
    title: "Live environment callback evidence",
    area: "environment",
    owner: "Release manager",
    buildRuntimeRecord: (input) => ({
      evidenceId: "evidence-environment-base-url",
      title: "Live environment callback evidence",
      area: "environment",
      status:
        input.authMode === "oidc" && input.authBaseUrl
          ? "recorded"
          : input.authMode !== "oidc"
            ? "recorded"
            : "still-needed",
      recordedAt:
        (input.authMode === "oidc" && input.authBaseUrl) || input.authMode !== "oidc"
          ? todayDate()
          : null,
      owner: "Release manager",
      summary:
        input.authMode === "oidc" && input.authBaseUrl
          ? `The public sign-in callback address is recorded as ${input.authBaseUrl}.`
          : input.authMode !== "oidc"
            ? "This runtime does not depend on a redirect callback address."
            : "The public sign-in callback address still needs to be recorded for the live environment.",
      environment: null,
      source:
        (input.authMode === "oidc" && input.authBaseUrl) || input.authMode !== "oidc"
          ? "runtime"
          : "seeded",
    }),
  },
  {
    evidenceId: "evidence-smoke-rehearsal",
    title: "Local launch rehearsal evidence",
    area: "smoke",
    owner: "Release manager",
    buildRuntimeRecord: () => ({
      evidenceId: "evidence-smoke-rehearsal",
      title: "Local launch rehearsal evidence",
      area: "smoke",
      status: "recorded",
      recordedAt: todayDate(),
      owner: "Release manager",
      summary:
        "The repo now records local smoke, end-to-end, final-route rehearsal, and release verification checks separately from live launch proof.",
      environment: null,
      source: "runtime",
    }),
  },
  {
    evidenceId: "evidence-final-live-proof",
    title: "Final live launch proof",
    area: "signoff",
    owner: "Launch manager",
    buildRuntimeRecord: () => ({
      evidenceId: "evidence-final-live-proof",
      title: "Final live launch proof",
      area: "signoff",
      status: "still-needed",
      recordedAt: null,
      owner: "Launch manager",
      summary:
        "The final live route walk-through, real environment proof, and final release sign-off still need to be recorded before launch can be called complete.",
      environment: null,
      source: "seeded",
    }),
  },
];

const followUpLoops: GovernanceFollowUpLoop[] = [
  {
    loopId: "incident-review",
    title: "Incident review loop",
    cadence: "After every incident and weekly during launch",
    owner: "Platform lead",
    purpose: "Make sure production issues turn into concrete fixes, clearer alerts, and safer recovery steps.",
  },
  {
    loopId: "content-correction-review",
    title: "Content correction loop",
    cadence: "Weekly",
    owner: "Editorial lead",
    purpose: "Track blocked items, corrections, and source-quality concerns after launch.",
  },
  {
    loopId: "learner-trust-review",
    title: "Learner trust review",
    cadence: "Every two weeks",
    owner: "Student support lead",
    purpose: "Review support wording, safeguarding signals, and confusing student-facing moments before they drift.",
  },
];

const finalPathSummary: GovernanceFinalPathSummary = buildFinalPathSummary();
const knownReviewIds = new Set(reviewDefinitions.map((definition) => definition.reviewId));
const knownSignOffIds = new Set(signOffDefinitions.map((definition) => definition.checkId));
const knownEvidenceIds = new Set(runtimeEvidenceDefinitions.map((definition) => definition.evidenceId));
const knownEnvironmentCheckIds = new Set([
  "environment-auth-mode",
  "environment-auth-secret",
  "environment-auth-base-url",
  "environment-auth-provider",
  "environment-persistence-path",
  "environment-cms-mode",
]);
const knownSmokeCheckIds = new Set(smokeDefinitions.map((definition) => definition.checkId));

export async function getLaunchGovernanceOverview(): Promise<LaunchGovernanceOverview> {
  const runtimeInput = getGovernanceRuntimeInput();
  const storedRecords = await readLaunchGovernanceRecords();
  const reviews = buildReviews(storedRecords);
  const smokeChecks = buildSmokeChecks(storedRecords);
  const environmentChecks = buildEnvironmentChecks(storedRecords, runtimeInput);
  const signOffChecks = buildSignOffChecks(storedRecords, runtimeInput);
  const evidenceRecords = buildEvidenceRecords(storedRecords, runtimeInput);

  return {
    overallStatus:
      smokeChecks.every((check) => check.status === "ready") &&
      environmentChecks.every((check) => check.status === "ready") &&
      signOffChecks.every((check) => check.status === "ready")
        ? "ready"
        : "watch",
    reviews,
    ownership,
    smokeChecks,
    environmentChecks,
    signOffChecks,
    evidenceRecords,
    followUpLoops,
    finalPathSummary,
  };
}

export async function recordLaunchGovernanceReview(input: {
  reviewId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt?: string;
}): Promise<void> {
  await upsertGovernanceRecord({
    kind: "review",
    targetId: input.reviewId,
    status: input.status,
    owner: input.owner,
    note: input.note,
    environment: input.environment,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  });
}

export async function recordLaunchGovernanceSignOff(input: {
  checkId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt?: string;
}): Promise<void> {
  await upsertGovernanceRecord({
    kind: "signoff",
    targetId: input.checkId,
    status: input.status,
    owner: input.owner,
    note: input.note,
    environment: input.environment,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  });
}

export async function recordLaunchGovernanceEvidence(input: {
  evidenceId: string;
  status: "recorded" | "still-needed";
  owner: string;
  summary: string;
  environment: string;
  recordedAt?: string;
}): Promise<void> {
  await upsertGovernanceRecord({
    kind: "evidence",
    targetId: input.evidenceId,
    status: input.status,
    owner: input.owner,
    summary: input.summary,
    environment: input.environment,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  });
}

export async function recordLaunchGovernanceEnvironmentCheck(input: {
  checkId: string;
  status: GovernanceStatus;
  owner: string;
  detail: string;
  environment: string;
  recordedAt?: string;
}): Promise<void> {
  await upsertGovernanceRecord({
    kind: "environment",
    targetId: input.checkId,
    status: input.status,
    owner: input.owner,
    detail: input.detail,
    environment: input.environment,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  });
}

export async function recordLaunchGovernanceSmokeCheck(input: {
  checkId: string;
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
  recordedAt?: string;
}): Promise<void> {
  await upsertGovernanceRecord({
    kind: "smoke",
    targetId: input.checkId,
    status: input.status,
    owner: input.owner,
    note: input.note,
    environment: input.environment,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  });
}

function getGovernanceRuntimeInput(): GovernanceRuntimeInput {
  return {
    authMode: (process.env.SWITCH_AUTH_MODE ?? "oidc").trim(),
    authSecretConfigured: Boolean(process.env.SWITCH_AUTH_SECRET?.trim()),
    authBaseUrl: process.env.SWITCH_AUTH_BASE_URL?.trim() ?? null,
    persistenceRuntime: getPersistenceRuntimeConfig(),
    cmsRuntime: getCmsRuntimeConfig(),
    configuredOidcProviderCount: getConfiguredOidcProviderCount(),
  };
}

function buildReviews(storedRecords: StoredGovernanceRecord[]): GovernanceReviewRecord[] {
  return reviewDefinitions.map((definition) => {
    const storedRecord = getLatestStoredReviewRecord(storedRecords, definition.reviewId);

    if (!storedRecord || storedRecord.status !== "ready") {
      return {
        reviewId: definition.reviewId,
        title: definition.title,
        status: "watch",
        completedAt: storedRecord?.recordedAt.slice(0, 10) ?? null,
        owner: storedRecord?.owner ?? definition.owner,
        note: storedRecord?.note ?? definition.pendingNote,
        environment: storedRecord?.environment ?? null,
        source: storedRecord ? "manual" : "seeded",
      };
    }

    return {
      reviewId: definition.reviewId,
      title: definition.title,
      status: "ready",
      completedAt: storedRecord.recordedAt.slice(0, 10),
      owner: storedRecord.owner,
      note: storedRecord.note,
      environment: storedRecord.environment,
      source: "manual",
    };
  });
}

function buildEnvironmentChecks(
  storedRecords: StoredGovernanceRecord[],
  input: GovernanceRuntimeInput,
): GovernanceEnvironmentCheck[] {
  const runtimeChecks: GovernanceEnvironmentCheck[] = [
    {
      checkId: "environment-auth-mode",
      label: "Live sign-in mode",
      status: input.authMode === "preview-cookie" ? "watch" : "ready",
      detail:
        input.authMode === "preview-cookie"
          ? "This runtime still points at preview sign-in, so it is not a true live launch setup yet."
          : `This runtime resolves sign-in through ${input.authMode}.`,
      owner: null,
      recordedAt: null,
      environment: null,
      source: input.authMode === "preview-cookie" ? "seeded" : "runtime",
    },
    {
      checkId: "environment-auth-secret",
      label: "Sign-in secret",
      status: input.authSecretConfigured ? "ready" : "watch",
      detail: input.authSecretConfigured
        ? "The sign-in boundary has its own configured secret."
        : "A live sign-in secret still needs to be configured for this environment.",
      owner: null,
      recordedAt: null,
      environment: null,
      source: input.authSecretConfigured ? "runtime" : "seeded",
    },
    {
      checkId: "environment-auth-base-url",
      label: "Public sign-in address",
      status: input.authMode === "oidc" ? (input.authBaseUrl ? "ready" : "watch") : "ready",
      detail:
        input.authMode === "oidc"
          ? input.authBaseUrl
            ? `The sign-in callback base URL is set to ${input.authBaseUrl}.`
            : "A public sign-in callback address still needs to be set for redirect-based live sign-in."
          : "This environment does not depend on a redirect callback address.",
      owner: null,
      recordedAt: null,
      environment: null,
      source: input.authMode !== "oidc" || input.authBaseUrl ? "runtime" : "seeded",
    },
    {
      checkId: "environment-auth-provider",
      label: "Configured sign-in providers",
      status:
        input.authMode === "oidc"
          ? input.configuredOidcProviderCount > 0
            ? "ready"
            : "watch"
          : "ready",
      detail:
        input.authMode === "oidc"
          ? input.configuredOidcProviderCount > 0
            ? `${input.configuredOidcProviderCount} live sign-in provider configuration${input.configuredOidcProviderCount === 1 ? "" : "s"} are present.`
            : "At least one full live sign-in provider configuration still needs to be added."
          : "Provider configuration is handled outside this runtime mode.",
      owner: null,
      recordedAt: null,
      environment: null,
      source:
        input.authMode !== "oidc" || input.configuredOidcProviderCount > 0
          ? "runtime"
          : "seeded",
    },
    {
      checkId: "environment-persistence-path",
      label: "Student data location",
      status:
        input.persistenceRuntime.driver === "memory" || input.persistenceRuntime.isPrototypePersistence
          ? "watch"
          : "ready",
      detail:
        input.persistenceRuntime.driver === "memory"
          ? "This runtime would lose student data on restart."
          : input.persistenceRuntime.isPrototypePersistence
            ? `Student data is still using the local default path at ${input.persistenceRuntime.dataDirectory}.`
            : `Student data is pointed at the explicit runtime path ${input.persistenceRuntime.dataDirectory}.`,
      owner: null,
      recordedAt: null,
      environment: null,
      source:
        input.persistenceRuntime.driver === "memory" || input.persistenceRuntime.isPrototypePersistence
          ? "seeded"
          : "runtime",
    },
    {
      checkId: "environment-cms-mode",
      label: "Editorial mode",
      status: input.cmsRuntime.backendMode === "live" ? "ready" : "watch",
      detail:
        input.cmsRuntime.backendMode === "live"
          ? "Editorial work is enabled through the live writable workflow."
          : "Editorial work is still running in read-only mode.",
      owner: null,
      recordedAt: null,
      environment: null,
      source: input.cmsRuntime.backendMode === "live" ? "runtime" : "seeded",
    },
  ];

  return runtimeChecks.map((check) => {
    const storedRecord = getLatestStoredEnvironmentRecord(storedRecords, check.checkId);

    if (!storedRecord) {
      return check;
    }

    return {
      ...check,
      status: storedRecord.status,
      detail: storedRecord.detail,
      owner: storedRecord.owner,
      recordedAt: storedRecord.recordedAt,
      environment: storedRecord.environment,
      source: "manual",
    };
  });
}

function buildSmokeChecks(storedRecords: StoredGovernanceRecord[]): GovernanceSmokeCheck[] {
  return smokeDefinitions.map((definition) => {
    const storedRecord = getLatestStoredSmokeRecord(storedRecords, definition.checkId);

    if (!storedRecord) {
      return {
        checkId: definition.checkId,
        route: definition.route,
        status: "watch",
        note: `This route still needs a recorded final walk-through result. ${definition.note}`,
        owner: null,
        recordedAt: null,
        environment: null,
        source: "seeded",
      };
    }

    return {
      checkId: definition.checkId,
      route: definition.route,
      status: storedRecord.status,
      note: storedRecord.note,
      owner: storedRecord.owner,
      recordedAt: storedRecord.recordedAt,
      environment: storedRecord.environment,
      source: "manual",
    };
  });
}

function buildSignOffChecks(
  storedRecords: StoredGovernanceRecord[],
  input: GovernanceRuntimeInput,
): GovernanceSignOffCheck[] {
  return signOffDefinitions.map((definition) => {
    const storedRecord = getLatestStoredSignOffRecord(storedRecords, definition.checkId);
    const runtimeReady = definition.isRuntimeReady(input);
    const hasRecordedApproval = storedRecord?.status === "ready";

    return {
      checkId: definition.checkId,
      label: definition.label,
      status: runtimeReady && hasRecordedApproval ? "ready" : "watch",
      owner: storedRecord?.owner ?? definition.owner,
      detail:
        runtimeReady && hasRecordedApproval
          ? storedRecord.note
          : runtimeReady
            ? `Runtime prerequisites look ready, but the final approval still needs to be recorded. ${definition.readyDetail}`
            : storedRecord?.note ?? definition.watchDetail,
      recordedAt: storedRecord?.recordedAt ?? null,
      environment: storedRecord?.environment ?? null,
      source: storedRecord ? "manual" : runtimeReady ? "runtime" : "seeded",
    };
  });
}

function buildEvidenceRecords(
  storedRecords: StoredGovernanceRecord[],
  input: GovernanceRuntimeInput,
): GovernanceEvidenceRecord[] {
  return runtimeEvidenceDefinitions.map((definition) => {
    const storedRecord = getLatestStoredEvidenceRecord(storedRecords, definition.evidenceId);

    if (!storedRecord) {
      return definition.buildRuntimeRecord(input);
    }

    return {
      evidenceId: definition.evidenceId,
      title: definition.title,
      area: definition.area,
      status: storedRecord.status,
      recordedAt: storedRecord.recordedAt,
      owner: storedRecord.owner,
      summary: storedRecord.summary,
      environment: storedRecord.environment,
      source: "manual",
    };
  });
}

async function upsertGovernanceRecord(record: StoredGovernanceRecord): Promise<void> {
  const owner = record.owner.trim();
  const environment = record.environment.trim();

  assertKnownGovernanceTarget(record);

  if (!owner) {
    throw new Error("owner is required for launch governance records.");
  }

  if (!environment) {
    throw new Error("environment is required for launch governance records.");
  }

  if (record.kind === "evidence") {
    if (!record.summary.trim()) {
      throw new Error("summary is required for launch governance evidence.");
    }
  } else if (record.kind === "environment") {
    if (!record.detail.trim()) {
      throw new Error("detail is required for launch governance environment checks.");
    }
  } else if (record.kind === "smoke") {
    if (!record.note.trim()) {
      throw new Error("note is required for launch governance smoke checks.");
    }
  } else if (!record.note.trim()) {
    throw new Error("note is required for launch governance approvals.");
  }

  const existingRecords = await readLaunchGovernanceRecords();
  const nextRecord = sanitizeStoredRecord(record);
  const nextRecords = existingRecords
    .filter(
      (existingRecord) =>
        !(existingRecord.kind === nextRecord.kind && existingRecord.targetId === nextRecord.targetId),
    )
    .concat(nextRecord)
    .sort((left, right) => left.kind.localeCompare(right.kind) || left.targetId.localeCompare(right.targetId));

  await writeLaunchGovernanceRecords(nextRecords);
}

function assertKnownGovernanceTarget(record: StoredGovernanceRecord): void {
  if (record.kind === "review" && !knownReviewIds.has(record.targetId)) {
    throw new Error(`Unknown launch governance review target: ${record.targetId}.`);
  }

  if (record.kind === "signoff" && !knownSignOffIds.has(record.targetId)) {
    throw new Error(`Unknown launch governance sign-off target: ${record.targetId}.`);
  }

  if (record.kind === "evidence" && !knownEvidenceIds.has(record.targetId)) {
    throw new Error(`Unknown launch governance evidence target: ${record.targetId}.`);
  }

  if (record.kind === "environment" && !knownEnvironmentCheckIds.has(record.targetId)) {
    throw new Error(`Unknown launch governance environment target: ${record.targetId}.`);
  }

  if (record.kind === "smoke" && !knownSmokeCheckIds.has(record.targetId)) {
    throw new Error(`Unknown launch governance smoke target: ${record.targetId}.`);
  }
}

function sanitizeStoredRecord(record: StoredGovernanceRecord): StoredGovernanceRecord {
  if (record.kind === "evidence") {
    return {
      ...record,
      owner: record.owner.trim(),
      environment: record.environment.trim(),
      summary: record.summary.trim(),
    };
  }

  if (record.kind === "environment") {
    return {
      ...record,
      owner: record.owner.trim(),
      environment: record.environment.trim(),
      detail: record.detail.trim(),
    };
  }

  if (record.kind === "smoke") {
    return {
      ...record,
      owner: record.owner.trim(),
      environment: record.environment.trim(),
      note: record.note.trim(),
    };
  }

  return {
    ...record,
    owner: record.owner.trim(),
    environment: record.environment.trim(),
    note: record.note.trim(),
  };
}

function getLatestStoredReviewRecord(
  storedRecords: StoredGovernanceRecord[],
  reviewId: string,
): StoredGovernanceReviewRecord | null {
  return (
    storedRecords.find(
      (record): record is StoredGovernanceReviewRecord =>
        record.kind === "review" && record.targetId === reviewId,
    ) ?? null
  );
}

function getLatestStoredSignOffRecord(
  storedRecords: StoredGovernanceRecord[],
  checkId: string,
): StoredGovernanceSignOffRecord | null {
  return (
    storedRecords.find(
      (record): record is StoredGovernanceSignOffRecord =>
        record.kind === "signoff" && record.targetId === checkId,
    ) ?? null
  );
}

function getLatestStoredEvidenceRecord(
  storedRecords: StoredGovernanceRecord[],
  evidenceId: string,
): StoredGovernanceEvidenceRecord | null {
  return (
    storedRecords.find(
      (record): record is StoredGovernanceEvidenceRecord =>
        record.kind === "evidence" && record.targetId === evidenceId,
    ) ?? null
  );
}

function getLatestStoredEnvironmentRecord(
  storedRecords: StoredGovernanceRecord[],
  checkId: string,
): StoredGovernanceEnvironmentRecord | null {
  return (
    storedRecords.find(
      (record): record is StoredGovernanceEnvironmentRecord =>
        record.kind === "environment" && record.targetId === checkId,
    ) ?? null
  );
}

function getLatestStoredSmokeRecord(
  storedRecords: StoredGovernanceRecord[],
  checkId: string,
): StoredGovernanceSmokeRecord | null {
  return (
    storedRecords.find(
      (record): record is StoredGovernanceSmokeRecord =>
        record.kind === "smoke" && record.targetId === checkId,
    ) ?? null
  );
}

function getConfiguredOidcProviderCount(): number {
  return ["EMAIL_MAGIC_LINK", "GOOGLE", "APPLE"].filter((prefix) =>
    [
      process.env[`SWITCH_OIDC_${prefix}_CLIENT_ID`]?.trim(),
      process.env[`SWITCH_OIDC_${prefix}_CLIENT_SECRET`]?.trim(),
      process.env[`SWITCH_OIDC_${prefix}_AUTHORIZATION_URL`]?.trim(),
      process.env[`SWITCH_OIDC_${prefix}_TOKEN_URL`]?.trim(),
      process.env[`SWITCH_OIDC_${prefix}_USERINFO_URL`]?.trim(),
    ].every(Boolean),
  ).length;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildFinalPathSummary(): GovernanceFinalPathSummary {
  const closeoutItems: GovernanceCloseoutItem[] = [
    {
      itemId: "closeout-auth-default",
      status: "done",
      title: "Real sign-in is now the default direction",
      detail: "Preview sign-in is no longer the default runtime path, so the codebase now points toward live auth rather than a launch-only preview shortcut.",
    },
    {
      itemId: "closeout-auth-secret",
      status: "done",
      title: "Unsafe preview-secret fallback is removed for live modes",
      detail: "Non-preview auth modes no longer quietly fall back to the preview secret when the live secret is missing.",
    },
    {
      itemId: "closeout-persistence",
      status: "done",
      title: "Student data now has the intended shared live data setup in the codebase",
      detail: "Saved progress, results, sessions, learner settings, migration tooling, restore tooling, and recovery checks now support the shared SQLite live data path in the codebase. The remaining step is proving that path in the real deployed environment.",
    },
    {
      itemId: "closeout-editorial",
      status: "done",
      title: "Editorial work is writable in the runtime",
      detail: "Review, approval, and publish controls are now available through the writable editorial workflow path in the current runtime.",
    },
    {
      itemId: "closeout-content-path",
      status: "done",
      title: "Content operations are described as a real operating path",
      detail: "The codebase now treats reviewed content, managed content sources, controlled imports, and paper-source updates as one real operating path under shared editorial controls rather than a future placeholder path.",
    },
    {
      itemId: "closeout-verification-noise",
      status: "done",
      title: "Verification output is cleaner",
      detail: "The avoidable module-format warning noise has been cleaned up so routine verification is easier to trust.",
    },
    {
      itemId: "closeout-automation",
      status: "done",
      title: "Launch checking is more automated",
      detail: "The repo now has lint, build, test, smoke, end-to-end, and release verification scripts instead of relying only on manual command runs.",
    },
    {
      itemId: "closeout-live-environment",
      status: "remaining",
      title: "The real live environment still needs proof outside local development",
      detail: "The deployed environment still needs final confirmation for secrets, domains, callbacks, persistence paths, and role-protected routes.",
    },
    {
      itemId: "closeout-live-walkthrough",
      status: "remaining",
      title: "The final live route walk-through still needs to be recorded",
      detail: "Dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin still need one final recorded pass in the real environment.",
    },
    {
      itemId: "closeout-live-signoff",
      status: "remaining",
      title: "The final trust and release sign-off still needs live evidence",
      detail: "Privacy, safeguarding, ownership, alerting, and release approval still need the final live-environment proof record.",
    },
  ];
  const codeCompleteCount = closeoutItems.filter((item) => item.status === "done").length;

  return {
    label: "Final Path Mark 1",
    codeCompleteCount,
    totalCount: closeoutItems.length,
    estimatedCompletionRange: "88% to 90%",
    note:
      "The platform is strong and near-launch, but it is not yet a true no-prototype full-production release. The remaining gap is mostly live setup, live proof, and final launch approval.",
    biggestBlockers: [
      "The repo now has live-proof automation, but the deployed sign-in path still needs a real run with live credentials and callbacks.",
      "The shared live student-data path is implemented in code, but it still needs final proof in the real deployed environment.",
      "The final live environment proof, walkthrough record, and release sign-off are still open in the target environment.",
    ],
    closeoutItems,
  };
}
