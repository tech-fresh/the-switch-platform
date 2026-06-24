import assert from "node:assert/strict";
import test from "node:test";

test("live walkthrough config uses cookie headers in oidc mode", async () => {
  const { getLiveWalkthroughConfig } = await import(
    `../scripts/live-walkthrough-utils.mjs?test=${Date.now()}-cookie`
  );

  const config = getLiveWalkthroughConfig({
    SWITCH_AUTH_MODE: "oidc",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com/",
    SWITCH_LIVE_STUDENT_COOKIE: "switch_auth_session=student-cookie",
    SWITCH_LIVE_ADMIN_COOKIE: "switch_auth_session=admin-cookie",
  });

  assert.equal(config.baseUrl, "https://switch.example.com");
  assert.deepEqual(config.studentHeaders, {
    cookie: "switch_auth_session=student-cookie",
  });
  assert.deepEqual(config.adminHeaders, {
    cookie: "switch_auth_session=admin-cookie",
  });
});

test("live walkthrough config builds signed external headers", async () => {
  const { getLiveWalkthroughConfig } = await import(
    `../scripts/live-walkthrough-utils.mjs?test=${Date.now()}-external`
  );

  const config = getLiveWalkthroughConfig({
    SWITCH_AUTH_MODE: "external-header",
    SWITCH_EXTERNAL_AUTH_HEADER_SECRET: "external-secret",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com",
    SWITCH_LIVE_STUDENT_USER_ID: "student-1",
    SWITCH_LIVE_STUDENT_DISPLAY_NAME: "Student One",
    SWITCH_LIVE_STUDENT_EMAIL: "student@example.com",
    SWITCH_LIVE_ADMIN_USER_ID: "admin-1",
    SWITCH_LIVE_ADMIN_DISPLAY_NAME: "Admin One",
    SWITCH_LIVE_ADMIN_EMAIL: "admin@example.com",
  });

  assert.equal(config.studentHeaders["x-switch-auth-user-id"], "student-1");
  assert.equal(config.adminHeaders["x-switch-auth-user-id"], "admin-1");
  assert.equal(config.studentHeaders["x-switch-auth-roles"], "student");
  assert.equal(config.adminHeaders["x-switch-auth-roles"], "admin");
  assert.equal(
    typeof config.studentHeaders["x-switch-auth-signature"],
    "string",
  );
  assert.equal(
    typeof config.adminHeaders["x-switch-auth-signature"],
    "string",
  );
});

test("live walkthrough config prefers launch verification headers when the secret is present", async () => {
  const { getLiveWalkthroughConfig } = await import(
    `../scripts/live-walkthrough-utils.mjs?test=${Date.now()}-launch-verification`
  );

  const config = getLiveWalkthroughConfig({
    SWITCH_AUTH_MODE: "oidc",
    SWITCH_LAUNCH_VERIFICATION_SECRET: "launch-secret",
    SWITCH_LIVE_BASE_URL: "https://switch.example.com",
  });

  assert.equal(
    config.studentHeaders["x-switch-launch-verification"],
    "launch-secret",
  );
  assert.equal(
    config.adminHeaders["x-switch-launch-verification"],
    "launch-secret",
  );
  assert.equal(
    config.studentHeaders["x-switch-launch-roles"],
    "student",
  );
  assert.equal(
    config.adminHeaders["x-switch-launch-roles"],
    "admin,editor,student",
  );
  assert.equal(config.walkthroughMode, "default");
  assert.equal(config.usingLaunchVerificationHeaders, true);
});

test("live walkthrough real-auth mode rejects launch verification secrets", async () => {
  const { getLiveWalkthroughConfig } = await import(
    `../scripts/live-walkthrough-utils.mjs?test=${Date.now()}-real-auth-rejects-launch-secret`
  );

  assert.throws(
    () =>
      getLiveWalkthroughConfig(
        {
          SWITCH_AUTH_MODE: "oidc",
          SWITCH_LIVE_BASE_URL: "https://switch.example.com",
          SWITCH_LAUNCH_VERIFICATION_SECRET: "launch-secret",
        },
        {
          walkthroughMode: "real-auth",
        },
      ),
    /SWITCH_LAUNCH_VERIFICATION_SECRET must be unset/i,
  );
});

test("live walkthrough real-auth mode requires real cookies in oidc mode", async () => {
  const { getLiveWalkthroughConfig } = await import(
    `../scripts/live-walkthrough-utils.mjs?test=${Date.now()}-real-auth-cookies`
  );

  const config = getLiveWalkthroughConfig(
    {
      SWITCH_AUTH_MODE: "oidc",
      SWITCH_LIVE_BASE_URL: "https://switch.example.com/",
      SWITCH_LIVE_STUDENT_COOKIE: "switch_auth_session=student-cookie",
      SWITCH_LIVE_ADMIN_COOKIE: "switch_auth_session=admin-cookie",
    },
    {
      walkthroughMode: "real-auth",
    },
  );

  assert.equal(config.walkthroughMode, "real-auth");
  assert.equal(config.usingLaunchVerificationHeaders, false);
  assert.deepEqual(config.studentHeaders, {
    cookie: "switch_auth_session=student-cookie",
  });
  assert.deepEqual(config.adminHeaders, {
    cookie: "switch_auth_session=admin-cookie",
  });
});
