import "./load-script-env.mjs";

import { fetchJson } from "./launch-utils.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

const { baseUrl, studentHeaders, adminHeaders, authMode } = getLiveWalkthroughConfig(
  {
    ...process.env,
    SWITCH_LAUNCH_VERIFICATION_SECRET: "",
    SWITCH_LIVE_WALKTHROUGH_MODE: "real-auth",
  },
  {
    walkthroughMode: "real-auth",
  },
);

console.log(`Live auth cookie check: ${baseUrl}`);
console.log(`Auth mode: ${authMode}`);

let failed = false;

for (const [label, headers] of [
  ["student", studentHeaders],
  ["admin", adminHeaders],
]) {
  const session = await fetchJson(`${baseUrl}/api/auth/session`, { headers });
  const authenticated = session.json?.session?.status === "authenticated";

  if (!session.response.ok || !authenticated) {
    failed = true;
    console.error(
      `- ${label}: invalid or expired (HTTP ${session.response.status}, status=${session.json?.session?.status ?? "unknown"})`,
    );
    continue;
  }

  const user = session.json.session.user;
  console.log(
    `- ${label}: ok (${user?.email ?? "unknown email"}, roles=${(user?.roles ?? []).join(",") || "none"})`,
  );
}

if (failed) {
  console.error("");
  console.error("Refresh live cookies before Priority A closeout:");
  console.error("1. Sign in on https://theswitchplatform.com/login as the student walkthrough user.");
  console.error("2. Copy switch_auth_session from browser devtools (name=value only).");
  console.error("3. Update SWITCH_LIVE_STUDENT_COOKIE in .env.local.");
  console.error("4. Repeat for an admin-capable account into SWITCH_LIVE_ADMIN_COOKIE.");
  console.error("5. Guide: https://theswitchplatform.com/account/live-cookie-guide");
  console.error("6. Re-run: npm run verify:check-live-cookies");
  process.exit(1);
}

console.log("Live auth cookies are valid for real-auth closeout.");
