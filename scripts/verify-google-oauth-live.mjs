import "./load-script-env.mjs";

import { assert, fetchJson } from "./launch-utils.mjs";

const liveBaseUrl = (process.env.SWITCH_LIVE_BASE_URL ?? process.env.SWITCH_AUTH_BASE_URL ?? "").replace(/\/+$/, "");
const authBaseUrl = (process.env.SWITCH_AUTH_BASE_URL ?? liveBaseUrl).replace(/\/+$/, "");

assert(liveBaseUrl, "SWITCH_LIVE_BASE_URL or SWITCH_AUTH_BASE_URL is required.");
assert(authBaseUrl, "SWITCH_AUTH_BASE_URL is required.");

const expectedRedirectUri = `${authBaseUrl}/api/auth/callback`;

console.log("Google OAuth live check:");
console.log(`- Live base URL: ${liveBaseUrl}`);
console.log(`- Auth base URL: ${authBaseUrl}`);
console.log(`- Expected redirect URI: ${expectedRedirectUri}`);

const providersResponse = await fetchJson(`${liveBaseUrl}/api/auth/providers`);
assert(
  providersResponse.response.ok,
  `Expected /api/auth/providers to return 200, received ${providersResponse.response.status}.`,
);

const providers = Array.isArray(providersResponse.json?.providers) ? providersResponse.json.providers : [];
const googleProvider = providers.find((provider) => /google/i.test(provider?.id ?? provider?.label ?? ""));

assert(googleProvider, "No Google provider is exposed on the live site.");

const startUrl = new URL(`${liveBaseUrl}/api/auth/start`);
startUrl.searchParams.set("provider", googleProvider.id ?? "google");
startUrl.searchParams.set("returnTo", "/account");

const startResponse = await fetch(startUrl.toString(), { redirect: "manual" });
const location = startResponse.headers.get("location") ?? "";

assert(
  startResponse.status >= 300 && startResponse.status < 400,
  `Expected /api/auth/start to redirect, received ${startResponse.status}.`,
);
assert(location.includes("accounts.google.com"), "Auth start did not redirect to Google.");
assert(
  location.includes(encodeURIComponent(expectedRedirectUri)) || location.includes(expectedRedirectUri),
  `Google redirect_uri does not match ${expectedRedirectUri}. Check Google Cloud Console OAuth client settings.`,
);

console.log("- Live providers endpoint: ok");
console.log("- Auth start redirects to Google: ok");
console.log("- redirect_uri matches auth base URL: ok");
console.log("\nGoogle OAuth live check passed.");
console.log("If browser sign-in still fails, add these in Google Cloud Console:");
console.log(`  JavaScript origin: ${authBaseUrl}`);
console.log(`  Redirect URI:      ${expectedRedirectUri}`);
