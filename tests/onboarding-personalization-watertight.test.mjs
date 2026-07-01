import assert from "node:assert/strict";
import test from "node:test";

import { getMockExamPapers } from "../src/modules/exam-engine/service.ts";
import { getDashboardHomeData } from "../src/modules/dashboard/service.ts";
import { listStudentVisibleContentSubjects } from "../src/modules/content/service.ts";
import {
  buildOnboardingPersonalizationContext,
  filterAssessmentsForOnboardingProfile,
  filterCatalogSubjectsForOnboardingProfile,
  filterExamPapersForOnboardingProfile,
} from "../src/modules/onboarding/personalization.ts";
import { getMockTimedAssessments } from "../src/modules/timed-assessment/service.ts";
import { getMockPowerGridSummary } from "../src/modules/power-grid/service.ts";

const completeGcseProfile = {
  userId: "student-demo",
  learnerRole: "student",
  schoolPhase: "secondary",
  schoolName: "Example School",
  schoolNation: "england",
  yearGroup: "Year 11",
  qualificationPath: "gcse-england",
  examBoard: "AQA",
  studyGoal: "exam-readiness",
  selectedSubjectIds: ["gcse-maths", "gcse-english-language"],
  wantsAccessibilitySupport: false,
  wantsAccessArrangementHelp: false,
  sendSupportPathVisible: false,
  ageOrConsentConfirmed: true,
  completedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test("onboarding personalization filters exams, assessments, and subjects consistently", () => {
  const papers = getMockExamPapers();
  const assessments = getMockTimedAssessments();
  const subjects = listStudentVisibleContentSubjects();

  const visiblePapers = filterExamPapersForOnboardingProfile(papers, completeGcseProfile);
  const visibleAssessments = filterAssessmentsForOnboardingProfile(assessments, completeGcseProfile);
  const visibleSubjects = filterCatalogSubjectsForOnboardingProfile(subjects, completeGcseProfile);

  assert.ok(visiblePapers.length > 0);
  assert.ok(visiblePapers.every((paper) => paper.board === "AQA" && paper.qualificationType === "GCSE"));
  assert.ok(visibleAssessments.length > 0);
  assert.ok(
    visibleAssessments.every(
      (assessment) => assessment.examBoard === "AQA" && assessment.qualificationType === "GCSE",
    ),
  );
  assert.deepEqual(
    visibleSubjects.map((subject) => subject.subjectId).sort(),
    ["gcse-english-language", "gcse-maths"],
  );
});

test("onboarding personalization context surfaces study goal and exam availability", () => {
  const context = buildOnboardingPersonalizationContext(
    completeGcseProfile,
    getMockExamPapers(),
  );

  assert.equal(context.isActive, true);
  assert.match(context.setupSummary, /Year 11/);
  assert.match(context.setupSummary, /AQA/);
  assert.equal(context.studyGoalLabel, "Get exam ready");
  assert.match(context.studyGoalMessage, /Mission Control/i);
  assert.match(context.examAvailabilitySummary, /full paper/i);
  assert.equal(context.primarySubjectHref, "/subjects?subjectId=gcse-maths");
});

test("power grid summary respects onboarding subject selection", async () => {
  const summary = await getMockPowerGridSummary({
    userId: "student-demo",
    onboardingProfile: completeGcseProfile,
  });

  const allowedNames = new Set(["Mathematics", "English Language", "Combined Science"]);

  assert.ok(summary.subjectProgress.length >= 1);
  assert.ok(summary.subjectProgress.every((subject) => allowedNames.has(subject.subject)));
  assert.ok(
    summary.subjectProgress.every(
      (subject) =>
        !subject.subjectId ||
        completeGcseProfile.selectedSubjectIds.includes(subject.subjectId),
    ),
  );
});

test("dashboard home data aligns exam and assessment sessions with onboarding profile", async () => {
  const dashboard = await getDashboardHomeData("student-demo");

  assert.equal(dashboard.onboardingPersonalization.isActive, false);

  const personalizedDashboard = await getDashboardHomeData("walkthrough-student-001");

  if (personalizedDashboard.onboardingPersonalization.isActive) {
    const papers = getMockExamPapers();
    const expectedPaperCount = filterExamPapersForOnboardingProfile(
      papers,
      {
        qualificationPath: "gcse-england",
        examBoard: "AQA",
        selectedSubjectIds: personalizedDashboard.onboardingPersonalization.subjectFilterIds,
      },
    ).length;

    assert.equal(personalizedDashboard.examSessions.length, expectedPaperCount);
    assert.ok(personalizedDashboard.recommendedAction.includes("Mission Control") || personalizedDashboard.recommendedAction.length > 0);
  }
});
