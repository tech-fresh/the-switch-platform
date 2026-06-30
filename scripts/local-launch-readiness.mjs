import { fileURLToPath } from "node:url";

import { getPersistenceRuntimeConfig } from "../src/lib/persistence/runtime.ts";
import {
  formatLocalLaunchReadinessSummary,
  LOCAL_LAUNCH_REHEARSAL_CORE_STEPS,
} from "./local-launch-rehearsal-order.mjs";
import { fileExists, runCommand } from "./launch-utils.mjs";

const npmExecPath = process.env.npm_execpath?.trim() ?? "";
const useNodeNpmExec = npmExecPath ? await fileExists(npmExecPath) : false;
const npmCommand = useNodeNpmExec ? process.execPath : "npm";
const npmArgsPrefix = useNodeNpmExec ? [npmExecPath] : [];
const cleanNextBuildArtifactsScriptPath = fileURLToPath(
  new URL("./clean-next-build-artifacts.mjs", import.meta.url),
);

console.log(formatLocalLaunchReadinessSummary());
console.log("");

logPersistenceRuntimeNote();

for (const step of LOCAL_LAUNCH_REHEARSAL_CORE_STEPS) {
  if (step.resetNextArtifacts) {
    process.stdout.write(`\n> [${step.id}] Resetting Next build artifacts\n`);
    await runCommand(process.execPath, [cleanNextBuildArtifactsScriptPath], {
      label: "reset Next build artifacts",
      env: process.env,
    });
  }

  process.stdout.write(`\n> [${step.id}] ${step.label}\n`);
  process.stdout.write(`    ${step.story}\n`);

  if (step.runner === "route-smoke") {
    const { runRouteSmoke } = await import("./route-smoke.mjs");
    await runRouteSmoke();
    continue;
  }

  if (step.runner === "launch-e2e") {
    const { runLaunchE2e } = await import("./launch-e2e.mjs");
    await runLaunchE2e();
    continue;
  }

  await runCommand(npmCommand, [...npmArgsPrefix, "run", step.npmScript], {
    label: `npm run ${step.npmScript}`,
    env: process.env,
  });
}

console.log(
  "\nLocal launch readiness passed: lint, type-check, build, contract tests, signed-out smoke, and signed-in rehearsal all completed in the documented core order.",
);

function logPersistenceRuntimeNote() {
  const persistence = getPersistenceRuntimeConfig();

  if (persistence.driver === "memory") {
    console.log(
      "[local-launch-readiness] Warning: memory persistence is active locally, so restart continuity is not being rehearsed.",
    );
    return;
  }

  if (persistence.dataDirectory.endsWith(".codex-data/fly-volume-fallback")) {
    console.log(
      `[local-launch-readiness] Using local Fly-volume fallback at ${persistence.dataDirectory} because /data is only mounted on Fly.`,
    );
    return;
  }

  if (persistence.usesDefaultDataDirectory) {
    console.log(
      `[local-launch-readiness] Using the default local data directory at ${persistence.dataDirectory}. Set SWITCH_DATA_DIRECTORY if you want a named shared rehearsal path.`,
    );
  }
}
