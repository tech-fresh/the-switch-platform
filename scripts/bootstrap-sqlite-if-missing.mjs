import { access } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const driver = process.env.SWITCH_PERSISTENCE_DRIVER?.trim();
const dataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim();

if (driver !== "sqlite" || !dataDirectory) {
  process.exit(0);
}

const primaryDatabasePath = path.join(path.resolve(dataDirectory), "switch-live.sqlite");

try {
  await access(primaryDatabasePath);
  console.log(`[switch:bootstrap] SQLite already present at ${primaryDatabasePath}`);
  process.exit(0);
} catch {
  // Continue to first-time seed.
}

console.log(`[switch:bootstrap] Creating first SQLite database at ${primaryDatabasePath}`);

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "scripts/persistence-migrate-to-sqlite.mjs"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("[switch:bootstrap] SQLite bootstrap completed.");
