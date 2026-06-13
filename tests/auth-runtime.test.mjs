import test from "node:test";
import assert from "node:assert/strict";

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

test("auth runtime defaults to preview-cookie mode", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  delete process.env.SWITCH_AUTH_MODE;

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-default`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "preview-cookie");
  assert.equal(runtime.allowLocalSessionMutation, true);
  assert.equal(runtime.allowRedirectSignIn, true);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
});

test("auth runtime can switch into external-header mode", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  process.env.SWITCH_AUTH_MODE = "external-header";

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-external`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "external-header");
  assert.equal(runtime.allowLocalSessionMutation, false);
  assert.equal(runtime.allowRedirectSignIn, false);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
});

test("auth runtime can switch into oidc mode", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  process.env.SWITCH_AUTH_MODE = "oidc";

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-oidc`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "oidc");
  assert.equal(runtime.allowLocalSessionMutation, false);
  assert.equal(runtime.allowRedirectSignIn, true);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
});
