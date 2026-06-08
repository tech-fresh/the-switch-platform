import type { ContentEditorialAudit, ContentReviewStatus } from "@/modules/content/types";

export type CmsProviderType = "seed-content" | "headless-cms" | "manual-upload";

export type CmsContentKind = "subject" | "topic" | "revision" | "quiz";

export type ContentPublicationStatus = "draft" | "published" | "scheduled";

export type ContentSyncStatus = "healthy" | "warning" | "planned";

export interface CmsContentReference {
  contentId: string;
  kind: CmsContentKind;
  title: string;
  subjectId?: string;
  topicId?: string;
  status: ContentPublicationStatus;
  reviewStatus?: ContentReviewStatus;
  studentVisible: boolean;
  sourceReference?: string;
  updatedAt: string;
  sourceProviderId: string;
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

export interface CmsOverview {
  providers: CmsProvider[];
  content: CmsContentReference[];
  publishedCount: number;
  draftCount: number;
  studentVisibleCount: number;
  blockedCount: number;
  editorialAudit: ContentEditorialAudit;
  nextUpdatePlan: string;
}
