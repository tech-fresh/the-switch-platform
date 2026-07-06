#!/usr/bin/env node
import "./load-script-env.mjs";

import assert from "node:assert/strict";

const baseUrl = process.env.SWITCH_LIVE_BASE_URL ?? "http://localhost:3000";
const cookie = process.env.SWITCH_LIVE_STUDENT_COOKIE ?? "";

const response = await fetch(`${baseUrl}/api/journey/next-action`, {
  headers: cookie ? { cookie } : {},
});

if (response.status === 401 && !cookie) {
  console.log("Connected journey verification skipped: no SWITCH_LIVE_STUDENT_COOKIE set.");
  process.exit(0);
}

if (response.status === 401) {
  console.error("Connected journey verification failed: student cookie invalid or expired.");
  console.error("Refresh SWITCH_LIVE_STUDENT_COOKIE via https://theswitchplatform.com/account/live-cookie-guide");
  console.error("Then re-run: npm run verify:check-live-cookies && npm run verify:connected-journey");
  process.exit(1);
}

assert.equal(response.status, 200, `Expected 200 from journey API, got ${response.status}`);
const payload = await response.json();
assert.ok(payload.journey?.primaryAction?.href, "Expected primaryAction.href in journey response.");
console.log("Connected journey verification passed:", payload.journey.primaryAction.label);
