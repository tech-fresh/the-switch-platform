import "./load-script-env.mjs";
import { assert, fetchJson, fetchText } from "./launch-utils.mjs";
import { getGovernanceRecordingConfig, recordLiveReadiness } from "./launch-governance.mjs";

const authMode = (process.env.SWITCH_AUTH_MODE ?? "oidc").trim();
const authSecret = process.env.SWITCH_AUTH_SECRET?.trim() ?? "";
const authBaseUrl = process.env.SWITCH_AUTH_BASE_URL?.trim() ?? "";
const externalHeaderSecret = process.env.SWITCH_EXTERNAL_AUTH_HEADER_SECRET?.trim() ?? "";
const persistenceDriver = (process.env.SWITCH_PERSISTENCE_DRIVER ?? "local-json").trim();
const dataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim() ?? "";
const cmsBackendMode = (process.env.SWITCH_CMS_BACKEND_MODE ?? "live").trim();
const liveBaseUrl = process.env.SWITCH_LIVE_BASE_URL?.trim() ?? "";

const configuredProviders = ["EMAIL_MAGIC_LINK", "GOOGLE", "APPLE", "MICROSOFT"].filter((prefix) =>
  [
    process.env[`SWITCH_OIDC_${prefix}_CLIENT_ID`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_CLIENT_SECRET`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_AUTHORIZATION_URL`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_TOKEN_URL`]?.trim(),
    process.env[`SWITCH_OIDC_${prefix}_USERINFO_URL`]?.trim(),
  ].every(Boolean),
);

assert(
  authMode !== "preview-cookie",
  "Live readiness failed: SWITCH_AUTH_MODE is still preview-cookie, so this environment is not on the real launch sign-in path.",
);
assert(authSecret, "Live readiness failed: SWITCH_AUTH_SECRET is missing.");

if (authMode === "oidc") {
  assert(authBaseUrl, "Live readiness failed: SWITCH_AUTH_BASE_URL is missing for redirect-based live sign-in.");
  assert(
    configuredProviders.length > 0,
    "Live readiness failed: no full OIDC provider configuration is present for the live sign-in path.",
  );
}

if (authMode === "external-header") {
  assert(
    externalHeaderSecret,
    "Live readiness failed: SWITCH_EXTERNAL_AUTH_HEADER_SECRET is missing for external-header auth mode.",
  );
}

assert(
  persistenceDriver === "sqlite",
  "Live readiness failed: SWITCH_PERSISTENCE_DRIVER must be set to sqlite for the intended shared live student-data setup.",
);
assert(
  dataDirectory,
  "Live readiness failed: SWITCH_DATA_DIRECTORY is missing, so student data is still relying on the default local runtime path.",
);
assert(
  cmsBackendMode !== "read-only",
  "Live readiness failed: SWITCH_CMS_BACKEND_MODE is still read-only, so editorial publishing is not fully live.",
);

const summaryLines = [
  `Auth mode: ${authMode}`,
  `Configured live sign-in providers: ${configuredProviders.length}`,
  `Student data path: ${dataDirectory}`,
  `Persistence driver: ${persistenceDriver}`,
  `Editorial mode: ${cmsBackendMode}`,
];

if (liveBaseUrl) {
  const normalizedBaseUrl = liveBaseUrl.replace(/\/+$/, "");
  const providersResponse = await fetchJson(`${normalizedBaseUrl}/api/auth/providers`);
  assert(
    providersResponse.response.ok,
    `Live readiness failed: ${normalizedBaseUrl}/api/auth/providers returned ${providersResponse.response.status}.`,
  );

  const providers = Array.isArray(providersResponse.json?.providers)
    ? providersResponse.json.providers
    : [];

  if (authMode === "oidc") {
    assert(
      providers.length > 0,
      "Live readiness failed: the deployed auth providers endpoint returned no live sign-in options.",
    );
  }

  const accountPage = await fetchText(`${normalizedBaseUrl}/account`);
  assert(
    accountPage.response.ok,
    `Live readiness failed: ${normalizedBaseUrl}/account returned ${accountPage.response.status}.`,
  );

  const signedOutAdmin = await fetch(`${normalizedBaseUrl}/admin`, {
    redirect: "manual",
  });
  const signedOutAdminLocation = signedOutAdmin.headers.get("location") ?? "";
  assert(
    signedOutAdmin.status >= 300 && signedOutAdmin.status < 400,
    `Live readiness failed: signed-out /admin returned ${signedOutAdmin.status} instead of redirecting.`,
  );
  assert(
    signedOutAdminLocation.includes("/login") || signedOutAdminLocation.includes("/account"),
    "Live readiness failed: signed-out /admin did not redirect toward /login.",
  );

  summaryLines.push(`Live URL checked: ${normalizedBaseUrl}`);
}

console.log("Live readiness passed:");
for (const line of summaryLines) {
  console.log(`- ${line}`);
}

if (!liveBaseUrl) {
  console.log("- Live URL checked: not supplied in this run");
  console.log("This proves environment readiness only. Set SWITCH_LIVE_BASE_URL to also probe the deployed site.");
}

const governanceRecording = await recordLiveReadiness(
  getGovernanceRecordingConfig(liveBaseUrl ? "live-readiness" : "environment-readiness"),
  `Live readiness passed for ${authMode} auth, ${persistenceDriver} persistence, and ${cmsBackendMode} editorial mode${liveBaseUrl ? ` against ${liveBaseUrl.replace(/\/+$/, "")}` : ""}.`,
).catch((error) => {
  const sqliteError =
    error?.code === "ERR_SQLITE_ERROR" ||
    error?.errcode === 14 ||
    (error instanceof Error && error.message.includes("unable to open database file"));

  if (sqliteError) {
    console.log(
      "- Launch governance was not recorded locally because SWITCH_DATA_DIRECTORY is not writable on this machine.",
    );
    console.log(
      "- Readiness still passed against the live URL. Record governance on Fly if required.",
    );
    return false;
  }

  throw error;
});

if (governanceRecording) {
  console.log("- Launch governance recording updated the environment checks and live-readiness evidence for this run.");
}
