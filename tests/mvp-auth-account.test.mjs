import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { assertAllowedMvpClickTarget } from "../scripts/canonical-mvp-routes.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("account page keeps signed-out access public and wraps signed-in students in the shell", () => {
  const source = readRepoFile("src/app/account/page.tsx");

  assert.match(source, /if \(!account\.isAuthenticated\)/);
  assert.match(source, /mark32Ui\.publicMain/);
  assert.match(source, /requireStudentAppRouteContext/);
  assert.match(source, /StudentAppShell/);
});

test("account experience reflects auth state and limits admin entry to privileged roles", () => {
  const source = readRepoFile("src/app/account/account-experience.tsx");

  assert.match(source, /Your signed-in identity and study shortcuts/);
  assert.match(source, /account\.signedOutTitle/);
  assert.match(source, /canOpenAdmin/);
  assert.match(source, /Open admin dashboard/);
  assert.match(source, /AuthAccessPathPanel/);
});

test("admin route requires editor or admin roles", () => {
  const source = readRepoFile("src/app/admin/page.tsx");

  assert.match(source, /requireRequestSessionRoles\(\["editor", "admin"\]\)/);
  assert.match(source, /AuthAccessPathPanel/);
});

test("auth session API exposes sign-out handler", () => {
  const source = readRepoFile("src/app/api/auth/session/route.ts");

  assert.match(source, /export async function DELETE/);
});

test("preview sign-in options keep canonical student and admin rehearsal providers", async () => {
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "mvp-auth-account-test";

  const { listSignInOptions } = await import(
    `../src/modules/auth/provider.ts?test=${Date.now()}-auth-account-providers`,
  );
  const options = await listSignInOptions();
  const providers = options.map((option) => option.provider);

  assert(providers.includes("email-magic-link"), "Expected student rehearsal provider.");
  assert(providers.includes("google"), "Expected admin rehearsal provider.");
});

test("account quick links stay on allowed MVP targets for guest preview", async () => {
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "mvp-auth-account-test";

  const { getAccountOverview } = await import(
    `../src/modules/auth/service.ts?test=${Date.now()}-account-quick-links`,
  );
  const account = await getAccountOverview();

  for (const link of account.quickLinks) {
    assertAllowedMvpClickTarget(link.href, `account quick link "${link.label}"`);
  }
});

test("signed-out account copy offers a login path", async () => {
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "mvp-auth-account-test";

  const { getAccountOverview } = await import(
    `../src/modules/auth/service.ts?test=${Date.now()}-signed-out-account`,
  );
  const account = await getAccountOverview();

  assert.equal(account.isAuthenticated, false);
  assert.ok(account.signedOutTitle.length > 0);
  assert.ok(account.signedOutDescription.length > 0);
});
