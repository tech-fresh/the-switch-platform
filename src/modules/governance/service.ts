import type {
  GovernanceFollowUpLoop,
  GovernanceOwnershipArea,
  GovernanceReviewRecord,
  GovernanceSmokeCheck,
  LaunchGovernanceOverview,
} from "./types";

const reviews: GovernanceReviewRecord[] = [
  {
    reviewId: "privacy-retention-review",
    title: "Privacy and retention review",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Student data lead",
    note: "Student account, saved progress, support settings, and editorial data all have a clear retention and handling summary for launch.",
  },
  {
    reviewId: "safeguarding-signposting-review",
    title: "Safeguarding and support review",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Student support lead",
    note: "Support routes stay signposting-only and keep urgent help visible without pretending to provide counselling.",
  },
  {
    reviewId: "release-approval-review",
    title: "Release approval path",
    status: "ready",
    completedAt: "2026-06-14",
    owner: "Launch manager",
    note: "Engineering, editorial, and student support approval points are now named before the final release step.",
  },
];

const ownership: GovernanceOwnershipArea[] = [
  {
    areaId: "engineering-operations",
    area: "Engineering operations",
    primaryOwner: "Platform lead",
    backupOwner: "Release manager",
    responsibility: "Owns deploy safety, incident handling, monitoring follow-up, and runtime recovery checks.",
  },
  {
    areaId: "editorial-operations",
    area: "Editorial operations",
    primaryOwner: "Editorial lead",
    backupOwner: "Content operations manager",
    responsibility: "Owns review, fact-check, publish approval, rollback decisions, and blocked-content handling.",
  },
  {
    areaId: "student-data-support",
    area: "Student data support",
    primaryOwner: "Student data lead",
    backupOwner: "Support operations lead",
    responsibility: "Owns account-linked data questions, privacy handling, retention follow-up, and access-related requests.",
  },
  {
    areaId: "safeguarding-support",
    area: "Safeguarding and support",
    primaryOwner: "Student support lead",
    backupOwner: "Safeguarding contact",
    responsibility: "Owns support signposting quality, age-appropriate language, and urgent-help route review.",
  },
];

const smokeChecks: GovernanceSmokeCheck[] = [
  {
    checkId: "smoke-dashboard",
    route: "/dashboard",
    status: "ready",
    note: "Dashboard launch cards, continuity links, and next-step guidance load in a stable way.",
  },
  {
    checkId: "smoke-subjects",
    route: "/subjects",
    status: "ready",
    note: "Subject navigation, topic visibility, and learning route entry points remain student-safe.",
  },
  {
    checkId: "smoke-assessments",
    route: "/assessments",
    status: "ready",
    note: "Timed assessment entry, save, resume, submit, and review behaviour can be checked end to end.",
  },
  {
    checkId: "smoke-exams",
    route: "/exams",
    status: "ready",
    note: "Exam loading, recovery handling, autosave, and result reopen paths are part of the launch smoke pass.",
  },
  {
    checkId: "smoke-saved-results",
    route: "/saved-progress + /results",
    status: "ready",
    note: "Resume-ready and review-ready records can be checked together through the continuity surfaces.",
  },
  {
    checkId: "smoke-account-admin",
    route: "/account + /admin",
    status: "ready",
    note: "Signed-in access, route protection, operations visibility, and editorial controls are part of the final launch walk-through.",
  },
];

const followUpLoops: GovernanceFollowUpLoop[] = [
  {
    loopId: "incident-review",
    title: "Incident review loop",
    cadence: "After every incident and weekly during launch",
    owner: "Platform lead",
    purpose: "Make sure production issues turn into concrete fixes, clearer alerts, and safer recovery steps.",
  },
  {
    loopId: "content-correction-review",
    title: "Content correction loop",
    cadence: "Weekly",
    owner: "Editorial lead",
    purpose: "Track blocked items, corrections, and source-quality concerns after launch.",
  },
  {
    loopId: "learner-trust-review",
    title: "Learner trust review",
    cadence: "Every two weeks",
    owner: "Student support lead",
    purpose: "Review support wording, safeguarding signals, and confusing student-facing moments before they drift.",
  },
];

export function getLaunchGovernanceOverview(): LaunchGovernanceOverview {
  return {
    overallStatus: "ready",
    reviews,
    ownership,
    smokeChecks,
    followUpLoops,
  };
}
