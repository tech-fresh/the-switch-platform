import { getGovernanceRecordingConfig, recordLocalReleaseRehearsal } from "./launch-governance.mjs";
import { fileExists, getRepoRoot, runCommand } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const npmExecPath = process.env.npm_execpath?.trim() ?? "";
const useNodeNpmExec = npmExecPath ? await fileExists(npmExecPath) : false;
const npmCommand = useNodeNpmExec ? process.execPath : "npm";
const npmArgsPrefix = useNodeNpmExec ? [npmExecPath] : [];

const scriptNames = ["lint", "test", "build", "test:smoke", "test:e2e", "test:final-smoke"];

for (const scriptName of scriptNames) {
  process.stdout.write(`\n> Running ${scriptName}\n`);
  await runCommand(npmCommand, [...npmArgsPrefix, "run", scriptName], {
    label: `npm run ${scriptName}`,
    env:
      scriptName === "build"
        ? {
            ...process.env,
            SWITCH_AUTH_SECRET: process.env.SWITCH_AUTH_SECRET ?? "launch-build-secret",
          }
        : scriptName === "test:smoke" || scriptName === "test:e2e" || scriptName === "test:final-smoke"
        ? {
            ...process.env,
            SWITCH_SKIP_BUILD: "1",
          }
        : process.env,
  });
}

const governanceRecording = await recordLocalReleaseRehearsal(
  getGovernanceRecordingConfig("local-release-rehearsal"),
  scriptNames,
);

console.log("\nLocal release rehearsal passed: lint, tests, build, smoke checks, and end-to-end checks are all green.");
console.log("This proves the local rehearsal path. Run verify:live-readiness for the real launch environment checks.");
if (governanceRecording) {
  console.log("Launch governance recording updated the local rehearsal evidence for this run.");
}
