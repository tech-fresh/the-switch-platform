import type { PastPaper, PastPaperCatalogOverview, PastPaperSourceProvider } from "./types";

const pastPaperProviders: PastPaperSourceProvider[] = [
  {
    providerId: "seed-paper-catalog",
    name: "Seed Paper Catalog",
    type: "seed-catalog",
    description: "Current MVP source for paper metadata and source planning.",
    updateCadence: "manual during MVP",
    lastCheckedAt: "2026-06-06T09:05:00.000Z",
    nextStep: "Keep paper metadata stable while source adapters are built.",
  },
  {
    providerId: "exam-board-source",
    name: "Exam Board Source Adapter",
    type: "board-source",
    description: "Planned adapter for official board-hosted paper metadata and links where permitted.",
    updateCadence: "termly or on release windows",
    nextStep: "Add board-specific retrieval and validation rules before production rollout.",
  },
  {
    providerId: "licensed-paper-storage",
    name: "Licensed Paper Storage",
    type: "licensed-storage",
    description: "Future controlled storage for cached metadata and licensed document references.",
    updateCadence: "on ingestion",
    nextStep: "Use when legal/licensing and storage decisions are finalised.",
  },
];

const mockPastPapers: PastPaper[] = [
  {
    paperId: "pp-aqa-maths-2024-p1",
    subjectId: "gcse-maths",
    title: "GCSE Mathematics Paper 1",
    board: "AQA",
    qualificationType: "GCSE",
    year: 2024,
    tier: "HIGHER",
    paperName: "Paper 1",
    sourceProviderId: "seed-paper-catalog",
    availability: "metadata-only",
  },
  {
    paperId: "pp-edexcel-english-2024-p1",
    subjectId: "gcse-english-language",
    title: "GCSE English Language Paper 1",
    board: "Edexcel",
    qualificationType: "GCSE",
    year: 2024,
    tier: "FOUNDATION",
    paperName: "Paper 1",
    sourceProviderId: "seed-paper-catalog",
    availability: "metadata-only",
  },
  {
    paperId: "pp-aqa-science-2024-chem",
    subjectId: "gcse-combined-science",
    title: "GCSE Combined Science Chemistry",
    board: "AQA",
    qualificationType: "GCSE",
    year: 2024,
    paperName: "Chemistry Paper",
    sourceProviderId: "seed-paper-catalog",
    availability: "planned",
  },
];

export async function getPastPaperCatalogOverview(): Promise<PastPaperCatalogOverview> {
  return {
    providers: pastPaperProviders,
    papers: mockPastPapers,
    availableCount: mockPastPapers.filter((paper) => paper.availability === "available").length,
    metadataOnlyCount: mockPastPapers.filter((paper) => paper.availability === "metadata-only").length,
    nextUpdatePlan:
      "Start with metadata and source adapters first, then attach licensed or official paper links once sourcing rules are confirmed.",
  };
}
