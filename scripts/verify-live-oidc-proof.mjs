import "./load-script-env.mjs";

import {
  assert,
  fetchJson,
  fetchResponse,
  fetchText,
} from "./launch-utils.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

const configuredProviderOverride = (process.env.SWITCH_LIVE_OIDC_PROVIDER ?? "").trim();
const {
  baseUrl,
  studentHeaders,
  authMode,
  walkthroughMode,
  usingLaunchVerificationHeaders,
} = getLiveWalkthroughConfig(process.env, {
  walkthroughMode: "real-auth",
});

assert(authMode === "oidc", "verify:live-oidc-proof requires SWITCH_AUTH_MODE=oidc.");
assert(
  usingLaunchVerificationHeaders === false,
  "verify:live-oidc-proof requires real auth and cannot run with launch-verification headers.",
);

console.log(`Live OIDC proof target: ${baseUrl}`);
console.log(`Proof mode: ${walkthroughMode}`);

console.log("Checking configured providers...");
const providersResponse = await fetchJson(`${baseUrl}/api/auth/providers`);
assert(
  providersResponse.response.ok,
  `Expected /api/auth/providers to return 200, received ${providersResponse.response.status}.`,
);
assert(
  providersResponse.json?.readiness?.mode === "oidc",
  `Expected auth readiness mode oidc, received ${providersResponse.json?.readiness?.mode ?? "unknown"}.`,
);
assert(
  Array.isArray(providersResponse.json?.providers) && providersResponse.json.providers.length > 0,
  "Expected /api/auth/providers to include at least one configured provider.",
);
const configuredProviders = providersResponse.json.providers
  .map((provider) => provider?.provider?.trim())
  .filter(Boolean);
const expectedProvider =
  configuredProviderOverride ||
  (configuredProviders.length === 1 ? configuredProviders[0] : "");
assert(
  expectedProvider,
  "SWITCH_LIVE_OIDC_PROVIDER is required when more than one live OIDC provider is configured.",
);
assert(
  configuredProviders.includes(expectedProvider),
  `Expected /api/auth/providers to include "${expectedProvider}".`,
);
console.log(`Using OIDC provider proof target: ${expectedProvider}`);

console.log("Checking auth start redirects to the provider...");
const authStart = await fetchResponse(
  `${baseUrl}/api/auth/start?provider=${encodeURIComponent(expectedProvider)}&returnTo=${encodeURIComponent("/dashboard")}`,
  {
    redirect: "manual",
  },
);
const authStartLocation = authStart.headers.get("location") ?? "";
assert(
  authStart.status >= 300 && authStart.status < 400,
  `Expected /api/auth/start to redirect, received ${authStart.status}.`,
);
assert(
  authStartLocation.length > 0 && !authStartLocation.startsWith(baseUrl),
  "Expected /api/auth/start to redirect to the external OIDC provider.",
);
assert(
  decodeURIComponent(authStartLocation).includes("/api/auth/callback"),
  "Expected provider redirect to reference /api/auth/callback.",
);

console.log("Checking direct session mutation is blocked in oidc mode...");
const blockedSessionCreate = await fetchJson(`${baseUrl}/api/auth/session`, {
  method: "POST",
  headers: {
    origin: baseUrl,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ provider: expectedProvider }),
});
assert(
  blockedSessionCreate.response.status === 409,
  `Expected POST /api/auth/session to return 409 in oidc mode, received ${blockedSessionCreate.response.status}.`,
);

console.log("Checking authenticated real session...");
const sessionResponse = await fetchJson(`${baseUrl}/api/auth/session`, {
  headers: studentHeaders,
});
assert(
  sessionResponse.response.ok,
  `Expected authenticated /api/auth/session to return 200, received ${sessionResponse.response.status}.`,
);
assert(
  sessionResponse.json?.session?.status === "authenticated",
  "Expected /api/auth/session to report an authenticated session.",
);
assert(
  sessionResponse.json?.session?.provider === expectedProvider,
  `Expected authenticated session provider "${expectedProvider}", received "${sessionResponse.json?.session?.provider ?? "unknown"}".`,
);

console.log("Checking protected signed-in surfaces...");
const accountPage = await fetchText(`${baseUrl}/account`, {
  headers: studentHeaders,
});
assert(
  accountPage.response.ok,
  `Expected authenticated /account to return 200, received ${accountPage.response.status}.`,
);

const protectedApi = await fetchJson(`${baseUrl}/api/results/overview`, {
  headers: studentHeaders,
});
assert(
  protectedApi.response.ok,
  `Expected authenticated /api/results/overview to return 200, received ${protectedApi.response.status}.`,
);

console.log("Checking real sign-out...");
const signOutResponse = await fetchJson(`${baseUrl}/api/auth/session`, {
  method: "DELETE",
  headers: {
    ...studentHeaders,
    origin: baseUrl,
    Accept: "application/json",
  },
});
assert(
  signOutResponse.response.ok,
  `Expected DELETE /api/auth/session to return 200, received ${signOutResponse.response.status}.`,
);
assert(
  signOutResponse.json?.session?.status === "signed-out",
  "Expected sign-out response to report a signed-out session.",
);
const clearedCookieHeader = signOutResponse.response.headers.get("set-cookie") ?? "";
assert(
  clearedCookieHeader.includes("switch_auth_session="),
  "Expected sign-out response to clear the auth session cookie.",
);
const clearedCookie = clearedCookieHeader.split(";", 1)[0] || "switch_auth_session=";

console.log("Checking protected routes are blocked after sign-out...");
const signedOutApi = await fetchJson(`${baseUrl}/api/results/overview`, {
  headers: {
    cookie: clearedCookie,
  },
});
assert(
  signedOutApi.response.status === 401,
  `Expected signed-out /api/results/overview to return 401, received ${signedOutApi.response.status}.`,
);

const signedOutDashboard = await fetchResponse(`${baseUrl}/dashboard`, {
  headers: {
    cookie: clearedCookie,
  },
  redirect: "manual",
});
const signedOutDashboardLocation = signedOutDashboard.headers.get("location") ?? "";
assert(
  signedOutDashboard.status >= 300 && signedOutDashboard.status < 400,
  `Expected signed-out /dashboard to redirect, received ${signedOutDashboard.status}.`,
);
assert(
  signedOutDashboardLocation.includes("/login"),
  `Expected signed-out /dashboard to redirect to /login, received ${signedOutDashboardLocation || "no location"}.`,
);

console.log("Live OIDC proof passed:");
console.log("- /api/auth/start redirected to the configured external provider");
console.log("- Direct local session mutation stayed blocked in oidc mode");
console.log("- A real authenticated oidc session cookie reached protected account and results surfaces");
console.log("- Sign-out cleared the session and protected routes were denied afterward");
console.log(
  "- In oidc mode, the authenticated session implies the callback path created the cookie because local session creation is disabled.",
);
