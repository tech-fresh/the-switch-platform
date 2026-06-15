import test from "node:test";
import assert from "node:assert/strict";

test("cms runtime defaults to live backend mode", async () => {
  const previousMode = process.env.SWITCH_CMS_BACKEND_MODE;
  delete process.env.SWITCH_CMS_BACKEND_MODE;

  const { getCmsRuntimeConfig } = await import("../src/modules/cms/runtime.ts");
  const runtime = getCmsRuntimeConfig();

  assert.equal(runtime.backendMode, "live");

  if (previousMode === undefined) {
    delete process.env.SWITCH_CMS_BACKEND_MODE;
  } else {
    process.env.SWITCH_CMS_BACKEND_MODE = previousMode;
  }
});

test("cms runtime can switch into read-only backend mode", async () => {
  const previousMode = process.env.SWITCH_CMS_BACKEND_MODE;
  process.env.SWITCH_CMS_BACKEND_MODE = "read-only";

  const { getCmsRuntimeConfig } = await import("../src/modules/cms/runtime.ts");
  const runtime = getCmsRuntimeConfig();

  assert.equal(runtime.backendMode, "read-only");

  if (previousMode === undefined) {
    delete process.env.SWITCH_CMS_BACKEND_MODE;
  } else {
    process.env.SWITCH_CMS_BACKEND_MODE = previousMode;
  }
});
