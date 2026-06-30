/**
 * Canonical local launch rehearsal order for MVP usability Area 7.
 * Imported by `local-launch-readiness.mjs` and contract tests — keep in sync.
 */

export const LOCAL_LAUNCH_REHEARSAL_CORE_STEPS = [
  {
    id: "lint",
    label: "Repository lint",
    npmScript: "lint",
    story: "Core scripts, auth defaults, launch routes, and environment examples are present.",
  },
  {
    id: "type-check",
    label: "Type generation and TypeScript check",
    npmScript: "type-check",
    story: "Next route types and the TypeScript surface compile cleanly.",
  },
  {
    id: "build",
    label: "Production build",
    npmScript: "build",
    resetNextArtifacts: true,
    story: "The rehearsal dist builds without route or type failures.",
  },
  {
    id: "test",
    label: "Unit and contract tests",
    npmScript: "test",
    story: "Module logic, MVP route contracts, and primary CTA link checks pass.",
  },
  {
    id: "smoke",
    label: "Signed-out route smoke",
    npmScript: "test:smoke",
    runner: "route-smoke",
    story: "Canonical MVP pages, public APIs, and signed-out protection respond without 500s.",
  },
  {
    id: "e2e",
    label: "Signed-in rehearsal",
    npmScript: "test:e2e",
    runner: "launch-e2e",
    story: "Student continuity, save/resume, admin access, and sign-out behave in preview runtime.",
  },
];

export const LOCAL_LAUNCH_REHEARSAL_EXTENDED_STEPS = [
  {
    id: "route-clickability",
    label: "Route click-through rehearsal",
    npmScript: "test:route-clickability",
    story: "Dashboard shortcuts, account links, and resume hrefs follow through at runtime.",
  },
  {
    id: "exam-assessment",
    label: "Exam and assessment rehearsal",
    npmScript: "test:exam-assessment-rehearsal",
    story: "Lobby, focus entry, autosave, submit, and invalid-session recovery all work.",
  },
  {
    id: "continuity",
    label: "Continuity rehearsal",
    npmScript: "test:continuity-rehearsal",
    story: "Dashboard, saved-progress, and results continuity stay aligned.",
  },
  {
    id: "auth-account",
    label: "Auth and account rehearsal",
    npmScript: "test:auth-account-rehearsal",
    story: "Student/admin sign-in paths, account states, and sign-out lockout are reliable.",
  },
  {
    id: "support-recovery",
    label: "Support and recovery rehearsal",
    npmScript: "test:support-recovery-rehearsal",
    story: "Support hub, accessibility signposting, and recovery fallbacks stay actionable.",
  },
];

export const LOCAL_READINESS_PROBE_ROUTES = [
  "/",
  "/api/auth/providers",
  "/api/account/overview",
  "/api/dashboard/home",
];

export function formatLocalLaunchReadinessSummary() {
  const core = LOCAL_LAUNCH_REHEARSAL_CORE_STEPS.map((step) => step.npmScript).join(" → ");
  const extended = LOCAL_LAUNCH_REHEARSAL_EXTENDED_STEPS.map((step) => step.npmScript).join(", ");

  return [
    "Local launch readiness core order:",
    core,
    "",
    "Extended MVP rehearsals (run after core order when hardening a release):",
    extended,
  ].join("\n");
}
