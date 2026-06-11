import { getDefaultCmsWorkflowRepository } from "@/lib/server/repositories";
import { getContentEditorialAudit, getMvpContentCatalog, isTopicStudentVisible } from "@/modules/content/service";
import type {
  CmsContentReference,
  CmsEditorialWorkflowRecord,
  CmsOverview,
  CmsProvider,
  CmsReleaseChecklistModule,
  ReleaseCheckStatus,
} from "./types";

const defaultRepository = getDefaultCmsWorkflowRepository();

const cmsProviders: CmsProvider[] = [
  {
    providerId: "seed-content-provider",
    name: "Seed Content Provider",
    type: "seed-content",
    description: "Current MVP source for subjects, topics, revision stacks, and quiz prompts.",
    syncStatus: "healthy",
    lastSyncedAt: "2026-06-06T09:10:00.000Z",
    nextStep: "Keep serving the website while repository-backed content storage is added.",
  },
  {
    providerId: "headless-cms-provider",
    name: "Future Headless CMS",
    type: "headless-cms",
    description: "Planned source for editor-managed revision content, topic copy, and launch metadata.",
    syncStatus: "planned",
    nextStep: "Add repository adapter and publishing workflow before replacing seed content.",
  },
  {
    providerId: "manual-upload-provider",
    name: "Manual Upload Gateway",
    type: "manual-upload",
    description: "Fallback import path for structured CSV or JSON content updates during MVP growth.",
    syncStatus: "planned",
    nextStep: "Use for controlled imports before full CMS tooling is prioritised.",
  },
];

const releaseChecklistDefinitions = [
  {
    moduleId: "exam-engine",
    title: "Exam Engine",
    priorityOrder: 1,
    summary: "Full-paper continuity, timing trust, saved review state, and support carry-over now have an explicit MVP release pass.",
    checks: [
      {
        checkId: "exam-start-resume-submit-review",
        label: "Start / resume / submit / reopen review continuity",
        status: "complete",
        detail: "Exam sessions can start, autosave, resume by question, submit, and reopen through results or review flows.",
      },
      {
        checkId: "exam-saved-progress-correctness",
        label: "Saved-progress correctness",
        status: "complete",
        detail: "Final browser snapshots save before submission and stale follow-up saves no longer overwrite submitted exam state.",
      },
      {
        checkId: "exam-results-consistency",
        label: "Results consistency",
        status: "complete",
        detail: "Results score from the saved generated question set and saved responses rather than a disconnected result-only map.",
      },
      {
        checkId: "exam-support-carry-over",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Timing, read aloud, and accessibility support snapshots now stay visible in live, saved, and result routes.",
      },
      {
        checkId: "exam-safe-fallback",
        label: "Safe fallback when linked data is missing",
        status: "watch",
        detail: "Saved-progress fallback summaries exist, but broader route-level empty and degraded states still need a fuller cross-route pass.",
      },
    ],
  },
  {
    moduleId: "power-grid",
    title: "Power Grid",
    priorityOrder: 2,
    summary: "Progress meaning, next-action guidance, and review routing are aligned with saved session evidence.",
    checks: [
      {
        checkId: "power-grid-session-routing",
        label: "Resume / review routing consistency",
        status: "complete",
        detail: "Power Grid now follows shared saved-progress recovery decisions instead of inventing route behaviour locally.",
      },
      {
        checkId: "power-grid-results-alignment",
        label: "Results and recommendation alignment",
        status: "complete",
        detail: "Next actions and progress interpretation now read the same saved session insights that results and recommendations use.",
      },
      {
        checkId: "power-grid-support-carry-over",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Support-aware signals now flow through saved session insights into Power Grid and downstream recommendations.",
      },
      {
        checkId: "power-grid-safe-fallback",
        label: "Safe fallback behaviour",
        status: "watch",
        detail: "The module is safer around saved-state routing, but broader missing-data fallback messaging still needs a more explicit product pass.",
      },
    ],
  },
  {
    moduleId: "saved-progress",
    title: "Saved Progress",
    priorityOrder: 3,
    summary: "Saved state is now treated as a critical system with shared recovery, insights, and support snapshot carry-over.",
    checks: [
      {
        checkId: "saved-progress-recovery",
        label: "Resume-ready and review-ready continuity",
        status: "complete",
        detail: "Sessions now resolve into one shared recovery decision for resume versus results or review.",
      },
      {
        checkId: "saved-progress-correctness",
        label: "Saved-progress correctness",
        status: "complete",
        detail: "Normalization rebuilds safe checkpoint state and blocks stale post-submit writes from reviving completed work.",
      },
      {
        checkId: "saved-progress-support-carry-over",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Support snapshots are now visible before, during, and after the live session across saved-progress-linked routes.",
      },
      {
        checkId: "saved-progress-fallback",
        label: "Safe fallback behaviour",
        status: "complete",
        detail: "Fallback saved-progress summaries exist when linked exam or timed-assessment metadata is unavailable.",
      },
    ],
  },
  {
    moduleId: "read-aloud",
    title: "Read Aloud",
    priorityOrder: 4,
    summary: "Read-aloud support now behaves like a shared product capability rather than a standalone preview.",
    checks: [
      {
        checkId: "read-aloud-live-flows",
        label: "Live exam and checkpoint coverage",
        status: "complete",
        detail: "Read aloud is present inside active exam and timed-assessment routes and reflects shared access-arrangement state.",
      },
      {
        checkId: "read-aloud-preference-carry-over",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Preferred reading speed now saves through the shared support profile and becomes the default for later sessions.",
      },
      {
        checkId: "read-aloud-post-session-visibility",
        label: "Saved and result visibility",
        status: "complete",
        detail: "Support snapshots now show the read-aloud defaults and related support context in saved-progress and result summaries.",
      },
      {
        checkId: "read-aloud-safe-fallback",
        label: "Safe fallback behaviour",
        status: "watch",
        detail: "Core preview behaviour is present, but voice availability and browser-specific failure messaging still need a stronger resilience pass.",
      },
    ],
  },
  {
    moduleId: "dashboard",
    title: "Dashboard",
    priorityOrder: 5,
    summary: "The home surface now reflects real saved session state, support context, and next-step prioritisation.",
    checks: [
      {
        checkId: "dashboard-next-session",
        label: "Active session priority and route continuity",
        status: "complete",
        detail: "Dashboard ordering now prioritises active work ahead of submitted review work and uses saved recovery links.",
      },
      {
        checkId: "dashboard-support-visibility",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Support summaries and preference chips now surface on the dashboard and its session cards before a learner resumes work.",
      },
      {
        checkId: "dashboard-recommendation-alignment",
        label: "Recommendation consistency",
        status: "complete",
        detail: "Dashboard guidance follows the same saved-progress and Power Grid decisions that recommendations and results consume.",
      },
      {
        checkId: "dashboard-safe-fallback",
        label: "Safe fallback behaviour",
        status: "watch",
        detail: "The route is stable with seeded data, but more explicit degraded-state messaging for missing upstream data is still pending.",
      },
    ],
  },
  {
    moduleId: "timed-assessment",
    title: "Timed Assessments",
    priorityOrder: 6,
    summary: "Timed checkpoints now have real session continuity, countdown timing, support visibility, and result-source alignment.",
    checks: [
      {
        checkId: "assessment-start-resume-submit-review",
        label: "Start / resume / submit / reopen review continuity",
        status: "complete",
        detail: "Timed assessments now run as full saved sessions with question-level deep-link resume and submitted review reopen flows.",
      },
      {
        checkId: "assessment-results-consistency",
        label: "Results consistency",
        status: "complete",
        detail: "Results score from the saved checkpoint question set rather than a separate hardcoded answer-key assumption.",
      },
      {
        checkId: "assessment-support-carry-over",
        label: "Support-setting carry-over",
        status: "complete",
        detail: "Adjusted timing, read aloud, and support snapshot visibility now stay attached to the checkpoint route and saved aftermath.",
      },
      {
        checkId: "assessment-safe-fallback",
        label: "Safe fallback behaviour",
        status: "watch",
        detail: "The saved-progress layer falls back safely, but broader route-level missing-data and interrupted-session messaging still needs another pass.",
      },
    ],
  },
] satisfies Omit<CmsReleaseChecklistModule, "status">[];

function getReleaseChecklistStatus(checks: CmsReleaseChecklistModule["checks"]): ReleaseCheckStatus {
  if (checks.every((check) => check.status === "complete")) {
    return "complete";
  }

  if (checks.some((check) => check.status === "in-progress")) {
    return "in-progress";
  }

  return "watch";
}

const releaseChecklist: CmsReleaseChecklistModule[] = releaseChecklistDefinitions.map((module) => ({
  ...module,
  status: getReleaseChecklistStatus(module.checks),
}));

export async function getCmsOverview(): Promise<CmsOverview> {
  const [catalog, editorialAudit] = await Promise.all([
    getMvpContentCatalog(),
    getContentEditorialAudit(),
  ]);
  const content: CmsContentReference[] = [];

  for (const subject of catalog.subjects) {
    const subjectTopics = catalog.topics.filter((topic) => topic.subjectId === subject.subjectId);
    const subjectVisible = subjectTopics.some(isTopicStudentVisible);

    content.push({
      contentId: `subject-${subject.subjectId}`,
      kind: "subject",
      title: subject.name,
      subjectId: subject.subjectId,
      status: subjectVisible ? "published" : "draft",
      studentVisible: subjectVisible,
      updatedAt: "2026-06-06T08:45:00.000Z",
      sourceProviderId: "seed-content-provider",
    });

    for (const topic of subjectTopics) {
      const studentVisible = isTopicStudentVisible(topic);

      content.push({
        contentId: `topic-${topic.topicId}`,
        kind: "topic",
        title: topic.name,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });

      content.push({
        contentId: topic.revision.contentId,
        kind: "revision",
        title: topic.revision.title,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });

      content.push({
        contentId: `quiz-${topic.quiz.questionId}`,
        kind: "quiz",
        title: `Quiz prompt for ${topic.name}`,
        subjectId: topic.subjectId,
        topicId: topic.topicId,
        status: topic.metadata.publicationStatus,
        reviewStatus: topic.metadata.reviewStatus,
        studentVisible,
        sourceReference: topic.metadata.sourceAttribution.sourceReference,
        updatedAt: topic.metadata.lastUpdatedAt,
        sourceProviderId: topic.metadata.sourceAttribution.providerId,
      });
    }
  }

  const editorialWorkflow = await getCmsEditorialWorkflow(content);

  return {
    providers: cmsProviders,
    content,
    publishedCount: content.filter((item) => item.status === "published").length,
    draftCount: content.filter((item) => item.status === "draft").length,
    studentVisibleCount: content.filter((item) => item.studentVisible).length,
    blockedCount: content.filter((item) => !item.studentVisible).length,
    editorialAudit,
    nextUpdatePlan:
      "Keep the website on reviewed seed content now, then add a headless CMS adapter and approval workflow without changing student routes.",
    releaseChecklist,
    editorialWorkflow,
    editorialWorkflowSummary: {
      queuedReviewCount: editorialWorkflow.filter((item) => item.status === "queued-review").length,
      factCheckCount: editorialWorkflow.filter((item) => item.status === "fact-check").length,
      approvedCount: editorialWorkflow.filter((item) => item.status === "approved").length,
      blockedCount: editorialWorkflow.filter((item) => item.status === "blocked").length,
    },
  };
}

export async function updateCmsEditorialWorkflowRecord(input: {
  contentId: string;
  status: CmsEditorialWorkflowRecord["status"];
  note: string;
  owner?: string;
}): Promise<CmsEditorialWorkflowRecord | null> {
  const overview = await getCmsOverview();
  const reference = overview.content.find((item) => item.contentId === input.contentId);

  if (!reference) {
    return null;
  }

  const records = await defaultRepository.listRecords();
  const nextRecord: CmsEditorialWorkflowRecord = {
    contentId: input.contentId,
    title: reference.title,
    status: input.status,
    owner: input.owner ?? "Switch editorial desk",
    note: input.note,
    updatedAt: new Date().toISOString(),
    readyToPublish: input.status === "approved" && reference.status === "published",
  };
  const nextRecords = records
    .filter((record) => record.contentId !== input.contentId)
    .concat(nextRecord)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  await defaultRepository.replaceRecords(nextRecords);

  return nextRecord;
}

async function getCmsEditorialWorkflow(
  content: CmsContentReference[],
): Promise<CmsEditorialWorkflowRecord[]> {
  const records = await defaultRepository.listRecords();
  const recordByContentId = new Map(records.map((record) => [record.contentId, record] as const));

  return content
    .filter((item) => item.kind !== "subject")
    .map((item) => {
      const existing = recordByContentId.get(item.contentId);

      if (existing) {
        return {
          ...existing,
          title: item.title,
          readyToPublish: existing.status === "approved" && item.status === "published",
        };
      }

      return {
        contentId: item.contentId,
        title: item.title,
        status: getDefaultWorkflowStatus(item),
        owner: "Switch editorial desk",
        note: getDefaultWorkflowNote(item),
        updatedAt: item.updatedAt,
        readyToPublish: item.studentVisible,
      };
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function getDefaultWorkflowStatus(
  item: CmsContentReference,
): CmsEditorialWorkflowRecord["status"] {
  if (!item.studentVisible) {
    if (item.reviewStatus === "reviewed") {
      return "fact-check";
    }

    return "queued-review";
  }

  return "approved";
}

function getDefaultWorkflowNote(item: CmsContentReference): string {
  if (item.studentVisible) {
    return "This content is already meeting the current student-visibility gate.";
  }

  if (item.reviewStatus === "reviewed") {
    return "Reviewed content still needs fact-check or source verification before student release.";
  }

  return "Content is waiting for the next editorial review step before publication.";
}
