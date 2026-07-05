process.env.SWITCH_LIVE_WALKTHROUGH_MODE = "real-auth";
delete process.env.SWITCH_LAUNCH_VERIFICATION_SECRET;

await import("./live-route-walkthrough.mjs");
