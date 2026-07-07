import { headers } from "next/headers";
import { getAuthenticatedSwitchRequestContext, getSwitchRequestContext } from "@/lib/server/request-context";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getAccountOverview } from "@/modules/auth/service";
import { getStudentVisibleContentCatalog } from "@/modules/content/service";
import { getDashboardHomeData } from "@/modules/dashboard/service";
import { getMockExamSession } from "@/modules/exam-engine/service";
import { getExamInventorySummary, listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";
import { getJourneyContext } from "@/modules/journey/service";
import { getOnboardingOverview } from "@/modules/onboarding/service";
import { getOnboardingProfileByUserId } from "@/modules/onboarding/repository";
import {
  filterAssessmentsForOnboardingProfile,
  filterCatalogSubjectsForOnboardingProfile,
  filterExamPapersForOnboardingProfile,
} from "@/modules/onboarding/personalization";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";
import { getMockQuizQuestion, listQuizProgressByUser } from "@/modules/quiz/service";
import { getReadAloudSession } from "@/modules/read-aloud/service";
import { getStudentRecommendations, getRecommendationsPageData } from "@/modules/recommendations/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { getResultsOverview } from "@/modules/results/service";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";
import { getSupportHubData } from "@/modules/support/service";
import { getMockSubjects } from "@/modules/subjects/service";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import type { AccountOverview } from "@/modules/auth/types";
import type { CmsOverview } from "@/modules/cms/types";
import type { ContentEditorialAudit, MvpContentCatalog } from "@/modules/content/types";
import type { DashboardHomeData } from "@/modules/dashboard/types";
import type { ExamPaper, ExamSession } from "@/modules/exam-engine/types";
import type { ExamInventoryPaper, ExamInventorySummary } from "@/modules/exam-inventory/types";
import type { JourneyContext } from "@/modules/journey/types";
import type { LaunchGovernanceOverview } from "@/modules/governance/types";
import type { OperationsOverview } from "@/modules/operations/types";
import type { PastPaperCatalogOverview } from "@/modules/past-papers/types";
import type { PowerGridSummary } from "@/modules/power-grid/types";
import type { Recommendation, RecommendationsPageData } from "@/modules/recommendations/types";
import type { ReadAloudContentType, ReadAloudSession } from "@/modules/read-aloud/types";
import type { ResultsOverview } from "@/modules/results/types";
import type { SavedProgressOverview } from "@/modules/saved-progress/types";
import { getWebsiteGuideData } from "@/modules/website-guide/service";
import { getWeeklyPlannerSummary } from "@/modules/weekly-planner/service";
import { getMockTimedAssessmentAttemptSeed, getMockTimedAssessments } from "@/modules/timed-assessment/service";
import type { QuizQuestion, SubmitQuizAnswerResult } from "@/modules/quiz/types";
import type { RevisionContent } from "@/modules/revision/types";
import type { Subject } from "@/modules/subjects/types";
import type { SupportHubData } from "@/modules/support/types";
import type { SubjectLibraryLearningObjective, SubjectLibraryValidationResult } from "@/modules/specification-engine/types";
import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "@/modules/timed-assessment/types";
import type { Topic } from "@/modules/topics/types";
import type { WebsiteGuideData } from "@/modules/website-guide/types";
import type { WeeklyPlannerSummary } from "@/modules/weekly-planner/types";
import { getMockTopicsForSubject } from "@/modules/topics/service";
import type { PersistenceRuntimeSummary } from "@/lib/server/repositories";

export interface SubjectsExperienceData {
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  revisionByTopic: Record<string, RevisionContent>;
  quizByTopic: Record<string, QuizQuestion>;
  quizAttemptsByTopic: Record<string, SubmitQuizAnswerResult | null>;
}

async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (!host) {
    throw new Error("Unable to resolve request host for internal API fetch.");
  }

  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

async function fetchApiJson<T>(path: string): Promise<T> {
  const origin = await getRequestOrigin();
  const headerStore = await headers();
  const forwardedHeaders = buildForwardedAuthHeaders(headerStore);
  const response = await fetch(`${origin}${path}`, {
    cache: "no-store",
    headers: {
      cookie: headerStore.get("cookie") ?? "",
      ...forwardedHeaders,
    },
  });

  if (!response.ok) {
    throw new Error(`Internal API request failed for ${path} with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

function buildForwardedAuthHeaders(headerStore: Headers): Record<string, string> {
  const forwardedHeaders: Record<string, string> = {};

  for (const headerName of [
    "x-switch-launch-verification",
    "x-switch-launch-session-id",
    "x-switch-launch-user-id",
    "x-switch-launch-display-name",
    "x-switch-launch-email",
    "x-switch-launch-provider",
    "x-switch-launch-roles",
    "x-switch-launch-year-group",
    "x-switch-launch-target-qualifications",
    "x-switch-launch-signed-in-at",
    "x-switch-launch-expires-at",
    "x-switch-auth-session-id",
    "x-switch-auth-user-id",
    "x-switch-auth-display-name",
    "x-switch-auth-email",
    "x-switch-auth-provider",
    "x-switch-auth-roles",
    "x-switch-auth-year-group",
    "x-switch-auth-target-qualifications",
    "x-switch-auth-signed-in-at",
    "x-switch-auth-expires-at",
    "x-switch-auth-timestamp",
    "x-switch-auth-signature",
  ]) {
    const value = headerStore.get(headerName);

    if (value) {
      forwardedHeaders[headerName] = value;
    }
  }

  return forwardedHeaders;
}

export async function getDashboardHomeApiData(): Promise<DashboardHomeData> {
  const context = await getSwitchRequestContext();

  return getDashboardHomeData(context.userId);
}

export async function getProgressSummaryApiData(): Promise<PowerGridSummary> {
  const context = await getSwitchRequestContext();
  const onboardingOverview =
    context.userId === "guest-preview" ? null : await getOnboardingOverview(context.userId);

  return getMockPowerGridSummary({
    userId: context.userId,
    savedProgressRepository: context.repositories.savedProgress,
    onboardingProfile: onboardingOverview?.profile ?? null,
  });
}

export async function getSavedProgressOverviewApiData(): Promise<SavedProgressOverview> {
  const context = await getAuthenticatedSwitchRequestContext();

  return getSavedProgressOverview({
    userId: context.userId,
    savedProgressRepository: context.repositories.savedProgress,
  });
}

export async function getExamPapersApiData(): Promise<ExamPaper[]> {
  const context = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(context.userId);
  const papers = listStudentVisibleExamPapers();

  return profile && profile.completedAt
    ? filterExamPapersForOnboardingProfile(papers, profile)
    : papers;
}

export async function getExamInventoryApiData(): Promise<{
  summary: ExamInventorySummary;
  papers: ExamInventoryPaper[];
}> {
  return fetchApiJson<{ summary: ExamInventorySummary; papers: ExamInventoryPaper[] }>(
    "/api/exams/inventory",
  );
}

export async function getExamSessionApiData(examId: string): Promise<ExamSession> {
  const context = await getSwitchRequestContext();

  return getMockExamSession(examId, {
    userId: context.userId,
    accessProfileRepository: context.repositories.accessProfiles,
    savedProgressRepository: context.repositories.savedProgress,
  });
}

export async function getTimedAssessmentDefinitionsApiData(): Promise<TimedAssessmentDefinition[]> {
  const context = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(context.userId);
  const assessments = getMockTimedAssessments();

  return profile && profile.completedAt
    ? filterAssessmentsForOnboardingProfile(assessments, profile)
    : assessments;
}

export async function getTimedAssessmentSeedApiData(
  assessmentId: string,
  selectedDurationMinutes?: number,
): Promise<TimedAssessmentAttemptSeed> {
  const context = await getSwitchRequestContext();

  return getMockTimedAssessmentAttemptSeed(assessmentId, {
    userId: context.userId,
    selectedDurationMinutes,
    accessProfileRepository: context.repositories.accessProfiles,
    savedProgressRepository: context.repositories.savedProgress,
  });
}

export async function getAccessibilitySnapshotApiData(): Promise<AccessibilitySnapshot> {
  const context = await getSwitchRequestContext();

  return getAccessibilitySnapshot(context.userId, context.repositories.accessProfiles);
}

export async function getReadAloudSessionApiData(
  contentType: ReadAloudContentType,
): Promise<ReadAloudSession> {
  const context = await getSwitchRequestContext();

  return getReadAloudSession(
    context.userId,
    contentType,
    context.repositories.accessProfiles,
  );
}

export async function getStudentRecommendationsApiData(): Promise<Recommendation[]> {
  const context = await getSwitchRequestContext();

  return getStudentRecommendations(context.userId);
}

export async function getJourneyNextActionApiData(): Promise<JourneyContext> {
  const context = await getAuthenticatedSwitchRequestContext();

  return getJourneyContext(context.userId);
}

export async function getRecommendationsPageApiData(): Promise<RecommendationsPageData> {
  const context = await getAuthenticatedSwitchRequestContext();

  return getRecommendationsPageData(context.userId);
}

export async function getAccountOverviewApiData(): Promise<AccountOverview> {
  const context = await getSwitchRequestContext();

  return getAccountOverview({ session: context.session });
}

export async function getResultsOverviewApiData(): Promise<ResultsOverview> {
  const context = await getAuthenticatedSwitchRequestContext();

  return getResultsOverview(context.userId);
}

export async function getSupportHubApiData(): Promise<SupportHubData> {
  return getSupportHubData();
}

export async function getCmsOverviewApiData(): Promise<CmsOverview> {
  const response = await fetchApiJson<{ overview: CmsOverview }>("/api/cms/overview");

  return response.overview;
}

export async function getPastPaperCatalogApiData(): Promise<PastPaperCatalogOverview> {
  const response = await fetchApiJson<{ catalog: PastPaperCatalogOverview }>(
    "/api/past-papers/catalog",
  );

  return response.catalog;
}

export async function getLaunchGovernanceOverviewApiData(): Promise<LaunchGovernanceOverview> {
  const response = await fetchApiJson<{ governance: LaunchGovernanceOverview }>(
    "/api/governance/overview",
  );

  return response.governance;
}

export async function getOperationsOverviewApiData(): Promise<OperationsOverview> {
  const response = await fetchApiJson<{ operations: OperationsOverview }>(
    "/api/operations/overview",
  );

  return response.operations;
}

export async function getPersistenceRuntimeSummaryApiData(): Promise<PersistenceRuntimeSummary> {
  const response = await fetchApiJson<{ persistence: PersistenceRuntimeSummary }>(
    "/api/persistence/runtime",
  );

  return response.persistence;
}

export async function getStudentContentCatalogApiData(): Promise<MvpContentCatalog> {
  return getStudentVisibleContentCatalog();
}

export async function getContentEditorialAuditApiData(): Promise<ContentEditorialAudit> {
  const response = await fetchApiJson<{ audit: ContentEditorialAudit }>(
    "/api/content/editorial-audit",
  );

  return response.audit;
}

export async function getSpecificationLibraryApiData(): Promise<{
  objectives: SubjectLibraryLearningObjective[];
  validation: SubjectLibraryValidationResult;
}> {
  return fetchApiJson<{
    objectives: SubjectLibraryLearningObjective[];
    validation: SubjectLibraryValidationResult;
  }>("/api/content/specification-library");
}

export async function getSubjectsExperienceApiData(): Promise<SubjectsExperienceData> {
  const context = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(context.userId);
  const subjects = filterCatalogSubjectsForOnboardingProfile(getMockSubjects(), profile);
  const topicsBySubject = Object.fromEntries(
    subjects.map((subject) => [subject.subjectId, getMockTopicsForSubject(subject.subjectId)]),
  );
  const allTopics = Object.values(topicsBySubject).flat();
  const quizProgress = await listQuizProgressByUser(
    context.userId,
    context.repositories.quizProgress,
  );
  const revisionByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockRevisionContent(topic.topicId)]),
  );
  const quizByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockQuizQuestion(topic.topicId)]),
  );
  const quizAttemptsByTopic = Object.fromEntries(
    allTopics.map((topic) => {
      const question = quizByTopic[topic.topicId];
      const progress = quizProgress.find((record) => record.topicId === topic.topicId) ?? null;
      const selectedOption = question.options.find(
        (option) => option.optionId === progress?.selectedOptionId,
      );
      const correctOption = question.options.find(
        (option) => option.optionId === question.correctOptionId,
      );

      return [
        topic.topicId,
        progress && selectedOption && correctOption
          ? {
              topicId: topic.topicId,
              questionId: question.questionId,
              selectedOptionId: progress.selectedOptionId,
              selectedOptionLabel: selectedOption.label,
              correctOptionId: question.correctOptionId,
              correctOptionLabel: correctOption.label,
              isCorrect: progress.isCorrect,
              explanation: question.explanation,
              attemptsCount: progress.attemptsCount,
              correctCount: progress.correctCount,
              incorrectCount: progress.incorrectCount,
              accuracyPercentage: Math.round(
                (progress.correctCount / Math.max(progress.attemptsCount, 1)) * 100,
              ),
              lastAnsweredAt: progress.lastAnsweredAt,
            }
          : null,
      ];
    }),
  );

  return {
    subjects,
    topicsBySubject,
    revisionByTopic,
    quizByTopic,
    quizAttemptsByTopic,
  };
}

export async function getWeeklyPlannerApiData(): Promise<WeeklyPlannerSummary> {
  const context = await getSwitchRequestContext();

  return getWeeklyPlannerSummary({ userId: context.userId });
}

export async function getWebsiteGuideApiData(): Promise<WebsiteGuideData> {
  return getWebsiteGuideData();
}

export async function getOnboardingOverviewApiData(): Promise<import("@/modules/onboarding/types").OnboardingOverview> {
  const context = await getAuthenticatedSwitchRequestContext();

  return getOnboardingOverview(context.userId);
}
