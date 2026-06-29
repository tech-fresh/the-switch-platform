import { getPersistenceRuntimeConfig } from "../src/lib/persistence/runtime.ts";
import { fileURLToPath } from "node:url";
import { fileExists, runCommand } from "./launch-utils.mjs";

const scriptRuns = [
  { name: "type-check" },
  { name: "build" },
  { name: "test" },
];

const npmExecPath = process.env.npm_execpath?.trim() ?? "";
const useNodeNpmExec = npmExecPath ? await fileExists(npmExecPath) : false;
const npmCommand = useNodeNpmExec ? process.execPath : "npm";
const npmArgsPrefix = useNodeNpmExec ? [npmExecPath] : [];
const cleanNextBuildArtifactsScriptPath = fileURLToPath(
  new URL("./clean-next-build-artifacts.mjs", import.meta.url),
);

logPersistenceRuntimeNote();
process.stdout.write("\n> Resetting Next build artifacts\n");
await runCommand(process.execPath, [cleanNextBuildArtifactsScriptPath], {
  label: "reset Next build artifacts",
  env: process.env,
});

for (const scriptRun of scriptRuns) {
  process.stdout.write(`\n> Running ${scriptRun.name}\n`);
  await runCommand(npmCommand, [...npmArgsPrefix, "run", scriptRun.name], {
    label: `npm run ${scriptRun.name}`,
    env: scriptRun.env
      ? {
          ...process.env,
          ...scriptRun.env,
        }
      : process.env,
  });
}

process.stdout.write("\n> Running test:smoke\n");
const { runRouteSmoke } = await import("./route-smoke.mjs");
await runRouteSmoke();

process.stdout.write("\n> Running test:e2e\n");
const { runLaunchE2e } = await import("./launch-e2e.mjs");
await runLaunchE2e();

console.log(
  "\nLocal launch readiness passed: build, route type generation, tests, smoke checks, and signed-in rehearsal all completed in the fresh-checkout order.",
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
