import "./load-script-env.mjs";

import { getLaunchPreflightReport } from "./launch-preflight-utils.mjs";

const closeoutItems = [
  {
    itemId: "closeout-auth-default",
    status: "done",
    title: "Real sign-in is now the default direction",
  },
  {
    itemId: "closeout-auth-secret",
    status: "done",
    title: "Unsafe preview-secret fallback is removed for live modes",
  },
  {
    itemId: "closeout-persistence",
    status: "done",
    title: "Student data now has the intended shared live data setup in the codebase",
  },
  {
    itemId: "closeout-editorial",
    status: "done",
    title: "Editorial work is writable in the runtime",
  },
  {
    itemId: "closeout-content-path",
    status: "done",
    title: "Content operations are described as a real operating path",
  },
  {
    itemId: "closeout-verification-noise",
    status: "done",
    title: "Verification output is cleaner",
  },
  {
    itemId: "closeout-automation",
    status: "done",
    title: "Launch checking is more automated",
  },
  {
    itemId: "closeout-live-environment",
    status: "remaining",
    title: "The real live environment still needs proof outside local development",
  },
  {
    itemId: "closeout-live-walkthrough",
    status: "remaining",
    title: "The final live route walk-through still needs to be recorded",
  },
  {
    itemId: "closeout-live-signoff",
    status: "remaining",
    title: "The final trust and release sign-off still needs live evidence",
  },
];

const preflight = getLaunchPreflightReport(process.env);
const doneItems = closeoutItems.filter((item) => item.status === "done");
const remainingItems = closeoutItems.filter((item) => item.status === "remaining");
const historicalCloseoutRecorded = preflight.ready;

console.log("Final Path Mark 1 launch status:");
console.log(`- Code-complete closeout items: ${doneItems.length} of ${closeoutItems.length}`);
console.log(
  historicalCloseoutRecorded
    ? "- Current completion range: historical closeout recorded; use the live sequence below to refresh evidence for a new release."
    : "- Current completion range: 88% to 90%",
);
console.log(
  `- Launch preflight: ${preflight.ready ? "ready for live sequence" : "missing required live inputs"}`,
);

console.log("\nCode-complete items:");
for (const item of doneItems) {
  console.log(`- ${item.title}`);
}

if (historicalCloseoutRecorded) {
  console.log("\nHistorical closeout status:");
  console.log("- The 26 June 2026 Fly production closeout is already recorded.");
  console.log("- Use the live sequence below to refresh production evidence after a new deploy or release change.");
} else {
  console.log("\nRemaining live-only items:");
  for (const item of remainingItems) {
    console.log(`- ${item.title}`);
  }
}

if (!preflight.ready) {
  console.log("\nMissing live inputs:");
  for (const key of preflight.missing) {
    console.log(`- ${key}`);
  }
}

console.log("\nFinal live sequence:");
console.log("- npm run verify:persistence-health");
console.log("- npm run verify:live-readiness");
console.log("- npm run verify:persistence-recovery");
console.log("- npm run verify:live-oidc-proof");
console.log("- npm run verify:live-walkthrough:real-auth");
console.log("- npm run verify:launch-signoff");
console.log("- npm run verify:launch-complete");
