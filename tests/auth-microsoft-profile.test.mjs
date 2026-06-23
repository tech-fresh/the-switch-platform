import test from "node:test";
import assert from "node:assert/strict";

test("mapOidcProfileToAuthUser resolves Microsoft mail and userPrincipalName fields", async () => {
  const { mapOidcProfileToAuthUser } = await import(
    `../src/modules/auth/provider.ts?test=${Date.now()}-microsoft-profile`
  );

  const user = mapOidcProfileToAuthUser({
    sub: "microsoft-user-123",
    mail: "learner@school.onmicrosoft.com",
    name: "Alex Morgan",
    given_name: "Alex",
    family_name: "Morgan",
  });

  assert.equal(user.email, "learner@school.onmicrosoft.com");
  assert.equal(user.displayName, "Alex Morgan");
  assert.equal(user.userId, "microsoft-user-123");
  assert.equal(user.roles.includes("student"), true);
});

test("mapOidcProfileToAuthUser falls back to userPrincipalName when mail is missing", async () => {
  const { mapOidcProfileToAuthUser } = await import(
    `../src/modules/auth/provider.ts?test=${Date.now()}-microsoft-upn`
  );

  const user = mapOidcProfileToAuthUser({
    sub: "microsoft-user-456",
    userPrincipalName: "staff@contoso.com",
    given_name: "Jamie",
    family_name: "Lee",
  });

  assert.equal(user.email, "staff@contoso.com");
  assert.equal(user.firstName, "Jamie");
  assert.equal(user.lastName, "Lee");
});
