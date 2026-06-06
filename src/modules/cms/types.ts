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
  nextUpdatePlan: string;
}
