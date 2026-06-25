import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAuthAccessPathSummary,
  mapRolesFromEmail,
  maskAllowlistEmail,
} from "../src/modules/auth/allowlist-service.ts";

test("maskAllowlistEmail hides most of the local part", () => {
  assert.equal(maskAllowlistEmail("operator@example.com"), "o***@example.com");
});

test("mapRolesFromEmail uses admin and editor allowlists", () => {
  const previousAdmin = process.env.SWITCH_AUTH_ADMIN_EMAILS;
  const previousEditor = process.env.SWITCH_AUTH_EDITOR_EMAILS;

  process.env.SWITCH_AUTH_ADMIN_EMAILS = "admin@example.com";
  process.env.SWITCH_AUTH_EDITOR_EMAILS = "editor@example.com,admin@example.com";

  try {
    assert.deepEqual(mapRolesFromEmail("admin@example.com"), ["editor", "admin"]);
    assert.deepEqual(mapRolesFromEmail("editor@example.com"), ["editor"]);
    assert.deepEqual(mapRolesFromEmail("student@example.com"), []);
  } finally {
    process.env.SWITCH_AUTH_ADMIN_EMAILS = previousAdmin;
    process.env.SWITCH_AUTH_EDITOR_EMAILS = previousEditor;
  }
});

test("buildAuthAccessPathSummary exposes allowlist counts for signed-out users", () => {
  const previousAdmin = process.env.SWITCH_AUTH_ADMIN_EMAILS;
  process.env.SWITCH_AUTH_ADMIN_EMAILS = "admin@example.com";

  try {
    const summary = buildAuthAccessPathSummary({ status: "signed-out" });

    assert.equal(summary.adminAllowlistCount, 1);
    assert.equal(summary.canOpenAdmin, false);
    assert.equal(summary.allowlistEntries.length, 0);
  } finally {
    process.env.SWITCH_AUTH_ADMIN_EMAILS = previousAdmin;
  }
});
