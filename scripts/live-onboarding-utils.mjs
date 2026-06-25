import { setTimeout as delay } from "node:timers/promises";

import { assert, fetchJson, fetchResponse } from "./launch-utils.mjs";

const ONBOARDING_WARMUP_STATUSES = new Set([502, 503, 504]);
const ONBOARDING_WARMUP_ATTEMPTS = Number(
  process.env.SWITCH_LIVE_ONBOARDING_WARMUP_ATTEMPTS ?? 6,
);
const ONBOARDING_WARMUP_DELAY_MS = Number(
  process.env.SWITCH_LIVE_ONBOARDING_WARMUP_DELAY_MS ?? 2000,
);

export function jsonHeaders(headers) {
  return {
    ...headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function putOnboardingProfile(baseUrl, headers, profile) {
  const result = await fetchJson(`${baseUrl}/api/onboarding/profile`, {
    method: "PUT",
    headers: jsonHeaders(headers),
    body: JSON.stringify({ profile }),
  });

  assert(
    result.response.ok,
    `Onboarding profile update failed with ${result.response.status}: ${result.body}`,
  );

  return result.json;
}

export async function ensureWalkthroughStudentOnboardingComplete(baseUrl, studentHeaders) {
  const overview = await fetchOnboardingOverviewWithWarmup(baseUrl, studentHeaders);

  assert(
    overview.response.ok,
    `Expected onboarding overview for walkthrough student, received ${overview.response.status}.`,
  );

  const onboarding = overview.json?.onboarding;
  if (onboarding?.isComplete) {
    return;
  }

  const subjectIds =
    onboarding?.options?.subjects
      ?.filter((subject) => subject.qualificationLabel === "GCSE")
      .slice(0, 2)
      .map((subject) => subject.subjectId) ?? [];

  assert(subjectIds.length > 0, "Walkthrough student needs selectable subjects to finish onboarding.");

  await putOnboardingProfile(baseUrl, studentHeaders, { learnerRole: "student" });
  await putOnboardingProfile(baseUrl, studentHeaders, { qualificationPath: "gcse-england" });
  await putOnboardingProfile(baseUrl, studentHeaders, { yearGroup: "Year 11" });
  await putOnboardingProfile(baseUrl, studentHeaders, {
    schoolName: "Launch verification school",
    schoolNation: "england",
  });
  await putOnboardingProfile(baseUrl, studentHeaders, { selectedSubjectIds: subjectIds });
  await putOnboardingProfile(baseUrl, studentHeaders, {
    ageOrConsentConfirmed: true,
    complete: true,
  });
}

async function fetchOnboardingOverviewWithWarmup(baseUrl, studentHeaders) {
  const url = `${baseUrl}/api/onboarding/profile`;

  for (let attempt = 1; attempt <= ONBOARDING_WARMUP_ATTEMPTS; attempt += 1) {
    const response = await fetchResponse(url, {
      headers: jsonHeaders(studentHeaders),
    });

    const body = await response.text();

    if (response.ok) {
      return {
        response,
        body,
        json: body ? JSON.parse(body) : null,
      };
    }

    if (
      ONBOARDING_WARMUP_STATUSES.has(response.status) &&
      attempt < ONBOARDING_WARMUP_ATTEMPTS
    ) {
      console.log(
        `Onboarding overview wake-up attempt ${attempt}/${ONBOARDING_WARMUP_ATTEMPTS} returned ${response.status}. Retrying...`,
      );
      await delay(ONBOARDING_WARMUP_DELAY_MS);
      continue;
    }

    return {
      response,
      body,
      json: null,
    };
  }

  return fetchJson(url, {
    headers: jsonHeaders(studentHeaders),
  });
}
