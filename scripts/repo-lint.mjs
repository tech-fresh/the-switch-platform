import path from "node:path";
import { readFile } from "node:fs/promises";

import { assert, getRepoRoot, readJson } from "./launch-utils.mjs";

const repoRoot = getRepoRoot();
const packageJson = await readJson(path.join(repoRoot, "package.json"));
const runtimeSource = await readFile(path.join(repoRoot, "src/modules/auth/runtime.ts"), "utf8");

const requiredScripts = ["lint", "build", "type-check", "test", "test:smoke", "test:e2e", "verify:release"];
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

for (const relativePath of requiredPages.concat(requiredApiRoutes)) {
  const absolutePath = path.join(repoRoot, relativePath);
  const source = await readFile(absolutePath, "utf8");

  assert(source.trim().length > 0, `${relativePath} exists but is empty.`);
}

console.log("Launch lint passed: core scripts, auth runtime defaults, and launch routes are present.");
