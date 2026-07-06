import examInventorySeedJson from "@/data/exam-paper-inventory.json";
import type { ExamBoard } from "@/modules/access-arrangements";
import { getMockExamPapers } from "@/modules/exam-engine/service";
import type { ExamPaper } from "@/modules/exam-engine/types";
import type { QualificationPath } from "@/modules/onboarding/types";
import { listInventoryExamBoardsForQualificationPath } from "./board-options";

import type {
  ExamInventoryCoverageGroup,
  ExamInventoryEntry,
  ExamInventoryFilters,
  ExamInventoryPaper,
  ExamInventorySeed,
  ExamInventorySummary,
  ExamInventoryValidationResult,
} from "./types";

const examInventorySeed = examInventorySeedJson as ExamInventorySeed;

export function listExamInventoryEntries(
  filters: ExamInventoryFilters = {},
): ExamInventoryEntry[] {
  return examInventorySeed.entries
    .filter((entry) => matchesEntryFilters(entry, filters))
    .map((entry) => ({ ...entry }));
}

export function getExamInventoryEntry(examId: string): ExamInventoryEntry {
  const entry = examInventorySeed.entries.find((item) => item.examId === examId);

  if (!entry) {
    throw new Error(`Unknown exam inventory entry: ${examId}`);
  }

  return { ...entry };
}

export function listExamInventoryPapers(
  filters: ExamInventoryFilters = {},
): ExamInventoryPaper[] {
  const papersById = new Map(getMockExamPapers().map((paper) => [paper.examId, paper]));

  return listExamInventoryEntries(filters)
    .map((entry) => {
      const paper = papersById.get(entry.examId);

      if (!paper) {
        return null;
      }

      return {
        ...paper,
        inventory: entry,
      };
    })
    .filter((paper): paper is ExamInventoryPaper => paper !== null);
}

export function listStudentVisibleExamPapers(): ExamPaper[] {
  return listExamInventoryPapers({
    status: "live",
    studentVisibleOnly: true,
  }).map(({ inventory: _inventory, ...paper }) => paper);
}

export function listLiveExamBoardsForQualificationPath(
  qualificationPath: QualificationPath,
): ExamBoard[] {
  return listInventoryExamBoardsForQualificationPath(qualificationPath);
}

export function filterExamPapersByInventory(
  papers: ExamPaper[],
  filters: ExamInventoryFilters = {},
): ExamPaper[] {
  const allowedIds = new Set(listExamInventoryEntries(filters).map((entry) => entry.examId));

  return papers.filter((paper) => allowedIds.has(paper.examId));
}

export function getExamInventorySummary(): ExamInventorySummary {
  const entries = examInventorySeed.entries.map((entry) => ({ ...entry }));
  const liveEntries = entries.filter((entry) => entry.status === "live");
  const studentVisibleEntries = liveEntries.filter((entry) => entry.studentVisibility);

  return {
    inventoryVersion: examInventorySeed.inventoryVersion,
    lastUpdatedAt: examInventorySeed.lastUpdatedAt,
    totalEntries: entries.length,
    liveEntries: liveEntries.length,
    studentVisibleEntries: studentVisibleEntries.length,
    launchMvpEntries: entries.filter((entry) => entry.launchScope === "launch-mvp").length,
    year10Entries: entries.filter((entry) => entry.launchScope === "year-10-progression").length,
    bridgeEntries: entries.filter((entry) => entry.launchScope === "gcse-bridge").length,
    byQualification: buildCoverageGroups(entries, (entry) => entry.qualificationPath),
    bySubject: buildCoverageGroups(entries, (entry) => entry.subjectId),
    byBoard: buildCoverageGroups(entries, (entry) => entry.board),
    byTier: buildCoverageGroups(entries, (entry) => entry.tier),
    byStatus: buildCoverageGroups(entries, (entry) => entry.status),
    coverageGaps: buildCoverageGaps(entries),
  };
}

export function validateExamInventory(): ExamInventoryValidationResult {
  const entries = examInventorySeed.entries;
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const papersById = new Set(getMockExamPapers().map((paper) => paper.examId));

  for (const entry of entries) {
    if (seenIds.has(entry.examId)) {
      errors.push(`Duplicate exam inventory ID found: ${entry.examId}`);
    }

    seenIds.add(entry.examId);

    if (!papersById.has(entry.examId)) {
      errors.push(`Inventory entry ${entry.examId} does not map to a seeded exam paper.`);
    }

    if (!entry.sourceReference.trim()) {
      errors.push(`Inventory entry ${entry.examId} is missing source reference.`);
    }

    if (!entry.subjectId.trim()) {
      errors.push(`Inventory entry ${entry.examId} is missing subject ID.`);
    }

    if (entry.status === "live" && !entry.studentVisibility) {
      errors.push(`Live inventory entry ${entry.examId} must be student-visible or not live.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    counts: {
      entries: entries.length,
      liveEntries: entries.filter((entry) => entry.status === "live").length,
      studentVisibleEntries: entries.filter((entry) => entry.studentVisibility).length,
    },
  };
}

function matchesEntryFilters(entry: ExamInventoryEntry, filters: ExamInventoryFilters): boolean {
  if (filters.qualificationPath && entry.qualificationPath !== filters.qualificationPath) {
    return false;
  }

  if (filters.qualificationType && entry.qualificationType !== filters.qualificationType) {
    return false;
  }

  if (filters.board && entry.board !== filters.board) {
    return false;
  }

  if (filters.subjectId && entry.subjectId !== filters.subjectId) {
    return false;
  }

  if (filters.status && entry.status !== filters.status) {
    return false;
  }

  if (filters.studentVisibleOnly && !entry.studentVisibility) {
    return false;
  }

  if (!filters.includeRetired && entry.status === "retired") {
    return false;
  }

  return true;
}

function buildCoverageGroups(
  entries: ExamInventoryEntry[],
  resolveKey: (entry: ExamInventoryEntry) => string,
): ExamInventoryCoverageGroup[] {
  const grouped = new Map<string, ExamInventoryCoverageGroup>();

  for (const entry of entries) {
    const key = resolveKey(entry);
    const current = grouped.get(key) ?? {
      key,
      label: key,
      total: 0,
      live: 0,
      studentVisible: 0,
    };

    current.total += 1;

    if (entry.status === "live") {
      current.live += 1;
    }

    if (entry.studentVisibility) {
      current.studentVisible += 1;
    }

    grouped.set(key, current);
  }

  return [...grouped.values()].sort((left, right) => left.label.localeCompare(right.label));
}

function buildCoverageGaps(entries: ExamInventoryEntry[]): string[] {
  const gaps: string[] = [];

  for (const qualificationPath of ["gcse-england", "igcse"] as const) {
    const liveEntries = entries.filter(
      (entry) =>
        entry.qualificationPath === qualificationPath &&
        entry.status === "live" &&
        entry.studentVisibility,
    );

    if (liveEntries.length === 0) {
      gaps.push(`No live student-visible papers exist for ${qualificationPath}.`);
    }
  }

  return gaps;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
