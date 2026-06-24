import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("login route exposes the unified sign-in shell", () => {
  const loginPage = readFileSync(path.join(repoRoot, "src/app/login/page.tsx"), "utf8");
  const signInCard = readFileSync(path.join(repoRoot, "src/components/unified-sign-in-card.tsx"), "utf8");

  assert.match(loginPage, /UnifiedSignInCard/);
  assert.match(signInCard, /Welcome back!/);
  assert.match(signInCard, /Continue with \$\{providerLabel/);
  assert.match(signInCard, /Continue with email/);
  assert.match(signInCard, /One sign-in for students and admin/);
});

test("site navigation links Log in to the dedicated login route", () => {
  const marketingHeader = readFileSync(
    path.join(repoRoot, "src/components/mock-idea/marketing-site-header.tsx"),
    "utf8",
  );

  assert.match(marketingHeader, /\/login\?reauth=1/);
  assert.match(marketingHeader, /Log in/);
});

test("protected routes redirect signed-out users to the login page", () => {
  const authRequest = readFileSync(path.join(repoRoot, "src/modules/auth/request.ts"), "utf8");

  assert.match(authRequest, /redirectTo = "\/login"/);
});
