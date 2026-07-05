import "./load-script-env.mjs";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getRepoRoot, runCommand } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const evidenceDir = path.join(repoRoot, "release-evidence");
const stamp = new Date().toISOString().slice(0, 10);
const evidencePath = path.join(
  evidenceDir,
  `${stamp}-priority-a-canonical-closeout.md`,
);

const npmExecPath = process.env.npm_execpath?.trim() ?? "";
const npmCommand = npmExecPath ? process.execPath : "npm";
const npmArgsPrefix = npmExecPath ? [npmExecPath] : [];

const flyAppName = process.env.SWITCH_FLY_APP_NAME?.trim() || "the-switch-platform";
const flyPersistenceCommand =
  process.env.SWITCH_PERSISTENCE_RECOVERY_COMMAND?.trim() ||
  `fly ssh console -a ${flyAppName} -C "sh -lc 'cd /app && node scripts/persistence-recovery-check.mjs'"`;
const flySignoffCommand =
  process.env.SWITCH_LAUNCH_SIGNOFF_COMMAND?.trim() ||
  `fly ssh console -a ${flyAppName} -C "sh -lc 'cd /app && node scripts/launch-signoff.mjs'"`;

const launchVerificationSecret =
  process.env.SWITCH_LAUNCH_VERIFICATION_SECRET?.trim() ?? "";

const closeoutEnv = {
  ...process.env,
  SWITCH_LAUNCH_VERIFICATION_SECRET: "",
  SWITCH_RECORD_GOVERNANCE: process.env.SWITCH_RECORD_GOVERNANCE ?? "0",
  SWITCH_LIVE_FETCH_ATTEMPTS: process.env.SWITCH_LIVE_FETCH_ATTEMPTS ?? "6",
  SWITCH_LIVE_FETCH_TIMEOUT_MS: process.env.SWITCH_LIVE_FETCH_TIMEOUT_MS ?? "90000",
  SWITCH_PERSISTENCE_RECOVERY_COMMAND: flyPersistenceCommand,
  SWITCH_LAUNCH_SIGNOFF_COMMAND: flySignoffCommand,
};

const onboardingRegressionEnv = {
  ...process.env,
  SWITCH_LAUNCH_VERIFICATION_SECRET: launchVerificationSecret,
  SWITCH_LIVE_FETCH_TIMEOUT_MS: process.env.SWITCH_LIVE_FETCH_TIMEOUT_MS ?? "90000",
  SWITCH_LIVE_FETCH_ATTEMPTS: process.env.SWITCH_LIVE_FETCH_ATTEMPTS ?? "6",
  SWITCH_SUPPORTIVE_ROUTE_WARMUP_ATTEMPTS:
    process.env.SWITCH_SUPPORTIVE_ROUTE_WARMUP_ATTEMPTS ?? "8",
  SWITCH_SUPPORTIVE_ROUTE_WARMUP_DELAY_MS:
    process.env.SWITCH_SUPPORTIVE_ROUTE_WARMUP_DELAY_MS ?? "3000",
  SWITCH_LIVE_HTTP_WARMUP_ATTEMPTS: process.env.SWITCH_LIVE_HTTP_WARMUP_ATTEMPTS ?? "12",
  SWITCH_LIVE_HTTP_WARMUP_DELAY_MS: process.env.SWITCH_LIVE_HTTP_WARMUP_DELAY_MS ?? "5000",
  SWITCH_LIVE_HTTP_WARMUP_TIMEOUT_MS: process.env.SWITCH_LIVE_HTTP_WARMUP_TIMEOUT_MS ?? "20000",
};

const steps = [
  {
    id: "check-live-cookies",
    label: "verify:check-live-cookies",
    script: "verify:check-live-cookies",
    env: closeoutEnv,
  },
  {
    id: "launch-status",
    label: "verify:launch-status",
    script: "verify:launch-status",
    env: closeoutEnv,
  },
  {
    id: "launch-complete",
    label: "verify:launch-complete (full final sequence)",
    script: "verify:launch-complete",
    env: closeoutEnv,
  },
  {
    id: "live-truth-match",
    label: "verify:live-truth-match (item 22 / A-8 explicit rerun)",
    script: "verify:live-truth-match",
    env: closeoutEnv,
  },
];

const sections = [];
let allPassed = true;

sections.push(`# Priority A canonical closeout — ${stamp}

Live host: ${process.env.SWITCH_LIVE_BASE_URL?.trim() || "https://theswitchplatform.com"}
Workspace: \`${repoRoot}\`

## Purpose

This is the **canonical** Priority A release-evidence bundle for **A-6** and **A-8**.

It supersedes partial/interim records for closeout purposes. Historical evidence remains in:

- \`release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md\` (historical — Mark 2 item 22)
- \`release-evidence/2026-06-25-priority-a-truth-audit.md\` (interim truth audit — superseded by this file)

## Referenced browser-authenticated proofs (still valid)

From \`release-evidence/2026-06-25-priority-a-truth-audit.md\`:

- **A-1** real Google OIDC sign-in on production
- **A-3** real sign-out and protected-route lockout
- **A-4** real 8-step learner onboarding through the browser
- **A-5** Fly production persistence recovery on \`/data\`

## Supportive regression proof kept outside the strict closeout chain

- \`npm run verify:live-onboarding\` remains a useful API-assisted onboarding regression check.
- It is **not** counted as part of the strict A-4 real-auth proof inside this canonical bundle because it uses launch-verification headers to simulate a fresh learner.

## Run metadata

- Generated: ${new Date().toISOString()}
- Strict real-auth closeout steps: \`SWITCH_LAUNCH_VERIFICATION_SECRET\` blanked
- Fly persistence delegate: \`${flyPersistenceCommand}\`
- Fly sign-off delegate: \`${flySignoffCommand}\`
`);

for (const step of steps) {
  console.log(`\n> ${step.label}`);

  try {
    const result = await runCommand(npmCommand, [...npmArgsPrefix, "run", step.script], {
      label: step.label,
      env: step.env,
    });
    const output = `${result.stdout}\n${result.stderr}`.trim();
    sections.push(`## ${step.label}\n\n\`\`\`text\n${output}\n\`\`\``);
    console.log("- passed");
  } catch (error) {
    allPassed = false;
    const message = error instanceof Error ? error.message : String(error);
    sections.push(`## ${step.label}\n\n**FAILED**\n\n\`\`\`text\n${message}\n\`\`\``);
    console.error(`- failed: ${message}`);

    if (step.id === "check-live-cookies") {
      console.error("Stop here until SWITCH_LIVE_STUDENT_COOKIE and SWITCH_LIVE_ADMIN_COOKIE are refreshed.");
      break;
    }
  }
}

sections.push(`## Onboarding proof note

The strict canonical closeout relies on the browser-authenticated **A-4** evidence recorded in \`release-evidence/2026-06-25-priority-a-truth-audit.md\`.

\`npm run verify:live-onboarding\` is kept as useful API-assisted regression coverage for the onboarding module, but it is **not** counted as part of the strict real-auth closeout chain.
`);

if (allPassed) {
  if (launchVerificationSecret) {
    console.log("\n> verify:live-onboarding (API-assisted regression — outside strict chain)");

    try {
      const result = await runCommand(npmCommand, [...npmArgsPrefix, "run", "verify:live-onboarding"], {
        label: "verify:live-onboarding (API-assisted regression)",
        env: onboardingRegressionEnv,
      });
      const output = `${result.stdout}\n${result.stderr}`.trim();
      sections.push(`## verify:live-onboarding (API-assisted regression — not strict A-4)

Evidence class: synthetic/API-assisted only (launch-verification headers + API profile updates).

\`\`\`text
${output}
\`\`\``);
      console.log("- passed (supportive regression only)");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sections.push(`## verify:live-onboarding (API-assisted regression — not strict A-4)

Evidence class: synthetic/API-assisted only.

**FAILED** — this does not invalidate A-4 browser proof or the strict closeout above.

\`\`\`text
${message}
\`\`\``);
      console.error(`- failed (supportive regression only): ${message}`);
    }
  } else {
    sections.push(`## verify:live-onboarding (API-assisted regression — skipped)

\`SWITCH_LAUNCH_VERIFICATION_SECRET\` was unset in the operator environment, so the API-assisted onboarding regression check was not run. Strict closeout steps above remain valid. Set the secret locally to run \`npm run verify:live-onboarding\` separately.
`);
    console.log("\n- skipped verify:live-onboarding (SWITCH_LAUNCH_VERIFICATION_SECRET unset)");
  }
}

sections.push(`## Closeout status

- **A-6** canonical bundle: ${allPassed ? "**COMPLETE**" : "**NOT COMPLETE** — see failed sections above"}
- **A-8** truth-match rerun: ${allPassed ? "**COMPLETE**" : "**NOT COMPLETE** — requires green verify:live-truth-match"}

## If cookie check failed

1. Sign in on https://theswitchplatform.com/login (student, then admin).
2. Copy \`switch_auth_session\` values into \`.env.local\`.
3. Guide: https://theswitchplatform.com/account/live-cookie-guide
4. Re-run:

\`\`\`bash
npm run verify:priority-a-closeout
\`\`\`
`);

await mkdir(evidenceDir, { recursive: true });
await writeFile(evidencePath, `${sections.join("\n\n")}\n`, "utf8");

console.log(`\nEvidence written: ${evidencePath}`);

if (!allPassed) {
  process.exit(1);
}

console.log("Priority A canonical closeout passed (A-6 + A-8).");
