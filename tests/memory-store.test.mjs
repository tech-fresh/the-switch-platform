import test from "node:test";
import assert from "node:assert/strict";

test("memory collection store reads back written records", async () => {
  const { createMemoryCollectionStore, resetMemoryCollections } = await import(
    "../src/lib/persistence/memory-store.ts"
  );

  resetMemoryCollections();
  const store = createMemoryCollectionStore("phase-1.test.records");

  await store.write([{ id: "a" }, { id: "b" }]);

  const records = await store.read();
  assert.deepEqual(records, [{ id: "a" }, { id: "b" }]);

  resetMemoryCollections();
});

test("memory collection store returns copies instead of mutating internal state", async () => {
  const { createMemoryCollectionStore, resetMemoryCollections } = await import(
    "../src/lib/persistence/memory-store.ts"
  );

  resetMemoryCollections();
  const store = createMemoryCollectionStore("phase-1.test.copy-check");
  await store.write([{ id: "original" }]);

  const records = await store.read();
  records.push({ id: "mutated-locally" });

  const reread = await store.read();
  assert.deepEqual(reread, [{ id: "original" }]);

  resetMemoryCollections();
});
