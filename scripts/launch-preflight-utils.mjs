export function getLaunchPreflightReport(env = process.env) {
  const authMode = (env.SWITCH_AUTH_MODE ?? "oidc").trim();
  const missing = [];

  if (authMode === "preview-cookie") {
    missing.push("SWITCH_AUTH_MODE (must be oidc or external-header for live launch)");
  }

  requireValue(missing, env, "SWITCH_AUTH_SECRET");
  requireValue(missing, env, "SWITCH_PERSISTENCE_DRIVER");
  requireValue(missing, env, "SWITCH_DATA_DIRECTORY");
  requireValue(missing, env, "SWITCH_CMS_BACKEND_MODE");
  requireValue(missing, env, "SWITCH_LIVE_BASE_URL");
  requireValue(missing, env, "SWITCH_RECORD_GOVERNANCE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_ENVIRONMENT");
  requireValue(missing, env, "SWITCH_LAUNCH_APPROVER");
  requireValue(missing, env, "SWITCH_LAUNCH_STOP_AUTHORITY");
  requireValue(missing, env, "SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE");
  requireValue(missing, env, "SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE");

  if (authMode === "oidc") {
    requireValue(missing, env, "SWITCH_AUTH_BASE_URL");
    requireAnyProvider(missing, env);
    requireValue(missing, env, "SWITCH_LIVE_STUDENT_COOKIE");
    requireValue(missing, env, "SWITCH_LIVE_ADMIN_COOKIE");
  }

  if (authMode === "external-header") {
    requireValue(missing, env, "SWITCH_EXTERNAL_AUTH_HEADER_SECRET");
    requireValue(missing, env, "SWITCH_LIVE_STUDENT_USER_ID");
    requireValue(missing, env, "SWITCH_LIVE_STUDENT_DISPLAY_NAME");
    requireValue(missing, env, "SWITCH_LIVE_STUDENT_EMAIL");
    requireValue(missing, env, "SWITCH_LIVE_ADMIN_USER_ID");
    requireValue(missing, env, "SWITCH_LIVE_ADMIN_DISPLAY_NAME");
    requireValue(missing, env, "SWITCH_LIVE_ADMIN_EMAIL");
  }

  return {
    authMode,
    missing,
    ready: missing.length === 0,
  };
}

function requireValue(missing, env, key) {
  if (!env[key]?.trim()) {
    missing.push(key);
  }
}

function requireAnyProvider(missing, env) {
  const providerPrefixes = [
    "SWITCH_OIDC_EMAIL_MAGIC_LINK",
    "SWITCH_OIDC_GOOGLE",
    "SWITCH_OIDC_APPLE",
  ];
  const hasProvider = providerPrefixes.some((prefix) =>
    [
      `${prefix}_CLIENT_ID`,
      `${prefix}_CLIENT_SECRET`,
      `${prefix}_AUTHORIZATION_URL`,
      `${prefix}_TOKEN_URL`,
      `${prefix}_USERINFO_URL`,
    ].every((key) => env[key]?.trim()),
  );

  if (!hasProvider) {
    missing.push("ONE_COMPLETE_OIDC_PROVIDER_BLOCK");
  }
}
