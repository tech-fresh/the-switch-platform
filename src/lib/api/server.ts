import { headers } from "next/headers";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import type { AccountOverview } from "@/modules/auth/types";
import type { CmsOverview } from "@/modules/cms/types";
import type { DashboardHomeData } from "@/modules/dashboard/types";
import type { ExamPaper, ExamSession } from "@/modules/exam-engine/types";
import type { PastPaperCatalogOverview } from "@/modules/past-papers/types";
import type { PowerGridSummary } from "@/modules/power-grid/types";
import type { Recommendation, RecommendationsPageData } from "@/modules/recommendations/types";
import type { ReadAloudContentType, ReadAloudSession } from "@/modules/read-aloud/types";
import type { ResultsOverview } from "@/modules/results/types";
import type { SavedProgressOverview } from "@/modules/saved-progress/types";
import type { QuizQuestion } from "@/modules/quiz/types";
import type { RevisionContent } from "@/modules/revision/types";
import type { Subject } from "@/modules/subjects/types";
import type { SupportHubData } from "@/modules/support/types";
import type { TimedAssessmentAttemptSeed, TimedAssessmentDefinition } from "@/modules/timed-assessment/types";
import type { Topic } from "@/modules/topics/types";

export interface SubjectsExperienceData {
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  revisionByTopic: Record<string, RevisionContent>;
  quizByTopic: Record<string, QuizQuestion>;
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
  const response = await fetch(`${origin}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Internal API request failed for ${path} with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function getDashboardHomeApiData(): Promise<DashboardHomeData> {
  const response = await fetchApiJson<{ dashboard: DashboardHomeData }>("/api/dashboard/home");

  return response.dashboard;
}

export async function getProgressSummaryApiData(): Promise<PowerGridSummary> {
  const response = await fetchApiJson<{ summary: PowerGridSummary }>("/api/progress/summary");

  return response.summary;
}

export async function getSavedProgressOverviewApiData(): Promise<SavedProgressOverview> {
  const response = await fetchApiJson<{ overview: SavedProgressOverview }>("/api/saved-progress/overview");

  return response.overview;
}

export async function getExamPapersApiData(): Promise<ExamPaper[]> {
  const response = await fetchApiJson<{ papers: ExamPaper[] }>("/api/exams/papers");

  return response.papers;
}

export async function getExamSessionApiData(examId: string): Promise<ExamSession> {
  const response = await fetchApiJson<{ session: ExamSession }>(
    `/api/exams/session/${encodeURIComponent(examId)}`,
  );

  return response.session;
}

export async function getTimedAssessmentDefinitionsApiData(): Promise<TimedAssessmentDefinition[]> {
  const response = await fetchApiJson<{ assessments: TimedAssessmentDefinition[] }>(
    "/api/assessments/definitions",
  );

  return response.assessments;
}

export async function getTimedAssessmentSeedApiData(
  assessmentId: string,
  selectedDurationMinutes?: number,
): Promise<TimedAssessmentAttemptSeed> {
  const searchParams = new URLSearchParams();

  if (selectedDurationMinutes !== undefined) {
    searchParams.set("durationMinutes", String(selectedDurationMinutes));
  }

  const query = searchParams.toString();
  const response = await fetchApiJson<{ seed: TimedAssessmentAttemptSeed }>(
    `/api/assessments/seed/${encodeURIComponent(assessmentId)}${query ? `?${query}` : ""}`,
  );

  return response.seed;
}

export async function getAccessibilitySnapshotApiData(): Promise<AccessibilitySnapshot> {
  const response = await fetchApiJson<{ snapshot: AccessibilitySnapshot }>(
    "/api/accessibility/snapshot",
  );

  return response.snapshot;
}

export async function getReadAloudSessionApiData(
  contentType: ReadAloudContentType,
): Promise<ReadAloudSession> {
  const searchParams = new URLSearchParams({
    contentType,
  });
  const response = await fetchApiJson<{ session: ReadAloudSession }>(
    `/api/read-aloud/session?${searchParams.toString()}`,
  );

  return response.session;
}

export async function getStudentRecommendationsApiData(): Promise<Recommendation[]> {
  const response = await fetchApiJson<{ recommendations: Recommendation[] }>("/api/recommendations");

  return response.recommendations;
}

export async function getRecommendationsPageApiData(): Promise<RecommendationsPageData> {
  const response = await fetchApiJson<{ recommendationsPage: RecommendationsPageData }>(
    "/api/recommendations/page",
  );

  return response.recommendationsPage;
}

export async function getAccountOverviewApiData(): Promise<AccountOverview> {
  const response = await fetchApiJson<{ account: AccountOverview }>("/api/account/overview");

  return response.account;
}

export async function getResultsOverviewApiData(): Promise<ResultsOverview> {
  const response = await fetchApiJson<{ results: ResultsOverview }>("/api/results/overview");

  return response.results;
}

export async function getSupportHubApiData(): Promise<SupportHubData> {
  const response = await fetchApiJson<{ support: SupportHubData }>("/api/support/hub");

  return response.support;
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

export async function getSubjectsExperienceApiData(): Promise<SubjectsExperienceData> {
  const response = await fetchApiJson<{ experience: SubjectsExperienceData }>(
    "/api/subjects/experience",
  );

  return response.experience;
}
