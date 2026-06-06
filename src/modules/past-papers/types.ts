export type PastPaperSourceType = "seed-catalog" | "board-source" | "licensed-storage";

export type PastPaperAvailability = "available" | "metadata-only" | "planned";

export interface PastPaper {
  paperId: string;
  subjectId: string;
  title: string;
  board: string;
  qualificationType: string;
  year: number;
  tier?: string;
  paperName: string;
  sourceProviderId: string;
  availability: PastPaperAvailability;
  questionPaperUrl?: string;
  markSchemeUrl?: string;
}

export interface PastPaperSourceProvider {
  providerId: string;
  name: string;
  type: PastPaperSourceType;
  description: string;
  updateCadence: string;
  lastCheckedAt?: string;
  nextStep: string;
}

export interface PastPaperCatalogOverview {
  providers: PastPaperSourceProvider[];
  papers: PastPaper[];
  availableCount: number;
  metadataOnlyCount: number;
  nextUpdatePlan: string;
}
