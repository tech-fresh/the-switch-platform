import path from "node:path";
import { readFile } from "node:fs/promises";

import { assert, getRepoRoot, readJson } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const packageJson = await readJson(path.join(repoRoot, "package.json"));
const runtimeSource = await readFile(path.join(repoRoot, "src/modules/auth/runtime.ts"), "utf8");
const envExampleSource = await readFile(path.join(repoRoot, ".env.example"), "utf8");

const requiredScripts = [
  "lint",
  "build",
  "type-check",
  "test",
  "test:smoke",
  "test:e2e",
  "verify:release",
  "verify:live-readiness",
  "verify:launch-status",
  "verify:live-walkthrough",
  "verify:live-walkthrough:real-auth",
  "verify:live-oidc-proof",
  "verify:live-onboarding",
  "verify:launch-signoff",
  "verify:launch-complete",
  "verify:persistence-recovery",
  "persistence:migrate-to-sqlite",
  "persistence:restore-from-backup",
];
const requiredPages = [
  "src/app/dashboard/page.tsx",
  "src/app/subjects/page.tsx",
  "src/app/assessments/page.tsx",
  "src/app/exams/page.tsx",
  "src/app/saved-progress/page.tsx",
  "src/app/results/page.tsx",
  "src/app/account/page.tsx",
  "src/app/support/page.tsx",
  "src/app/admin/page.tsx",
];
const requiredApiRoutes = [
  "src/app/api/auth/providers/route.ts",
  "src/app/api/account/overview/route.ts",
  "src/app/api/dashboard/home/route.ts",
  "src/app/api/results/overview/route.ts",
  "src/app/api/cms/overview/route.ts",
  "src/app/api/governance/overview/route.ts",
  "src/app/api/operations/overview/route.ts",
  "src/app/api/persistence/runtime/route.ts",
  "src/app/api/governance/environment/[checkId]/route.ts",
  "src/app/api/governance/smoke/[checkId]/route.ts",
  "src/app/api/governance/reviews/[reviewId]/route.ts",
  "src/app/api/governance/signoff/[checkId]/route.ts",
  "src/app/api/governance/evidence/[evidenceId]/route.ts",
];
const requiredEnvKeys = [
  "SWITCH_AUTH_MODE",
  "SWITCH_AUTH_SECRET",
  "SWITCH_AUTH_BASE_URL",
  "SWITCH_EXTERNAL_AUTH_HEADER_SECRET",
  "SWITCH_AUTH_EDITOR_EMAILS",
  "SWITCH_AUTH_ADMIN_EMAILS",
  "SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID",
  "SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET",
  "SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL",
  "SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL",
  "SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL",
  "SWITCH_OIDC_GOOGLE_CLIENT_ID",
  "SWITCH_OIDC_GOOGLE_CLIENT_SECRET",
  "SWITCH_OIDC_GOOGLE_AUTHORIZATION_URL",
  "SWITCH_OIDC_GOOGLE_TOKEN_URL",
  "SWITCH_OIDC_GOOGLE_USERINFO_URL",
  "SWITCH_OIDC_APPLE_CLIENT_ID",
  "SWITCH_OIDC_APPLE_CLIENT_SECRET",
  "SWITCH_OIDC_APPLE_AUTHORIZATION_URL",
  "SWITCH_OIDC_APPLE_TOKEN_URL",
  "SWITCH_OIDC_APPLE_USERINFO_URL",
  "SWITCH_OIDC_MICROSOFT_CLIENT_ID",
  "SWITCH_OIDC_MICROSOFT_CLIENT_SECRET",
  "SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL",
  "SWITCH_OIDC_MICROSOFT_TOKEN_URL",
  "SWITCH_OIDC_MICROSOFT_USERINFO_URL",
  "SWITCH_PERSISTENCE_DRIVER",
  "SWITCH_DATA_DIRECTORY",
  "SWITCH_CMS_BACKEND_MODE",
  "SWITCH_LIVE_BASE_URL",
  "SWITCH_LIVE_STUDENT_COOKIE",
  "SWITCH_LIVE_ADMIN_COOKIE",
  "SWITCH_LIVE_STUDENT_USER_ID",
  "SWITCH_LIVE_STUDENT_DISPLAY_NAME",
  "SWITCH_LIVE_STUDENT_EMAIL",
  "SWITCH_LIVE_ADMIN_USER_ID",
  "SWITCH_LIVE_ADMIN_DISPLAY_NAME",
  "SWITCH_LIVE_ADMIN_EMAIL",
  "SWITCH_LAUNCH_APPROVER",
  "SWITCH_LAUNCH_STOP_AUTHORITY",
  "SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE",
  "SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE",
  "SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE",
  "SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE",
  "SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE",
  "SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE",
  "SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE",
  "SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE",
  "SWITCH_GOVERNANCE_SMOKE_OWNER",
];

assert(packageJson.type === "module", "package.json must declare \"type\": \"module\" for clean ESM test/runtime behavior.");

for (const scriptName of requiredScripts) {
  assert(packageJson.scripts?.[scriptName], `package.json is missing the required launch script "${scriptName}".`);
}

assert(
  runtimeSource.includes('requestedMode === "preview-cookie"') &&
    runtimeSource.includes(': "oidc";'),
  "Auth runtime should treat OIDC as the default path and preview-cookie as an explicit override.",
);

assert(
  envExampleSource.trim().length > 0,
  ".env.example must exist and document the current runtime setup.",
);

for (const envKey of requiredEnvKeys) {
  assert(
    envExampleSource.includes(`${envKey}=`),
    `.env.example is missing the required runtime variable "${envKey}".`,
  );
}

for (const relativePath of requiredPages.concat(requiredApiRoutes)) {
  const absolutePath = path.join(repoRoot, relativePath);
  const source = await readFile(absolutePath, "utf8");

  assert(source.trim().length > 0, `${relativePath} exists but is empty.`);
}

console.log("Launch lint passed: core scripts, auth runtime defaults, launch routes, and environment examples are present.");
