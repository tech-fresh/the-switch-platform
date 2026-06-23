import test from "node:test";
import assert from "node:assert/strict";

import {
  getOnboardingOptions,
  isOnboardingProfileComplete,
  validateOnboardingProfile,
} from "../src/modules/onboarding/service.ts";

test("onboarding options include school sources and qualification paths", () => {
  const options = getOnboardingOptions();

  assert.ok(options.learnerRoles.length >= 3);
  assert.ok(options.qualificationPaths.some((path) => path.id === "igcse"));
  assert.equal(options.schoolSources.length, 4);
  assert.ok(options.subjects.length > 0);
});

test("onboarding completion requires consent and subject selection", () => {
  const incomplete = validateOnboardingProfile({
    userId: "student-demo",
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: [],
    wantsAccessibilitySupport: false,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: false,
    updatedAt: new Date().toISOString(),
  });

  assert.match(incomplete ?? "", /subject/i);

  const completeProfile = {
    userId: "student-demo",
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: ["mathematics-gcse"],
    wantsAccessibilitySupport: true,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: true,
    ageOrConsentConfirmed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assert.equal(validateOnboardingProfile(completeProfile), null);
  assert.equal(isOnboardingProfileComplete(completeProfile), true);
});
