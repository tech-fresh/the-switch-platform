import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import test from "node:test";

async function withTempDir(callback) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "switch-persistence-"));

  try {
    await callback(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

test("json file store mirrors writes into the backup directory", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const { createJsonFileCollectionStore } = await import(
      `../src/lib/persistence/json-file-store.ts?test=${Date.now()}-backup-write`
    );
    const store = createJsonFileCollectionStore({
      filename: "saved-progress.json",
      collectionKey: "records",
      directory: dataDirectory,
      backupDirectory,
    });

    await store.write([{ id: "record-1", status: "paused" }]);

    const activePayload = JSON.parse(
      await readFile(path.join(dataDirectory, "saved-progress.json"), "utf8"),
    );
    const backupPayload = JSON.parse(
      await readFile(path.join(backupDirectory, "saved-progress.json"), "utf8"),
    );

    assert.deepEqual(activePayload.records, [{ id: "record-1", status: "paused" }]);
    assert.deepEqual(backupPayload.records, activePayload.records);
  });
});

test("persistence recovery status is ready when active and backup files match", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const { createJsonFileCollectionStore } = await import(
      `../src/lib/persistence/json-file-store.ts?test=${Date.now()}-recovery-ready-store`
    );
    const { getPersistenceRecoveryStatus } = await import(
      `../src/lib/persistence/recovery.ts?test=${Date.now()}-recovery-ready`
    );
    const store = createJsonFileCollectionStore({
      filename: "saved-progress.json",
      collectionKey: "records",
      directory: dataDirectory,
      backupDirectory,
    });

    await store.write([{ id: "record-2", status: "submitted" }]);

    const status = await getPersistenceRecoveryStatus({
      driver: "local-json",
      dataDirectory,
      backupDirectory,
      isPrototypePersistence: true,
    });

    assert.equal(status.isReady, true);
    assert.equal(status.issueCount, 0);
    assert.equal(
      status.files.every((file) => file.issue === null),
      true,
    );
  });
});

test("persistence recovery status warns when backup files drift from active data", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const { createJsonFileCollectionStore } = await import(
      `../src/lib/persistence/json-file-store.ts?test=${Date.now()}-recovery-drift-store`
    );
    const { getPersistenceRecoveryStatus } = await import(
      `../src/lib/persistence/recovery.ts?test=${Date.now()}-recovery-drift`
    );
    const store = createJsonFileCollectionStore({
      filename: "saved-progress.json",
      collectionKey: "records",
      directory: dataDirectory,
      backupDirectory,
    });

    await store.write([{ id: "record-3", status: "in-progress" }]);
    await writeFile(
      path.join(backupDirectory, "saved-progress.json"),
      JSON.stringify({
        records: [{ id: "record-3", status: "paused" }],
      }, null, 2),
      "utf8",
    );

    const status = await getPersistenceRecoveryStatus({
      driver: "local-json",
      dataDirectory,
      backupDirectory,
      isPrototypePersistence: true,
    });
    const savedProgressFile = status.files.find((file) => file.filename === "saved-progress.json");

    assert.equal(status.isReady, false);
    assert.equal(savedProgressFile?.issue, "backup-drift");
  });
});

test("sqlite store mirrors writes into the backup database", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const databasePath = path.join(dataDirectory, "switch-live.sqlite");
    const backupDatabasePath = path.join(backupDirectory, "switch-live.sqlite");
    const { createSqliteCollectionStore } = await import(
      `../src/lib/persistence/sqlite-store.ts?test=${Date.now()}-sqlite-backup-write`
    );
    const store = createSqliteCollectionStore({
      collectionKey: "saved-progress.records",
      databasePath,
      backupDatabasePath,
    });

    await store.write([{ id: "record-sqlite-1", status: "paused" }]);

    const activeBytes = await readFile(databasePath);
    const backupBytes = await readFile(backupDatabasePath);

    assert.equal(activeBytes.equals(backupBytes), true);
  });
});

test("sqlite persistence recovery status is ready when active and backup databases match", async () => {
  await withTempDir(async (tempDir) => {
    const dataDirectory = path.join(tempDir, "data");
    const backupDirectory = path.join(dataDirectory, "backups");
    const databasePath = path.join(dataDirectory, "switch-live.sqlite");
    const backupDatabasePath = path.join(backupDirectory, "switch-live.sqlite");
    const { createSqliteCollectionStore } = await import(
      `../src/lib/persistence/sqlite-store.ts?test=${Date.now()}-sqlite-recovery-ready-store`
    );
    const { getPersistenceRecoveryStatus } = await import(
      `../src/lib/persistence/recovery.ts?test=${Date.now()}-sqlite-recovery-ready`
    );
    const store = createSqliteCollectionStore({
      collectionKey: "saved-progress.records",
      databasePath,
      backupDatabasePath,
    });

    await store.write([{ id: "record-sqlite-2", status: "submitted" }]);

    const status = await getPersistenceRecoveryStatus({
      driver: "sqlite",
      dataDirectory,
      backupDirectory,
      primaryStorePath: databasePath,
      backupStorePath: backupDatabasePath,
      isPrototypePersistence: false,
    });

    assert.equal(status.isReady, true);
    assert.equal(status.issueCount, 0);
    assert.equal(status.files[0]?.issue, null);
  });
});
