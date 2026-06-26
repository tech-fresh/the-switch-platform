import "./load-script-env.mjs";

import { fileExists, getRepoRoot, runCommand } from "./launch-utils.mjs";
import { getLaunchPreflightReport } from "./launch-preflight-utils.mjs";

const repoRoot = getRepoRoot();
const npmExecPath = process.env.npm_execpath?.trim() ?? "";
const useNodeNpmExec = npmExecPath ? await fileExists(npmExecPath) : false;
const npmCommand = useNodeNpmExec ? process.execPath : "npm";
const npmArgsPrefix = useNodeNpmExec ? [npmExecPath] : [];
const delegatedSignoffCommand = process.env.SWITCH_LAUNCH_SIGNOFF_COMMAND?.trim() ?? "";
const delegatedPersistenceRecoveryCommand =
  process.env.SWITCH_PERSISTENCE_RECOVERY_COMMAND?.trim() ?? "";
const finalSequenceEnv = {
  ...process.env,
  // The final completion path must exercise real auth, not launch-verification headers.
  SWITCH_LAUNCH_VERIFICATION_SECRET: "",
  // Local orchestration should not try to write governance records into /data;
  // the delegated Fly sign-off command handles the live recording step.
  SWITCH_RECORD_GOVERNANCE: "0",
  SWITCH_LIVE_FETCH_ATTEMPTS: process.env.SWITCH_LIVE_FETCH_ATTEMPTS ?? "5",
  SWITCH_LIVE_FETCH_TIMEOUT_MS: process.env.SWITCH_LIVE_FETCH_TIMEOUT_MS ?? "60000",
};

const finalLaunchScripts = [
  "verify:persistence-health",
  "verify:live-readiness",
  "verify:persistence-recovery",
  "verify:live-walkthrough:real-auth",
  "verify:live-truth-match",
  "verify:launch-signoff",
  "verify:live-oidc-proof",
];
const preflight = getLaunchPreflightReport(process.env);

if (process.env.SWITCH_LAUNCH_COMPLETE_DRY_RUN === "1") {
  console.log("Final launch completion sequence:");
  for (const scriptName of finalLaunchScripts) {
    console.log(`- npm run ${scriptName}`);
  }
  if (preflight.ready) {
    console.log("- Preflight: ready");
  } else {
    console.log("- Preflight: missing required live inputs");
    for (const key of preflight.missing) {
      console.log(`  - ${key}`);
    }
  }
  console.log(
    "Dry run only: set SWITCH_LAUNCH_COMPLETE_DRY_RUN=0 or unset it to execute the full live launch completion sequence.",
  );
  process.exit(0);
}

if (!preflight.ready) {
  console.error("Launch completion preflight failed. Missing required live inputs:");
  for (const key of preflight.missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

for (const scriptName of finalLaunchScripts) {
  process.stdout.write(`\n> Running ${scriptName}\n`);
  if (scriptName === "verify:launch-signoff" && delegatedSignoffCommand) {
    await runCommand("/bin/sh", ["-lc", delegatedSignoffCommand], {
      label: `delegated ${scriptName}`,
      env: finalSequenceEnv,
    });
    continue;
  }

  if (scriptName === "verify:persistence-recovery" && delegatedPersistenceRecoveryCommand) {
    await runCommand("/bin/sh", ["-lc", delegatedPersistenceRecoveryCommand], {
      label: `delegated ${scriptName}`,
      env: finalSequenceEnv,
    });
    continue;
  }

  await runCommand(npmCommand, [...npmArgsPrefix, "run", scriptName], {
    label: `npm run ${scriptName}`,
    env: finalSequenceEnv,
  });
}

console.log("\nFinal launch completion sequence passed.");
console.log(
  "This run proved live environment readiness, persistence recovery, deployed route walkthrough, and final trust sign-off in one repeatable sequence.",
);
