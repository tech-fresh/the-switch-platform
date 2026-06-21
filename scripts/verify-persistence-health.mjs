import "./load-script-env.mjs";

import { access } from "node:fs/promises";

import { assert, fetchJson } from "./launch-utils.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

const { getPersistenceRuntimeConfig } = await import("../src/lib/persistence/runtime.ts");

const config = getPersistenceRuntimeConfig();

console.log("Persistence health check:");
console.log(`- Driver: ${config.driver}`);
console.log(`- Storage backend: ${config.storageBackend}`);
console.log(`- Data directory: ${config.dataDirectory}`);
console.log(`- Ephemeral storage: ${config.isEphemeralStorage}`);

assert(config.driver === "sqlite", "SWITCH_PERSISTENCE_DRIVER must be sqlite for live launch.");
assert(config.dataDirectory, "SWITCH_DATA_DIRECTORY is required.");
assert(!config.isEphemeralStorage, "Persistence path resolves to ephemeral storage — use a volume or Blob store.");

if (config.storageBackend === "vercel-blob") {
  const { probeVercelBlobReadHealth } = await import("../src/lib/persistence/vercel-blob.ts");
  const primaryHealth = await probeVercelBlobReadHealth(config.primaryStorePath);

  console.log(`- Primary blob path: ${primaryHealth.status}`);
  if ("detail" in primaryHealth && primaryHealth.detail) {
    console.log(`  ${primaryHealth.detail}`);
  }

  assert(
    primaryHealth.status !== "missing-auth",
    primaryHealth.status === "missing-auth" ? primaryHealth.detail : "Blob auth credentials are missing.",
  );

  if (primaryHealth.status === "suspended") {
    console.error("\nBlob store is suspended. Use docs/FREE_TIER_DEPLOY.md to move to Fly.io with a disk volume.");
    process.exit(1);
  }

  assert(
    primaryHealth.status === "healthy" || primaryHealth.status === "missing",
    primaryHealth.status === "unreadable"
      ? `Primary Blob store is unreadable: ${primaryHealth.detail}`
      : `Primary Blob store health check failed with status ${primaryHealth.status}.`,
  );

  if (primaryHealth.status === "missing") {
    console.log("\nPrimary sqlite blob is missing. Seed with: npm run persistence:migrate-to-sqlite");
  }

  console.log("\nBlob persistence health check passed.");
  process.exit(0);
}

try {
  await access(config.primaryStorePath);
  console.log(`- Primary database: present (${config.primaryStorePath})`);
} catch {
  console.log(`- Primary database: missing (${config.primaryStorePath})`);
  console.log("  Run: npm run persistence:migrate-to-sqlite (or redeploy with SWITCH_AUTO_BOOTSTRAP_SQLITE=1)");
}

const liveBaseUrl = process.env.SWITCH_LIVE_BASE_URL?.trim();
if (liveBaseUrl) {
  const { baseUrl, adminHeaders } = getLiveWalkthroughConfig();
  const persistenceResponse = await fetchJson(`${baseUrl}/api/persistence/runtime`, {
    headers: adminHeaders,
  });

  assert(
    persistenceResponse.response.ok,
    `Expected /api/persistence/runtime to return 200, received ${persistenceResponse.response.status}.`,
  );

  const persistence = persistenceResponse.json?.persistence;
  assert(persistence, "/api/persistence/runtime returned no persistence payload.");
  assert(persistence.driver === "sqlite", `Expected sqlite driver, received ${persistence.driver}.`);
  assert(
    persistence.storageBackend === "filesystem",
    `Expected filesystem storage, received ${persistence.storageBackend}.`,
  );
  assert(
    persistence.isEphemeralStorage === false,
    "Deployed persistence still reports ephemeral storage.",
  );
  assert(
    persistence.dataDirectory === config.dataDirectory,
    `Deployed data directory ${persistence.dataDirectory} does not match ${config.dataDirectory}.`,
  );

  console.log(`- Deployed runtime API: healthy at ${liveBaseUrl}`);
}

console.log("\nFilesystem persistence health check passed.");
