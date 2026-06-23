import "./load-script-env.mjs";

import { assert, fetchJson, fetchResponse, fetchText } from "./launch-utils.mjs";
import {
  buildLaunchVerificationHeaders,
  getLiveWalkthroughConfig,
} from "./live-walkthrough-utils.mjs";
import {
  jsonHeaders,
  putOnboardingProfile,
} from "./live-onboarding-utils.mjs";

const REQUIRED_STEPS = [
  "account-type",
  "qualification",
  "profile",
  "school",
  "subjects",
  "support",
  "guardian",
  "consent",
];

const REQUIRED_SCHOOL_NATIONS = ["england", "scotland", "wales", "northern-ireland"];

const { baseUrl, studentHeaders } = getLiveWalkthroughConfig();
const useLaunchVerification = Boolean(process.env.SWITCH_LAUNCH_VERIFICATION_SECRET?.trim());

assert(
  useLaunchVerification,
  "SWITCH_LAUNCH_VERIFICATION_SECRET is required for live onboarding proof (fresh learner simulation).",
);

const proofUserId = `onboarding-live-proof-${Date.now()}`;
const proofHeaders = buildLaunchVerificationHeaders("student", process.env, {
  userId: proofUserId,
  displayName: "Live Onboarding Proof",
  email: `${proofUserId}@launch-verification.switch.local`,
  sessionId: `${proofUserId}-session`,
});

console.log(`Live onboarding proof target: ${baseUrl}`);
console.log(`Proof learner user id: ${proofUserId}`);

console.log("Checking signed-out /onboarding redirect...");
const signedOutOnboarding = await fetchResponse(`${baseUrl}/onboarding`, {
  redirect: "manual",
});
const signedOutLocation = signedOutOnboarding.headers.get("location") ?? "";
assert(
  signedOutOnboarding.status >= 300 &&
    signedOutOnboarding.status < 400 &&
    signedOutLocation.includes("/login"),
  `Expected signed-out /onboarding to redirect to /login, received ${signedOutOnboarding.status} (${signedOutLocation}).`,
);

console.log("Checking fresh learner onboarding overview...");
const initialOverview = await fetchJson(`${baseUrl}/api/onboarding/profile`, {
  headers: jsonHeaders(proofHeaders),
});
assert(
  initialOverview.response.ok,
  `Expected onboarding overview to return 200, received ${initialOverview.response.status}.`,
);

const onboarding = initialOverview.json?.onboarding;
assert(onboarding, "Expected onboarding overview payload.");
assert(onboarding.isComplete === false, "Expected fresh proof learner to have incomplete onboarding.");

const options = onboarding.options;
assert(Array.isArray(options.steps), "Expected onboarding step list.");
for (const step of REQUIRED_STEPS) {
  assert(options.steps.includes(step), `Expected onboarding steps to include "${step}".`);
}

assert(
  options.qualificationPaths.some((path) => path.id === "igcse"),
  "Expected iGCSE qualification path in onboarding options.",
);
assert(
  options.qualificationPaths.some((path) => path.id === "gcse-england"),
  "Expected GCSE England qualification path in onboarding options.",
);

const schoolNations = options.schoolSources.map((source) => source.nation);
for (const nation of REQUIRED_SCHOOL_NATIONS) {
  assert(
    schoolNations.includes(nation),
    `Expected UK school source for ${nation}.`,
  );
}

assert(options.learnerRoles.length >= 3, "Expected student, parent, and teacher role options.");
assert(options.subjects.length > 0, "Expected at least one selectable subject.");

console.log("Checking Seneca-style onboarding page...");
const onboardingPage = await fetchText(`${baseUrl}/onboarding`, {
  headers: proofHeaders,
});
assert(
  onboardingPage.response.ok,
  `Expected /onboarding to return 200 for authenticated learner, received ${onboardingPage.response.status}.`,
);
assert(
  onboardingPage.body.includes("Select your Switch account type"),
  "Expected onboarding page to include account-type step copy.",
);

const subjectIds = options.subjects.slice(0, 2).map((subject) => subject.subjectId);
assert(subjectIds.length >= 1, "Need at least one subject id for onboarding completion proof.");

console.log("Completing onboarding via API (mirrors guided setup steps)...");
await putOnboardingProfile(baseUrl, proofHeaders, { learnerRole: "student" });
await putOnboardingProfile(baseUrl, proofHeaders, { qualificationPath: "gcse-england" });
await putOnboardingProfile(baseUrl, proofHeaders, { yearGroup: "Year 11" });
await putOnboardingProfile(baseUrl, proofHeaders, {
  schoolName: "Live onboarding proof school",
  schoolNation: "england",
});
await putOnboardingProfile(baseUrl, proofHeaders, { selectedSubjectIds: subjectIds });
await putOnboardingProfile(baseUrl, proofHeaders, {
  wantsAccessibilitySupport: true,
  wantsAccessArrangementHelp: false,
  sendSupportPathVisible: true,
});
await putOnboardingProfile(baseUrl, proofHeaders, {
  guardianInviteEmail: "guardian@launch-verification.switch.local",
});

const completion = await putOnboardingProfile(baseUrl, proofHeaders, {
  ageOrConsentConfirmed: true,
  complete: true,
});
assert(completion.isComplete === true, "Expected onboarding completion flag after final step.");
assert(completion.profile?.completedAt, "Expected completedAt timestamp on finished profile.");
assert(
  completion.profile.selectedSubjectIds.length >= 1,
  "Expected selected subjects on completed profile.",
);

console.log("Checking completed onboarding overview...");
const completedOverview = await fetchJson(`${baseUrl}/api/onboarding/profile`, {
  headers: jsonHeaders(proofHeaders),
});
assert(completedOverview.json?.onboarding?.isComplete === true, "Expected isComplete true after finish.");

console.log("Checking personalised dashboard access...");
const dashboardPage = await fetchText(`${baseUrl}/dashboard`, {
  headers: proofHeaders,
});
assert(
  dashboardPage.response.ok,
  `Expected /dashboard after onboarding to return 200, received ${dashboardPage.response.status}.`,
);
assert(
  dashboardPage.body.includes("Dashboard"),
  "Expected personalised dashboard page after onboarding completion.",
);

const dashboardApi = await fetchJson(`${baseUrl}/api/dashboard/home`, {
  headers: jsonHeaders(proofHeaders),
});
assert(
  dashboardApi.response.ok,
  `Expected /api/dashboard/home to return 200, received ${dashboardApi.response.status}.`,
);

const recommendedAction = dashboardApi.json?.dashboard?.recommendedAction ?? "";
assert(
  recommendedAction.includes("Year 11") || recommendedAction.includes("GCSE"),
  `Expected dashboard to reflect onboarding setup in recommendedAction, received "${recommendedAction}".`,
);

console.log("Checking completed onboarding route redirect...");
const completedOnboardingRoute = await fetchResponse(`${baseUrl}/onboarding`, {
  headers: proofHeaders,
  redirect: "manual",
});
const completedLocation = completedOnboardingRoute.headers.get("location") ?? "";
assert(
  completedOnboardingRoute.status >= 300 &&
    completedOnboardingRoute.status < 400 &&
    completedLocation.includes("/dashboard"),
  `Expected completed /onboarding to redirect to /dashboard, received ${completedOnboardingRoute.status} (${completedLocation}).`,
);

console.log("Live onboarding proof passed:");
console.log("- Signed-out route protection on /onboarding");
console.log("- Account type, qualification (GCSE + iGCSE), profile/year, school + UK sources");
console.log("- Subject selection, accessibility/SEND flags, guardian invite, age/consent");
console.log("- Dashboard gate opens with personalised home after completion");
