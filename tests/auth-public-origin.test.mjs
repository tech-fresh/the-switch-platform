import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getAuthCallbackUrl,
  getAuthPublicOrigin,
  getAuthRedirectUrl,
} from "../src/modules/auth/public-origin.ts";

const requestUrl = new URL("http://0.0.0.0:3000/api/auth/callback?code=abc");

test("auth redirects use SWITCH_AUTH_BASE_URL instead of internal request host", () => {
  const previous = process.env.SWITCH_AUTH_BASE_URL;
  process.env.SWITCH_AUTH_BASE_URL = "https://theswitchplatform.com";

  try {
    assert.equal(getAuthPublicOrigin(requestUrl).origin, "https://theswitchplatform.com");
    assert.equal(
      getAuthCallbackUrl(requestUrl),
      "https://theswitchplatform.com/api/auth/callback",
    );
    assert.equal(getAuthRedirectUrl(requestUrl, "/account").toString(), "https://theswitchplatform.com/account");
  } finally {
    if (previous === undefined) {
      delete process.env.SWITCH_AUTH_BASE_URL;
    } else {
      process.env.SWITCH_AUTH_BASE_URL = previous;
    }
  }
});
