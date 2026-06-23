import "./load-script-env.mjs";

import { assert, fetchJson } from "./launch-utils.mjs";

const liveBaseUrl = (process.env.SWITCH_LIVE_BASE_URL ?? process.env.SWITCH_AUTH_BASE_URL ?? "").replace(/\/+$/, "");
const authBaseUrl = (process.env.SWITCH_AUTH_BASE_URL ?? liveBaseUrl).replace(/\/+$/, "");

assert(liveBaseUrl, "SWITCH_LIVE_BASE_URL or SWITCH_AUTH_BASE_URL is required.");
assert(authBaseUrl, "SWITCH_AUTH_BASE_URL is required.");

const expectedRedirectUri = `${authBaseUrl}/api/auth/callback`;

console.log("Microsoft OAuth live check:");
console.log(`- Live base URL: ${liveBaseUrl}`);
console.log(`- Auth base URL: ${authBaseUrl}`);
console.log(`- Expected redirect URI: ${expectedRedirectUri}`);

const providersResponse = await fetchJson(`${liveBaseUrl}/api/auth/providers`);
assert(
  providersResponse.response.ok,
  `Expected /api/auth/providers to return 200, received ${providersResponse.response.status}.`,
);

const providers = Array.isArray(providersResponse.json?.providers) ? providersResponse.json.providers : [];
const microsoftProvider = providers.find((provider) => provider?.provider === "microsoft");

assert(
  microsoftProvider,
  "No Microsoft provider is exposed on the live site. Add the full SWITCH_OIDC_MICROSOFT_* block and redeploy.",
);

const startUrl = new URL(`${liveBaseUrl}/api/auth/start`);
startUrl.searchParams.set("provider", "microsoft");
startUrl.searchParams.set("returnTo", "/login");

const startResponse = await fetch(startUrl.toString(), { redirect: "manual" });
const location = startResponse.headers.get("location") ?? "";

assert(
  startResponse.status >= 300 && startResponse.status < 400,
  `Expected /api/auth/start to redirect, received ${startResponse.status}.`,
);
assert(
  location.includes("login.microsoftonline.com"),
  "Auth start did not redirect to Microsoft.",
);
assert(
  location.includes(encodeURIComponent(expectedRedirectUri)) || location.includes(expectedRedirectUri),
  `Microsoft redirect_uri does not match ${expectedRedirectUri}. Check Azure App Registration redirect settings.`,
);

console.log("- Live providers endpoint: ok");
console.log("- Auth start redirects to Microsoft: ok");
console.log("- redirect_uri matches auth base URL: ok");
console.log("\nMicrosoft OAuth live check passed.");
console.log("If browser sign-in still fails, add this redirect URI in Azure Portal:");
console.log(`  Redirect URI: ${expectedRedirectUri}`);
