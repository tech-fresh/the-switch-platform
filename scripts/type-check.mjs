import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCommand } from "./launch-utils.mjs";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDistDir = process.env.SWITCH_NEXT_DIST_DIR?.trim() || ".next-rehearsal";
const nextCliPath = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const tscCliPath = path.join(repoRoot, "node_modules", "typescript", "bin", "tsc");
const prepareRouteTypesScriptPath = path.join(repoRoot, "scripts", "prepare-next-route-types.mjs");
const tsBuildInfoPath = path.join(repoRoot, "tsconfig.tsbuildinfo");

await runCommand(process.execPath, [prepareRouteTypesScriptPath], {
  label: "prepare next route type shims",
  env: {
    ...process.env,
    SWITCH_NEXT_DIST_DIR: nextDistDir,
  },
});

await runCommand(process.execPath, [nextCliPath, "typegen"], {
  label: "next typegen",
  env: {
    ...process.env,
    NODE_ENV: "production",
    SWITCH_NEXT_DIST_DIR: nextDistDir,
    SWITCH_AUTH_SECRET: process.env.SWITCH_AUTH_SECRET ?? "launch-build-secret",
  },
});

// Clear the incremental cache so route-type file lists stay aligned after app-route changes.
await rm(tsBuildInfoPath, { force: true });

await runCommand(process.execPath, [tscCliPath, "--noEmit"], {
  label: "tsc --noEmit",
  env: process.env,
});
