import { readPersistedAuthSessions } from "@/lib/persistence/auth-session-store";
import { readSavedProgressRecords } from "@/lib/persistence/saved-progress-store";
import { getPersistenceRuntimeSummary } from "@/lib/server/repositories";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";
import { getCmsOverview } from "@/modules/cms/service";
import { getCmsRuntimeConfig } from "@/modules/cms/runtime";
import { listSeedContentTopics } from "@/modules/content/service";
import { getPastPaperCatalogOverview } from "@/modules/past-papers/service";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";
import { buildOperationsOverview } from "./overview";
import type { OperationsOverview } from "./types";

export async function getOperationsOverview(): Promise<OperationsOverview> {
  const [authSessions, savedProgressRecords, cms, papers] = await Promise.all([
    readPersistedAuthSessions(),
    readSavedProgressRecords(),
    getCmsOverview(),
    getPastPaperCatalogOverview(),
  ]);
  const authRuntime = getAuthRuntimeConfig();
  const persistence = await getPersistenceRuntimeSummary();
  const cmsRuntime = getCmsRuntimeConfig();
  const assessments = getMockTimedAssessments();
  const contentTopics = listSeedContentTopics();

  return buildOperationsOverview({
    authMode: authRuntime.mode,
    allowRedirectSignIn: authRuntime.allowRedirectSignIn,
    activeAuthSessions: authSessions.length,
    persistenceDriver: persistence.driver,
    isPrototypePersistence: persistence.isPrototypePersistence,
    dataDirectory: persistence.dataDirectory,
    totalSavedProgressRecords: savedProgressRecords.length,
    submittedSavedProgressCount: savedProgressRecords.filter((record) => record.status === "submitted").length,
    savedProgressWithSupportSnapshots: savedProgressRecords.filter(
      (record) => record.accessArrangementSnapshot,
    ).length,
    assessmentCount: assessments.length,
    examPaperCount: papers.papers.length,
    contentTopicCount: contentTopics.length,
    cmsBackendMode: cmsRuntime.backendMode,
    queuedReviewCount: cms.editorialWorkflowSummary.queuedReviewCount,
    blockedCount: cms.editorialWorkflowSummary.blockedCount,
    rollbackCount: cms.editorialWorkflowSummary.rollbackCount,
  });
}
