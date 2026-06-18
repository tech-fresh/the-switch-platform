import type { AuthProvider, AuthRuntimeConfig, OidcProviderConfig } from "./types";

const DEFAULT_OIDC_SCOPES = ["openid", "profile", "email"];
const PLACEHOLDER_PATTERNS = ["replace-with", "your-live", "your-", ".example", "example.com", "changeme"];

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

function hasLiveValue(value?: string): boolean {
  if (!value) {
    return false;
  }

  const normalizedValue = value.toLowerCase();

  return !PLACEHOLDER_PATTERNS.some((pattern) => normalizedValue.includes(pattern));
}

function readScopes(): string[] {
  const rawScopes = readEnv("SWITCH_AUTH_OIDC_SCOPES");

  if (!rawScopes) {
    return DEFAULT_OIDC_SCOPES;
  }

  const scopes = rawScopes
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean);

  return scopes.length ? scopes : DEFAULT_OIDC_SCOPES;
}

function buildMissingVariables(oidcConfig: OidcProviderConfig): string[] {
  const missingVariables: string[] = [];

  if (!hasLiveValue(readEnv("SWITCH_AUTH_SECRET"))) {
    missingVariables.push("SWITCH_AUTH_SECRET");
  }

  if (!hasLiveValue(readEnv("SWITCH_AUTH_BASE_URL"))) {
    missingVariables.push("SWITCH_AUTH_BASE_URL");
  }

  if (!hasLiveValue(oidcConfig.providerId)) {
    missingVariables.push("SWITCH_AUTH_OIDC_PROVIDER_ID");
  }

  if (!hasLiveValue(oidcConfig.providerName)) {
    missingVariables.push("SWITCH_AUTH_OIDC_PROVIDER_NAME");
  }

  if (!hasLiveValue(oidcConfig.issuerUrl)) {
    missingVariables.push("SWITCH_AUTH_OIDC_ISSUER_URL");
  }

  if (!hasLiveValue(oidcConfig.clientId)) {
    missingVariables.push("SWITCH_AUTH_OIDC_CLIENT_ID");
  }

  if (!hasLiveValue(oidcConfig.clientSecret)) {
    missingVariables.push("SWITCH_AUTH_OIDC_CLIENT_SECRET");
  }

  return missingVariables;
}

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  const secret = readEnv("SWITCH_AUTH_SECRET");
  const baseUrl = readEnv("SWITCH_AUTH_BASE_URL");
  const oidcProvider: OidcProviderConfig = {
    provider: "oidc",
    providerId: readEnv("SWITCH_AUTH_OIDC_PROVIDER_ID"),
    providerName: readEnv("SWITCH_AUTH_OIDC_PROVIDER_NAME"),
    issuerUrl: readEnv("SWITCH_AUTH_OIDC_ISSUER_URL"),
    clientId: readEnv("SWITCH_AUTH_OIDC_CLIENT_ID"),
    clientSecret: readEnv("SWITCH_AUTH_OIDC_CLIENT_SECRET"),
    scopes: readScopes(),
  };
  const missingVariables = buildMissingVariables(oidcProvider);

  return {
    secret,
    baseUrl,
    oidcProvider,
    isLiveConfigured: missingVariables.length === 0,
    missingVariables,
  };
}

export function getConfiguredSessionProvider(): AuthProvider {
  return getAuthRuntimeConfig().isLiveConfigured ? "oidc" : "email-magic-link";
}
