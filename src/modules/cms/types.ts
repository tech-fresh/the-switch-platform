import type {
  ContentEditorialAudit,
  ContentFactCheckStatus,
  ContentReviewStatus,
} from "@/modules/content/types";

export type CmsProviderType = "seed-content" | "headless-cms" | "manual-upload";

export type CmsContentKind = "subject" | "topic" | "revision" | "quiz";
export type CmsEditorialWorkflowStatus =
  | "queued-review"
  | "fact-check"
  | "approved"
  | "blocked";
export type CmsEditorialActionType =
  | "review"
  | "fact-check"
  | "approve"
  | "block"
  | "rollback"
  | "publish-check";

export type ContentPublicationStatus = "draft" | "published" | "scheduled";

export type ContentSyncStatus = "healthy" | "warning" | "planned";
export type ReleaseCheckStatus = "complete" | "in-progress" | "watch";

export interface CmsContentReference {
  contentId: string;
  kind: CmsContentKind;
  title: string;
  subjectId?: string;
  topicId?: string;
  status: ContentPublicationStatus;
  reviewStatus?: ContentReviewStatus;
  factCheckStatus?: ContentFactCheckStatus;
  studentVisible: boolean;
  trustedSourceAttributionComplete?: boolean;
  gateReason?: string;
  sourceReference?: string;
  updatedAt: string;
  sourceProviderId: string;
}

export interface CmsPublishGateCheck {
  checkId: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface CmsPublishGateSummary {
  readyToPublish: boolean;
  blockedReasons: string[];
  checks: CmsPublishGateCheck[];
}

export interface CmsProvider {
  providerId: string;
  name: string;
  type: CmsProviderType;
  description: string;
  syncStatus: ContentSyncStatus;
  lastSyncedAt?: string;
  nextStep: string;
}

export interface CmsReleaseCheck {
  checkId: string;
  label: string;
  status: ReleaseCheckStatus;
  detail: string;
}

export interface CmsReleaseChecklistModule {
  moduleId: string;
  title: string;
  priorityOrder: number;
  summary: string;
  status: ReleaseCheckStatus;
  checks: CmsReleaseCheck[];
}

export interface CmsEditorialWorkflowEvent {
  eventId: string;
  actionType: CmsEditorialActionType;
  fromStatus: CmsEditorialWorkflowStatus;
  toStatus: CmsEditorialWorkflowStatus;
  owner: string;
  note: string;
  createdAt: string;
}

export interface CmsEditorialWorkflowRecord {
  contentId: string;
  title: string;
  status: CmsEditorialWorkflowStatus;
  owner: string;
  note: string;
  updatedAt: string;
  readyToPublish: boolean;
  publishGate: CmsPublishGateSummary;
  actionHistory: CmsEditorialWorkflowEvent[];
  lastActionType: CmsEditorialActionType;
}

export interface CmsEditorialWorkflowSummary {
  queuedReviewCount: number;
  factCheckCount: number;
  approvedCount: number;
  blockedCount: number;
  rollbackCount: number;
}

export interface CmsOverview {
  backendMode: "live" | "read-only";
  providers: CmsProvider[];
  content: CmsContentReference[];
  publishedCount: number;
  draftCount: number;
  studentVisibleCount: number;
  blockedCount: number;
  editorialAudit: ContentEditorialAudit;
  nextUpdatePlan: string;
  releaseChecklist: CmsReleaseChecklistModule[];
  editorialWorkflow: CmsEditorialWorkflowRecord[];
  editorialWorkflowSummary: CmsEditorialWorkflowSummary;
}
