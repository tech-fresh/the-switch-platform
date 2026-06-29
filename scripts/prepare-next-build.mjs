import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileExists, runCommand } from "./launch-utils.mjs";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDistDir = process.env.SWITCH_NEXT_DIST_DIR?.trim() || ".next-rehearsal";
const nextDistPath = path.join(repoRoot, nextDistDir);
const nextTypesPath = path.join(nextDistPath, "types");
const tempTypesPath = path.join(repoRoot, ".codex-data", "tmp", `${nextDistDir.replaceAll("/", "-")}-types`);
const nextCliPath = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const prepareRouteTypesScriptPath = path.join(repoRoot, "scripts", "prepare-next-route-types.mjs");

await rm(nextDistPath, { recursive: true, force: true });
await rm(tempTypesPath, { recursive: true, force: true });

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

if (await fileExists(nextTypesPath)) {
  await mkdir(path.dirname(tempTypesPath), { recursive: true });
  await cp(nextTypesPath, tempTypesPath, { recursive: true });
}

await rm(nextDistPath, { recursive: true, force: true });

if (await fileExists(tempTypesPath)) {
  await mkdir(nextDistPath, { recursive: true });
  await rm(nextTypesPath, { recursive: true, force: true });
  await cp(tempTypesPath, nextTypesPath, { recursive: true });
}
