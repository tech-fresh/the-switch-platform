import process from "node:process";

const governanceServiceUrl = new URL("../src/modules/governance/service.ts", import.meta.url);

export function getGovernanceRecordingConfig(defaultEnvironment) {
  if (process.env.SWITCH_RECORD_GOVERNANCE !== "1") {
    return null;
  }

  return {
    environment:
      process.env.SWITCH_GOVERNANCE_ENVIRONMENT?.trim() || defaultEnvironment,
    evidenceOwner:
      process.env.SWITCH_GOVERNANCE_EVIDENCE_OWNER?.trim() || "Release manager",
    smokeOwner:
      process.env.SWITCH_GOVERNANCE_SMOKE_OWNER?.trim() || "Release manager",
    environmentOwner:
      process.env.SWITCH_GOVERNANCE_ENVIRONMENT_OWNER?.trim() || "Platform lead",
    recordedAt: new Date().toISOString(),
  };
}

export async function recordLocalReleaseRehearsal(config, scriptNames) {
  if (!config) {
    return false;
  }

  const governanceService = await import(
    `${governanceServiceUrl.href}?record=release-rehearsal-${Date.now()}`
  );

  await governanceService.recordLaunchGovernanceEvidence({
    evidenceId: "evidence-smoke-rehearsal",
    status: "recorded",
    owner: config.evidenceOwner,
    summary: `Local release rehearsal passed across ${scriptNames.join(", ")}.`,
    environment: config.environment,
    recordedAt: config.recordedAt,
  });

  return true;
}

export async function recordLiveReadiness(config, summary) {
  if (!config) {
    return false;
  }

  const governanceService = await import(
    `${governanceServiceUrl.href}?record=live-readiness-${Date.now()}`
  );

  const environmentChecks = [
    [
      "environment-auth-mode",
      "Live readiness verified that the runtime is on the intended live sign-in mode.",
    ],
    [
      "environment-auth-secret",
      "Live readiness verified that a dedicated live sign-in secret is configured.",
    ],
    [
      "environment-auth-base-url",
      "Live readiness verified the public sign-in callback address for this environment.",
    ],
    [
      "environment-auth-provider",
      "Live readiness verified that a full live sign-in provider configuration is present.",
    ],
    [
      "environment-persistence-path",
      "Live readiness verified that student data points to the intended explicit live data path.",
    ],
    [
      "environment-cms-mode",
      "Live readiness verified that editorial workflow is enabled through the live writable path.",
    ],
  ];

  for (const [checkId, detail] of environmentChecks) {
    await governanceService.recordLaunchGovernanceEnvironmentCheck({
      checkId,
      status: "ready",
      owner: config.environmentOwner,
      detail,
      environment: config.environment,
      recordedAt: config.recordedAt,
    });
  }

  await governanceService.recordLaunchGovernanceEvidence({
    evidenceId: "evidence-environment-base-url",
    status: "recorded",
    owner: config.evidenceOwner,
    summary,
    environment: config.environment,
    recordedAt: config.recordedAt,
  });

  return true;
}

export async function recordFinalRouteRehearsal(config, smokeChecks) {
  if (!config) {
    return false;
  }

  const governanceService = await import(
    `${governanceServiceUrl.href}?record=final-route-rehearsal-${Date.now()}`
  );

  for (const smokeCheck of smokeChecks) {
    await governanceService.recordLaunchGovernanceSmokeCheck({
      checkId: smokeCheck.checkId,
      status: "ready",
      owner: config.smokeOwner,
      note: smokeCheck.note,
      environment: config.environment,
      recordedAt: config.recordedAt,
    });
  }

  return true;
}

export async function recordLiveRouteWalkthrough(config, smokeChecks, summary) {
  if (!config) {
    return false;
  }

  const governanceService = await import(
    `${governanceServiceUrl.href}?record=live-route-walkthrough-${Date.now()}`
  );

  for (const smokeCheck of smokeChecks) {
    await governanceService.recordLaunchGovernanceSmokeCheck({
      checkId: smokeCheck.checkId,
      status: "ready",
      owner: config.smokeOwner,
      note: smokeCheck.note,
      environment: config.environment,
      recordedAt: config.recordedAt,
    });
  }

  await governanceService.recordLaunchGovernanceEvidence({
    evidenceId: "evidence-final-live-proof",
    status: "recorded",
    owner: config.evidenceOwner,
    summary,
    environment: config.environment,
    recordedAt: config.recordedAt,
  });

  return true;
}

export async function recordLaunchSignoffBundle(config, bundle) {
  if (!config) {
    return false;
  }

  const governanceService = await import(
    `${governanceServiceUrl.href}?record=launch-signoff-${Date.now()}`
  );

  for (const review of bundle.reviews) {
    await governanceService.recordLaunchGovernanceReview({
      reviewId: review.reviewId,
      status: "ready",
      owner: review.owner,
      note: review.note,
      environment: config.environment,
      recordedAt: config.recordedAt,
    });
  }

  for (const signoff of bundle.signoffs) {
    await governanceService.recordLaunchGovernanceSignOff({
      checkId: signoff.checkId,
      status: "ready",
      owner: signoff.owner,
      note: signoff.note,
      environment: config.environment,
      recordedAt: config.recordedAt,
    });
  }

  return true;
}
