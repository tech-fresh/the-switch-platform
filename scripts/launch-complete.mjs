import "./load-script-env.mjs";

import path from "node:path";

import { getRepoRoot, runCommand } from "./launch-utils.mjs";
import { getLaunchPreflightReport } from "./launch-preflight-utils.mjs";

const repoRoot = getRepoRoot();
const npmExecPath =
  process.env.npm_execpath ??
  path.join(repoRoot, "node_modules", "npm", "bin", "npm-cli.js");

const finalLaunchScripts = [
  "verify:live-readiness",
  "verify:persistence-recovery",
  "verify:live-walkthrough",
  "verify:launch-signoff",
  "verify:live-truth-match",
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
  await runCommand(process.execPath, [npmExecPath, "run", scriptName], {
    label: `npm run ${scriptName}`,
    env: process.env,
  });
}

console.log("\nFinal launch completion sequence passed.");
console.log(
  "This run proved live environment readiness, persistence recovery, deployed route walkthrough, and final trust sign-off in one repeatable sequence.",
);
