#!/usr/bin/env node
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

assert.equal(response.status, 200, `Expected 200 from journey API, got ${response.status}`);
const payload = await response.json();
assert.ok(payload.journey?.primaryAction?.href, "Expected primaryAction.href in journey response.");
console.log("Connected journey verification passed:", payload.journey.primaryAction.label);
