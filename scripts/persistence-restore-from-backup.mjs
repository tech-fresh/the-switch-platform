import { copyFile, mkdir } from "node:fs/promises";

const { getPersistenceRuntimeConfig } = await import("../src/lib/persistence/runtime.ts");

const runtime = getPersistenceRuntimeConfig();

if (runtime.driver !== "sqlite") {
  throw new Error("Backup restore is only supported through the sqlite launch persistence path.");
}

if (!runtime.backupStorePath) {
  throw new Error("No backup database path is configured for the current persistence runtime.");
}

await mkdir(runtime.dataDirectory, { recursive: true });
await copyFile(runtime.backupStorePath, runtime.primaryStorePath);

console.log("SQLite backup restore completed:");
console.log(`- Restored primary database: ${runtime.primaryStorePath}`);
console.log(`- Source backup database: ${runtime.backupStorePath}`);
