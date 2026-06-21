import assert from "node:assert/strict";
import test from "node:test";

test("vercel blob persistence helpers normalize and join logical paths", async () => {
  const {
    isVercelBlobPersistencePath,
    normalizeVercelBlobPersistencePath,
    joinVercelBlobPersistencePath,
    getVercelBlobPathname,
  } = await import(`../src/lib/persistence/vercel-blob.ts?test=${Date.now()}-blob-paths`);

  assert.equal(isVercelBlobPersistencePath("vercel-blob://switch-live-data"), true);
  assert.equal(isVercelBlobPersistencePath("/srv/switch/data"), false);
  assert.equal(
    normalizeVercelBlobPersistencePath("vercel-blob://switch-live-data/"),
    "vercel-blob://switch-live-data",
  );
  assert.equal(
    joinVercelBlobPersistencePath("vercel-blob://switch-live-data", "backups", "switch-live.sqlite"),
    "vercel-blob://switch-live-data/backups/switch-live.sqlite",
  );
  assert.equal(
    getVercelBlobPathname("vercel-blob://switch-live-data/switch-live.sqlite"),
    "switch-live-data/switch-live.sqlite",
  );
});
