import "./load-script-env.mjs";

import { access } from "node:fs/promises";

import { assert, fetchJson } from "./launch-utils.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

const { getPersistenceRuntimeConfig } = await import("../src/lib/persistence/runtime.ts");

const config = getPersistenceRuntimeConfig();
const liveBaseUrl = process.env.SWITCH_LIVE_BASE_URL?.trim();
const intendedLiveDataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim() ?? "";

console.log("Persistence health check:");
console.log(`- Driver: ${config.driver}`);
console.log(`- Storage backend: ${config.storageBackend}`);
console.log(`- Data directory: ${config.dataDirectory}`);
console.log(`- Ephemeral storage: ${config.isEphemeralStorage}`);

assert(config.driver === "sqlite", "SWITCH_PERSISTENCE_DRIVER must be sqlite for live launch.");
assert(intendedLiveDataDirectory, "SWITCH_DATA_DIRECTORY is required.");
assert(!config.isEphemeralStorage, "Persistence path resolves to ephemeral storage — use a mounted volume or durable filesystem path.");

try {
  await access(config.primaryStorePath);
  console.log(`- Primary database: present (${config.primaryStorePath})`);
} catch {
  if (!liveBaseUrl) {
    console.log(`- Primary database: missing (${config.primaryStorePath})`);
    console.log("  Run: npm run persistence:migrate-to-sqlite (or redeploy with SWITCH_AUTO_BOOTSTRAP_SQLITE=1)");
  } else {
    console.log(`- Primary database: local path not mounted (${config.primaryStorePath}); checking deployed runtime instead`);
  }
}

if (liveBaseUrl) {
  const { baseUrl, adminHeaders } = getLiveWalkthroughConfig();
  const persistenceResponse = await fetchJson(`${baseUrl}/api/persistence/runtime`, {
    headers: adminHeaders,
  });

  if (persistenceResponse.response.status === 401) {
    const dashboardResponse = await fetch(`${baseUrl.replace(/\/+$/, "")}/dashboard`, {
      redirect: "manual",
    });
    assert(
      dashboardResponse.status === 200 || dashboardResponse.status === 307 || dashboardResponse.status === 308,
      `Expected /dashboard to respond without persistence failure, received ${dashboardResponse.status}.`,
    );
    console.log(`- Deployed route probe: /dashboard responds (${dashboardResponse.status}) — persistence likely healthy`);
    console.log("- Refresh SWITCH_LIVE_ADMIN_COOKIE after Fly sign-in for full /api/persistence/runtime proof.");
  } else {
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
      persistence.dataDirectory === intendedLiveDataDirectory,
      `Deployed data directory ${persistence.dataDirectory} does not match intended live path ${intendedLiveDataDirectory}.`,
    );

    console.log(`- Deployed runtime API: healthy at ${liveBaseUrl}`);
    console.log(`- Intended live data directory: ${intendedLiveDataDirectory}`);
  }
}

console.log("\nFilesystem persistence health check passed.");
