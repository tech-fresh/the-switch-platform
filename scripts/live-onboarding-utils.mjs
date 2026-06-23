import { assert, fetchJson } from "./launch-utils.mjs";

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
  const overview = await fetchJson(`${baseUrl}/api/onboarding/profile`, {
    headers: jsonHeaders(studentHeaders),
  });

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
