import type { PastPaper, PastPaperCatalogOverview, PastPaperSourceProvider } from "./types";

const pastPaperProviders: PastPaperSourceProvider[] = [
  {
    providerId: "seed-paper-catalog",
    name: "Reviewed Paper Catalog",
    type: "seed-catalog",
    description: "Current live operating catalog for reviewed paper metadata and controlled source links.",
    updateCadence: "editorial release cadence",
    lastCheckedAt: "2026-06-06T09:05:00.000Z",
    nextStep: "Keep the catalog current through the live editorial workflow and only attach links that pass source and licensing checks.",
  },
  {
    providerId: "exam-board-source",
    name: "Exam Board Source Adapter",
    type: "board-source",
    description: "Operating adapter boundary for official board-hosted metadata and links where permitted.",
    updateCadence: "termly or on release windows",
    nextStep: "Use this path for validated board links without bypassing catalog review or licensing checks.",
  },
  {
    providerId: "licensed-paper-storage",
    name: "Licensed Paper Storage",
    type: "licensed-storage",
    description: "Controlled storage boundary for licensed document references and internal paper mirrors.",
    updateCadence: "on ingestion",
    nextStep: "Use this storage path only for sources that are approved for retained internal references.",
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
    availability: "available",
    questionPaperUrl: "https://example.com/papers/aqa-maths-2024-paper-1",
    markSchemeUrl: "https://example.com/papers/aqa-maths-2024-paper-1-mark-scheme",
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
    availability: "available",
    questionPaperUrl: "https://example.com/papers/edexcel-english-2024-paper-1",
    markSchemeUrl: "https://example.com/papers/edexcel-english-2024-paper-1-mark-scheme",
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
    availability: "catalogued",
  },
];

export async function getPastPaperCatalogOverview(): Promise<PastPaperCatalogOverview> {
  return {
    providers: pastPaperProviders,
    papers: mockPastPapers,
    availableCount: mockPastPapers.filter((paper) => paper.availability === "available").length,
    cataloguedCount: mockPastPapers.filter((paper) => paper.availability === "catalogued").length,
    nextUpdatePlan:
      "Run paper updates through the reviewed catalog, promote validated links through the board-source boundary, and keep licensed storage as the controlled path for retained references.",
  };
}
