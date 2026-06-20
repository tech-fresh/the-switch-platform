import test from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

test("persistence runtime treats the default workspace data directory as provisional", async () => {
  const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
  const previousVercel = process.env.VERCEL;
  delete process.env.SWITCH_PERSISTENCE_DRIVER;
  delete process.env.SWITCH_DATA_DIRECTORY;
  delete process.env.VERCEL;

  const { getPersistenceRuntimeConfig } = await import(
    `../src/lib/persistence/runtime.ts?test=${Date.now()}-default-persistence`
  );
  const runtime = getPersistenceRuntimeConfig();

  assert.equal(runtime.driver, "local-json");
  assert.equal(runtime.isPrototypePersistence, true);
  assert.equal(runtime.dataDirectory.endsWith(".codex-data"), true);

  restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
  restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
  restoreEnv("VERCEL", previousVercel);
});

test("persistence runtime falls back to a writable temp directory in serverless runtimes", async () => {
  const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
  const previousVercel = process.env.VERCEL;
  delete process.env.SWITCH_PERSISTENCE_DRIVER;
  delete process.env.SWITCH_DATA_DIRECTORY;
  process.env.VERCEL = "1";

  const { getPersistenceRuntimeConfig } = await import(
    `../src/lib/persistence/runtime.ts?test=${Date.now()}-vercel-default-persistence`
  );
  const runtime = getPersistenceRuntimeConfig();

  assert.equal(runtime.driver, "local-json");
  assert.equal(runtime.isPrototypePersistence, true);
  assert.equal(runtime.dataDirectory.includes(".codex-data"), true);
  assert.equal(runtime.dataDirectory.startsWith(tmpdir()), true);

  restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
  restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
  restoreEnv("VERCEL", previousVercel);
});

test("persistence runtime still treats explicit local-json storage as provisional", async () => {
  const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
  process.env.SWITCH_PERSISTENCE_DRIVER = "local-json";
  process.env.SWITCH_DATA_DIRECTORY = "/srv/the-switch/data";

  const { getPersistenceRuntimeConfig } = await import(
    `../src/lib/persistence/runtime.ts?test=${Date.now()}-explicit-persistence`
  );
  const runtime = getPersistenceRuntimeConfig();

  assert.equal(runtime.driver, "local-json");
  assert.equal(runtime.isPrototypePersistence, true);
  assert.equal(runtime.dataDirectory, "/srv/the-switch/data");
  assert.equal(runtime.backupDirectory, "/srv/the-switch/data/backups");
  assert.equal(runtime.primaryStorePath, "/srv/the-switch/data");
  assert.equal(runtime.backupStorePath, "/srv/the-switch/data/backups");

  restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
  restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
});

test("persistence runtime treats sqlite with an explicit data directory as the intended live path", async () => {
  const previousDriver = process.env.SWITCH_PERSISTENCE_DRIVER;
  const previousDataDirectory = process.env.SWITCH_DATA_DIRECTORY;
  process.env.SWITCH_PERSISTENCE_DRIVER = "sqlite";
  process.env.SWITCH_DATA_DIRECTORY = "/srv/the-switch/data";

  const { getPersistenceRuntimeConfig } = await import(
    `../src/lib/persistence/runtime.ts?test=${Date.now()}-sqlite-persistence`
  );
  const runtime = getPersistenceRuntimeConfig();

  assert.equal(runtime.driver, "sqlite");
  assert.equal(runtime.isPrototypePersistence, false);
  assert.equal(runtime.dataDirectory, "/srv/the-switch/data");
  assert.equal(runtime.backupDirectory, "/srv/the-switch/data/backups");
  assert.equal(runtime.primaryStorePath, "/srv/the-switch/data/switch-live.sqlite");
  assert.equal(runtime.backupStorePath, "/srv/the-switch/data/backups/switch-live.sqlite");

  restoreEnv("SWITCH_PERSISTENCE_DRIVER", previousDriver);
  restoreEnv("SWITCH_DATA_DIRECTORY", previousDataDirectory);
});
