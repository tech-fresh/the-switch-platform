import { assert } from "./launch-utils.mjs";
import {
  getGovernanceRecordingConfig,
  recordLaunchSignoffBundle,
} from "./launch-governance.mjs";

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  assert(value, `${name} is required for launch sign-off recording.`);
  return value;
}

const config = getGovernanceRecordingConfig("live-launch-signoff");

assert(
  config,
  "SWITCH_RECORD_GOVERNANCE=1 is required for launch sign-off recording.",
);

const launchApprover = requiredEnv("SWITCH_LAUNCH_APPROVER");
const stopReleaseAuthority = requiredEnv("SWITCH_LAUNCH_STOP_AUTHORITY");

const bundle = {
  reviews: [
    {
      reviewId: "privacy-retention-review",
      owner:
        process.env.SWITCH_GOVERNANCE_PRIVACY_REVIEW_OWNER?.trim() ||
        "Student data lead",
      note: requiredEnv("SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE"),
    },
    {
      reviewId: "safeguarding-signposting-review",
      owner:
        process.env.SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_OWNER?.trim() ||
        "Student support lead",
      note: requiredEnv("SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE"),
    },
    {
      reviewId: "release-approval-review",
      owner:
        process.env.SWITCH_GOVERNANCE_RELEASE_REVIEW_OWNER?.trim() ||
        "Launch manager",
      note: `${requiredEnv("SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE")} Final launch approver: ${launchApprover}. Stop-release authority: ${stopReleaseAuthority}.`,
    },
  ],
  signoffs: [
    {
      checkId: "signoff-privacy-retention",
      owner:
        process.env.SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_OWNER?.trim() ||
        "Student data lead",
      note: requiredEnv("SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE"),
    },
    {
      checkId: "signoff-safeguarding-support",
      owner:
        process.env.SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_OWNER?.trim() ||
        "Student support lead",
      note: requiredEnv("SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE"),
    },
    {
      checkId: "signoff-alerts-recovery",
      owner:
        process.env.SWITCH_GOVERNANCE_ALERTS_SIGNOFF_OWNER?.trim() ||
        "Platform lead",
      note: requiredEnv("SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE"),
    },
    {
      checkId: "signoff-incident-ownership",
      owner:
        process.env.SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_OWNER?.trim() ||
        "Release manager",
      note: `${requiredEnv("SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE")} Stop-release authority: ${stopReleaseAuthority}.`,
    },
    {
      checkId: "signoff-release-approval",
      owner:
        process.env.SWITCH_GOVERNANCE_RELEASE_SIGNOFF_OWNER?.trim() ||
        "Launch manager",
      note: `${requiredEnv("SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE")} Final launch approver: ${launchApprover}.`,
    },
  ],
};

await recordLaunchSignoffBundle(config, bundle);

console.log("Launch sign-off recording passed:");
console.log(`- Environment: ${config.environment}`);
console.log(`- Final approver: ${launchApprover}`);
console.log(`- Stop-release authority: ${stopReleaseAuthority}`);
console.log("- Privacy, safeguarding, incident ownership, and release approval records were written to launch governance.");
