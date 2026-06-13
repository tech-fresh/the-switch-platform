export type AuthRuntimeMode = "preview-cookie" | "oidc" | "external-header";

export interface AuthRuntimeConfig {
  mode: AuthRuntimeMode;
  allowLocalSessionMutation: boolean;
  allowRedirectSignIn: boolean;
  sessionSecret: string;
  externalHeaderSecret: string | null;
}

const DEFAULT_PREVIEW_SESSION_SECRET = "switch-preview-session-secret";

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  const requestedMode = process.env.SWITCH_AUTH_MODE?.trim();
  const mode: AuthRuntimeMode =
    requestedMode === "oidc"
      ? "oidc"
      : requestedMode === "external-header"
        ? "external-header"
        : "preview-cookie";

  return {
    mode,
    allowLocalSessionMutation: mode === "preview-cookie",
    allowRedirectSignIn: mode === "preview-cookie" || mode === "oidc",
    sessionSecret: getAuthSessionSecret(mode),
    externalHeaderSecret: process.env.SWITCH_EXTERNAL_AUTH_HEADER_SECRET?.trim() || null,
  };
}

function getAuthSessionSecret(mode: AuthRuntimeMode): string {
  const configuredSecret = process.env.SWITCH_AUTH_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (mode === "preview-cookie") {
    return DEFAULT_PREVIEW_SESSION_SECRET;
  }

  return DEFAULT_PREVIEW_SESSION_SECRET;
}
