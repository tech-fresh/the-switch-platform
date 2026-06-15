import type {
  GovernanceEnvironmentCheck,
  GovernanceFollowUpLoop,
  GovernanceOwnershipArea,
  GovernanceReviewRecord,
  GovernanceSignOffCheck,
  GovernanceSmokeCheck,
  LaunchGovernanceOverview,
} from "./types";
import { getPersistenceRuntimeConfig } from "../../lib/persistence/runtime.ts";
import { getCmsRuntimeConfig } from "../cms/runtime.ts";

const configuredOidcProviders = ["EMAIL_MAGIC_LINK", "GOOGLE", "APPLE"].filter((prefix) =>
  [
    process.env[`SWITCH_OIDC_${prefix}_CLIENT_ID`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_CLIENT_SECRET`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_AUTHORIZATION_URL`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_TOKEN_URL`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_USERINFO_URL`]?.trim(),
  ].every(Boolean),
);

const reviews: GovernanceReviewRecord[] = [
  {
    reviewId: "privacy-retention-review",
    title: "Privacy and retention review",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Student data lead",
    note: "Student account, saved progress, support settings, and editorial data all have a clear retention and handling summary for launch.",
  },
  {
    reviewId: "safeguarding-signposting-review",
    title: "Safeguarding and support review",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Student support lead",
    note: "Support routes stay signposting-only and keep urgent help visible without pretending to provide counselling.",
  },
  {
    reviewId: "release-approval-review",
    title: "Release approval path",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Launch manager",
    note: "Engineering, editorial, and student support approval points are now named before the final release step.",
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

const smokeChecks: GovernanceSmokeCheck[] = [
  {
    checkId: "smoke-dashboard",
    route: "/dashboard",
    status: "ready",
    note: "Dashboard launch cards, continuity links, and next-step guidance load in a stable way.",
  },
  {
    checkId: "smoke-subjects",
    route: "/subjects",
    status: "ready",
    note: "Subject navigation, topic visibility, and learning route entry points remain student-safe.",
  },
  {
    checkId: "smoke-assessments",
    route: "/assessments",
    status: "ready",
    note: "Timed assessment entry, save, resume, submit, and review behaviour can be checked end to end.",
  },
  {
    checkId: "smoke-exams",
    route: "/exams",
    status: "ready",
    note: "Exam loading, recovery handling, autosave, and result reopen paths are part of the launch smoke pass.",
  },
  {
    checkId: "smoke-saved-results",
    route: "/saved-progress + /results",
    status: "ready",
    note: "Resume-ready and review-ready records can be checked together through the continuity surfaces.",
  },
  {
    checkId: "smoke-account-admin",
    route: "/account + /admin",
    status: "ready",
    note: "Signed-in access, route protection, operations visibility, and editorial controls are part of the final launch walk-through.",
  },
];

const environmentChecks: GovernanceEnvironmentCheck[] = buildEnvironmentChecks();
const signOffChecks: GovernanceSignOffCheck[] = buildSignOffChecks();

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

export function getLaunchGovernanceOverview(): LaunchGovernanceOverview {
  return {
    overallStatus:
      environmentChecks.every((check) => check.status === "ready") &&
      signOffChecks.every((check) => check.status === "ready")
        ? "ready"
        : "watch",
    reviews,
    ownership,
    smokeChecks,
    environmentChecks,
    signOffChecks,
    followUpLoops,
  };
}

function buildEnvironmentChecks(): GovernanceEnvironmentCheck[] {
  const authMode = (process.env.SWITCH_AUTH_MODE ?? "oidc").trim();
  const authSecretConfigured = Boolean(process.env.SWITCH_AUTH_SECRET?.trim());
  const authBaseUrl = process.env.SWITCH_AUTH_BASE_URL?.trim();
  const persistenceRuntime = getPersistenceRuntimeConfig();
  const cmsRuntime = getCmsRuntimeConfig();

  return [
    {
      checkId: "environment-auth-mode",
      label: "Live sign-in mode",
      status: authMode === "preview-cookie" ? "watch" : "ready",
      detail:
        authMode === "preview-cookie"
          ? "This runtime still points at preview sign-in, so it is not a true live launch setup yet."
          : `This runtime resolves sign-in through ${authMode}.`,
    },
    {
      checkId: "environment-auth-secret",
      label: "Sign-in secret",
      status: authSecretConfigured ? "ready" : "watch",
      detail: authSecretConfigured
        ? "The sign-in boundary has its own configured secret."
        : "A live sign-in secret still needs to be configured for this environment.",
    },
    {
      checkId: "environment-auth-base-url",
      label: "Public sign-in address",
      status: authMode === "oidc" ? (authBaseUrl ? "ready" : "watch") : "ready",
      detail:
        authMode === "oidc"
          ? authBaseUrl
            ? `The sign-in callback base URL is set to ${authBaseUrl}.`
            : "A public sign-in callback address still needs to be set for redirect-based live sign-in."
          : "This environment does not depend on a redirect callback address.",
    },
    {
      checkId: "environment-auth-provider",
      label: "Configured sign-in providers",
      status: authMode === "oidc" ? (configuredOidcProviders.length > 0 ? "ready" : "watch") : "ready",
      detail:
        authMode === "oidc"
          ? configuredOidcProviders.length > 0
            ? `${configuredOidcProviders.length} live sign-in provider configuration${configuredOidcProviders.length === 1 ? "" : "s"} are present.`
            : "At least one full live sign-in provider configuration still needs to be added."
          : "Provider configuration is handled outside this runtime mode.",
    },
    {
      checkId: "environment-persistence-path",
      label: "Student data location",
      status:
        persistenceRuntime.driver === "memory" || persistenceRuntime.isPrototypePersistence
          ? "watch"
          : "ready",
      detail:
        persistenceRuntime.driver === "memory"
          ? "This runtime would lose student data on restart."
          : persistenceRuntime.isPrototypePersistence
            ? `Student data is still using the local default path at ${persistenceRuntime.dataDirectory}.`
            : `Student data is pointed at the explicit runtime path ${persistenceRuntime.dataDirectory}.`,
    },
    {
      checkId: "environment-cms-mode",
      label: "Editorial mode",
      status: cmsRuntime.backendMode === "live" ? "ready" : "watch",
      detail:
        cmsRuntime.backendMode === "live"
          ? "Editorial work is enabled through the live writable workflow."
          : "Editorial work is still running in read-only mode.",
    },
  ];
}

function buildSignOffChecks(): GovernanceSignOffCheck[] {
  const authMode = (process.env.SWITCH_AUTH_MODE ?? "oidc").trim();
  const authSecretConfigured = Boolean(process.env.SWITCH_AUTH_SECRET?.trim());
  const persistenceRuntime = getPersistenceRuntimeConfig();
  const cmsRuntime = getCmsRuntimeConfig();
  const privacyReady = authMode !== "preview-cookie" && authSecretConfigured;
  const safeguardingReady = true;
  const alertsReady =
    authMode !== "preview-cookie" &&
    authSecretConfigured &&
    persistenceRuntime.driver !== "memory";
  const incidentOwnershipReady = true;
  const releaseApprovalReady =
    privacyReady &&
    alertsReady &&
    cmsRuntime.backendMode === "live" &&
    !persistenceRuntime.isPrototypePersistence;

  return [
    {
      checkId: "signoff-privacy-retention",
      label: "Privacy and retention sign-off",
      status: privacyReady ? "ready" : "watch",
      owner: "Student data lead",
      detail: privacyReady
        ? "Account, session, and saved-progress handling now sit behind a live-style sign-in boundary with a configured secret."
        : "Privacy and retention sign-off should stay open until the live sign-in boundary is fully configured.",
    },
    {
      checkId: "signoff-safeguarding-support",
      label: "Safeguarding and support sign-off",
      status: safeguardingReady ? "ready" : "watch",
      owner: "Student support lead",
      detail: "Support remains signposting-only, urgent help stays visible, and the wording is kept inside a named safeguarding review path.",
    },
    {
      checkId: "signoff-alerts-recovery",
      label: "Alerts and recovery sign-off",
      status: alertsReady ? "ready" : "watch",
      owner: "Platform lead",
      detail: alertsReady
        ? "Auth, persistence, saved-session continuity, and editorial watch points now have visible operational checks."
        : "This sign-off should stay open until live auth and student-data recovery are both configured in a launch-style way.",
    },
    {
      checkId: "signoff-incident-ownership",
      label: "Incident ownership sign-off",
      status: incidentOwnershipReady ? "ready" : "watch",
      owner: "Release manager",
      detail: "Primary and backup owners are named for engineering operations, editorial operations, student data support, and safeguarding support.",
    },
    {
      checkId: "signoff-release-approval",
      label: "Final release approval sign-off",
      status: releaseApprovalReady ? "ready" : "watch",
      owner: "Launch manager",
      detail: releaseApprovalReady
        ? "The release path now has its core trust, runtime, and ownership checks in place for final approval."
        : "Final release approval should stay open until the live student-data location and launch environment checks are fully settled.",
    },
  ];
}
