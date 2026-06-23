import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOnboardingSupportSummary,
  getOnboardingOptions,
  isOnboardingProfileComplete,
  listOnboardingSubjectsForQualificationPath,
  provisionMvpAccessSetupFromOnboarding,
  validateOnboardingProfile,
} from "../src/modules/onboarding/service.ts";

test("onboarding options include school sources and MVP catalog subjects", () => {
  const options = getOnboardingOptions();

  assert.ok(options.learnerRoles.length >= 3);
  assert.ok(options.qualificationPaths.some((path) => path.id === "igcse"));
  assert.equal(options.schoolSources.length, 4);
  assert.equal(options.subjects.length, 4);

  const subjectIds = options.subjects.map((subject) => subject.subjectId).sort();
  assert.deepEqual(subjectIds, [
    "gcse-combined-science",
    "gcse-english-language",
    "gcse-maths",
    "igcse-maths",
  ]);
  assert.equal(options.supportChoices.length, 3);
  assert.ok(options.supportChoices.some((choice) => choice.key === "wantsAccessArrangementHelp"));
});

test("onboarding subjects filter by qualification path", () => {
  const gcseSubjects = listOnboardingSubjectsForQualificationPath("gcse-england");
  assert.equal(gcseSubjects.length, 3);
  assert.ok(gcseSubjects.some((subject) => subject.subjectId === "gcse-maths"));
  assert.ok(gcseSubjects.some((subject) => subject.subjectId === "gcse-english-language"));
  assert.ok(gcseSubjects.some((subject) => subject.subjectId === "gcse-combined-science"));

  const igcseSubjects = listOnboardingSubjectsForQualificationPath("igcse");
  assert.equal(igcseSubjects.length, 1);
  assert.equal(igcseSubjects[0]?.subjectId, "igcse-maths");
});

test("onboarding completion requires consent and valid MVP subject selection", () => {
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

  const wrongRoute = validateOnboardingProfile({
    userId: "student-demo",
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "igcse",
    selectedSubjectIds: ["gcse-maths"],
    wantsAccessibilitySupport: false,
    wantsAccessArrangementHelp: false,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: true,
    updatedAt: new Date().toISOString(),
  });

  assert.match(wrongRoute ?? "", /qualification route/i);

  const completeProfile = {
    userId: "student-demo",
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: ["gcse-maths", "gcse-combined-science"],
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

test("onboarding support summary surfaces MVP accessibility and SEND signposting", () => {
  const summary = buildOnboardingSupportSummary({
    userId: "student-demo",
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: ["gcse-maths"],
    wantsAccessibilitySupport: true,
    wantsAccessArrangementHelp: true,
    sendSupportPathVisible: true,
    ageOrConsentConfirmed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  assert.equal(summary.chips.length, 3);
  assert.match(summary.summary ?? "", /accessibility/i);
  assert.match(summary.summary ?? "", /support/i);
});

test("onboarding completion provisions accessibility foundation into access profile", async () => {
  const userId = `onboarding-access-proof-${Date.now()}`;
  const profile = {
    userId,
    learnerRole: "student",
    schoolName: "Example School",
    schoolNation: "england",
    yearGroup: "Year 11",
    qualificationPath: "gcse-england",
    selectedSubjectIds: ["gcse-maths"],
    wantsAccessibilitySupport: true,
    wantsAccessArrangementHelp: true,
    sendSupportPathVisible: false,
    ageOrConsentConfirmed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await provisionMvpAccessSetupFromOnboarding(profile);

  const { getStudentAccessProfile } = await import("../src/modules/access-arrangements/service.ts");
  const accessProfile = await getStudentAccessProfile(userId);

  assert.equal(accessProfile.accessibilityPreferences.reducedDistractionModeEnabled, true);
  assert.equal(accessProfile.accessibilityPreferences.focusModeEnabled, true);
  assert.equal(accessProfile.textToSpeechEnabled, true);
});
