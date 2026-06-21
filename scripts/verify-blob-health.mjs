import "./load-script-env.mjs";

import { assert } from "./launch-utils.mjs";

const { getPersistenceRuntimeConfig } = await import("../src/lib/persistence/runtime.ts");
const { probeVercelBlobReadHealth } = await import("../src/lib/persistence/vercel-blob.ts");

const config = getPersistenceRuntimeConfig();

if (config.storageBackend !== "vercel-blob") {
  console.log("Blob health check: not applicable because persistence is not using Vercel Blob.");
  process.exit(0);
}

const paths = [config.primaryStorePath, config.backupStorePath].filter(Boolean);

console.log("Vercel Blob health check:");
console.log(`- Data directory: ${config.dataDirectory}`);

for (const blobPath of paths) {
  const health = await probeVercelBlobReadHealth(blobPath);
  console.log(`- ${blobPath}: ${health.status}`);

  if ("detail" in health && health.detail) {
    console.log(`  ${health.detail}`);
  }

  if (health.status === "healthy") {
    console.log(`  byteLength=${health.byteLength}`);
  }
}

const primaryHealth = await probeVercelBlobReadHealth(config.primaryStorePath);

assert(
  primaryHealth.status !== "missing-auth",
  primaryHealth.status === "missing-auth"
    ? primaryHealth.detail
    : "Blob auth credentials are missing.",
);

if (primaryHealth.status === "suspended") {
  console.error("\nBlob store is suspended.");
  console.error("Operator action required in Vercel:");
  console.error("- unsuspend the Blob store backing this project, or");
  console.error("- create/replace the store, update BLOB_READ_WRITE_TOKEN and SWITCH_DATA_DIRECTORY, then run npm run persistence:migrate-to-sqlite");
  console.error("\nAfter repair, rerun:");
  console.error("- npm run verify:blob-health");
  console.error("- npm run verify:live-readiness");
  console.error("- npm run verify:live-walkthrough");
  console.error("- npm run verify:live-truth-match");
  process.exit(1);
}

assert(
  primaryHealth.status === "healthy" || primaryHealth.status === "missing",
  primaryHealth.status === "unreadable"
    ? `Primary Blob store is unreadable: ${primaryHealth.detail}`
    : `Primary Blob store health check failed with status ${primaryHealth.status}.`,
);

if (primaryHealth.status === "missing") {
  console.log("\nPrimary sqlite blob is missing. Seed it with:");
  console.log("- npm run persistence:migrate-to-sqlite");
}

console.log("\nBlob health check passed for the primary live sqlite path.");
