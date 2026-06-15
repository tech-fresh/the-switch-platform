import test from "node:test";
import assert from "node:assert/strict";

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

test("auth runtime defaults to oidc mode when a session secret is configured", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  delete process.env.SWITCH_AUTH_MODE;
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-default`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "oidc");
  assert.equal(runtime.allowLocalSessionMutation, false);
  assert.equal(runtime.allowRedirectSignIn, true);
  assert.equal(runtime.sessionSecret, "test-auth-secret");

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});

test("auth runtime keeps the preview secret fallback only in preview-cookie mode", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  delete process.env.SWITCH_AUTH_SECRET;

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-preview`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "preview-cookie");
  assert.equal(runtime.allowLocalSessionMutation, true);
  assert.equal(runtime.allowRedirectSignIn, true);
  assert.equal(runtime.sessionSecret, "switch-preview-session-secret");

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});

test("auth runtime rejects oidc mode without an explicit session secret", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  process.env.SWITCH_AUTH_MODE = "oidc";
  delete process.env.SWITCH_AUTH_SECRET;

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-oidc-missing-secret`);

  assert.throws(() => getAuthRuntimeConfig(), /SWITCH_AUTH_SECRET must be configured/);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});

test("auth runtime can switch into external-header mode with an explicit session secret", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  process.env.SWITCH_AUTH_MODE = "external-header";
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-external`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "external-header");
  assert.equal(runtime.allowLocalSessionMutation, false);
  assert.equal(runtime.allowRedirectSignIn, false);
  assert.equal(runtime.sessionSecret, "test-auth-secret");

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});

test("auth runtime can switch into oidc mode with an explicit session secret", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  process.env.SWITCH_AUTH_MODE = "oidc";
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";

  const { getAuthRuntimeConfig } = await import(`../src/modules/auth/runtime.ts?test=${Date.now()}-oidc`);
  const runtime = getAuthRuntimeConfig();

  assert.equal(runtime.mode, "oidc");
  assert.equal(runtime.allowLocalSessionMutation, false);
  assert.equal(runtime.allowRedirectSignIn, true);
  assert.equal(runtime.sessionSecret, "test-auth-secret");

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});
