import path from "node:path";

import { getRepoRoot, runCommand } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const npmExecPath = process.env.npm_execpath ?? path.join(repoRoot, "node_modules", "npm", "bin", "npm-cli.js");

const scriptNames = ["lint", "test", "build", "test:smoke", "test:e2e"];

for (const scriptName of scriptNames) {
  process.stdout.write(`\n> Running ${scriptName}\n`);
  await runCommand(process.execPath, [npmExecPath, "run", scriptName], {
    label: `npm run ${scriptName}`,
    env:
      scriptName === "build"
        ? {
            ...process.env,
            SWITCH_AUTH_SECRET: process.env.SWITCH_AUTH_SECRET ?? "launch-build-secret",
          }
        : scriptName === "test:smoke" || scriptName === "test:e2e"
        ? {
            ...process.env,
            SWITCH_SKIP_BUILD: "1",
          }
        : process.env,
  });
}

console.log("\nRelease verification passed: lint, tests, build, smoke checks, and end-to-end checks are all green.");
