import test from "node:test";
import assert from "node:assert/strict";

test("runRouteWithErrorBoundary returns successful data with a 200 status", async () => {
  const { runRouteWithErrorBoundary } = await import("../src/lib/server/route-error.ts");

  const result = await runRouteWithErrorBoundary({
    run: async () => ({ ok: true, count: 2 }),
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.data, { ok: true, count: 2 });
  assert.equal(result.error, undefined);
});

test("runRouteWithErrorBoundary converts thrown errors into route-safe failures", async () => {
  const { runRouteWithErrorBoundary } = await import("../src/lib/server/route-error.ts");

  const result = await runRouteWithErrorBoundary({
    run: async () => {
      throw new Error("Broken route");
    },
    status: 409,
  });

  assert.equal(result.status, 409);
  assert.equal(result.error, "Broken route");
});

test("runRouteWithErrorBoundary falls back to the provided bad-request message", async () => {
  const { runRouteWithErrorBoundary } = await import("../src/lib/server/route-error.ts");

  const result = await runRouteWithErrorBoundary({
    run: async () => {
      throw "non-error";
    },
    badRequestMessage: "Unknown route failure",
  });

  assert.equal(result.status, 400);
  assert.equal(result.error, "Unknown route failure");
});
