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

test("auth readiness reports provider setup is still needed when oidc has no configured providers", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  const previousClientId = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID;
  const previousClientSecret = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET;
  const previousAuthorizationUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL;
  const previousTokenUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL;
  const previousUserInfoUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL;
  process.env.SWITCH_AUTH_MODE = "oidc";
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";
  delete process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID;
  delete process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET;
  delete process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL;
  delete process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL;
  delete process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL;

  const { getAuthReadinessSummary } = await import(`../src/modules/auth/provider.ts?test=${Date.now()}-readiness-needs-provider`);
  const summary = getAuthReadinessSummary();

  assert.equal(summary.mode, "oidc");
  assert.equal(summary.status, "needs-provider-setup");
  assert.equal(summary.configuredProviderCount, 0);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID", previousClientId);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET", previousClientSecret);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL", previousAuthorizationUrl);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL", previousTokenUrl);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL", previousUserInfoUrl);
});

test("auth readiness reports ready when oidc has a full configured provider", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  const previousClientId = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID;
  const previousClientSecret = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET;
  const previousAuthorizationUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL;
  const previousTokenUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL;
  const previousUserInfoUrl = process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL;
  process.env.SWITCH_AUTH_MODE = "oidc";
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";
  process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID = "client-id";
  process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET = "client-secret";
  process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL = "https://id.example.com/authorize";
  process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL = "https://id.example.com/token";
  process.env.SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL = "https://id.example.com/userinfo";

  const { getAuthReadinessSummary } = await import(`../src/modules/auth/provider.ts?test=${Date.now()}-readiness-ready`);
  const summary = getAuthReadinessSummary();

  assert.equal(summary.mode, "oidc");
  assert.equal(summary.status, "ready");
  assert.equal(summary.configuredProviderCount, 1);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_ID", previousClientId);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_CLIENT_SECRET", previousClientSecret);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_AUTHORIZATION_URL", previousAuthorizationUrl);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_TOKEN_URL", previousTokenUrl);
  restoreEnv("SWITCH_OIDC_EMAIL_MAGIC_LINK_USERINFO_URL", previousUserInfoUrl);
});

test("auth readiness reports ready when oidc has a full configured microsoft provider", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  const previousClientId = process.env.SWITCH_OIDC_MICROSOFT_CLIENT_ID;
  const previousClientSecret = process.env.SWITCH_OIDC_MICROSOFT_CLIENT_SECRET;
  const previousAuthorizationUrl = process.env.SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL;
  const previousTokenUrl = process.env.SWITCH_OIDC_MICROSOFT_TOKEN_URL;
  const previousUserInfoUrl = process.env.SWITCH_OIDC_MICROSOFT_USERINFO_URL;
  process.env.SWITCH_AUTH_MODE = "oidc";
  process.env.SWITCH_AUTH_SECRET = "test-auth-secret";
  process.env.SWITCH_OIDC_MICROSOFT_CLIENT_ID = "microsoft-client-id";
  process.env.SWITCH_OIDC_MICROSOFT_CLIENT_SECRET = "microsoft-client-secret";
  process.env.SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
  process.env.SWITCH_OIDC_MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  process.env.SWITCH_OIDC_MICROSOFT_USERINFO_URL = "https://graph.microsoft.com/oidc/userinfo";

  const { getAuthReadinessSummary } = await import(`../src/modules/auth/provider.ts?test=${Date.now()}-readiness-microsoft`);
  const summary = getAuthReadinessSummary();

  assert.equal(summary.mode, "oidc");
  assert.equal(summary.status, "ready");
  assert.equal(summary.configuredProviderCount, 1);

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
  restoreEnv("SWITCH_OIDC_MICROSOFT_CLIENT_ID", previousClientId);
  restoreEnv("SWITCH_OIDC_MICROSOFT_CLIENT_SECRET", previousClientSecret);
  restoreEnv("SWITCH_OIDC_MICROSOFT_AUTHORIZATION_URL", previousAuthorizationUrl);
  restoreEnv("SWITCH_OIDC_MICROSOFT_TOKEN_URL", previousTokenUrl);
  restoreEnv("SWITCH_OIDC_MICROSOFT_USERINFO_URL", previousUserInfoUrl);
});
