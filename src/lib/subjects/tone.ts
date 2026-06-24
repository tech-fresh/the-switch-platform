import type { NavAccent } from "@/components/mock-idea/brand-tokens";
import { listStudentVisibleContentSubjects } from "@/modules/content/service";

const ACCENT_CYCLE: NavAccent[] = ["teal", "emerald", "amber", "sky", "rose"];

export function resolveSubjectToneById(subjectId: string): NavAccent {
  const subjects = listStudentVisibleContentSubjects();
  const index = subjects.findIndex((subject) => subject.subjectId === subjectId);

  if (index < 0) {
    return "teal";
  }

  return ACCENT_CYCLE[index % ACCENT_CYCLE.length];
}

export function resolveCatalogSubjectByLabel(subjectLabel: string) {
  const normalized = subjectLabel.trim().toLowerCase();

  return listStudentVisibleContentSubjects().find((subject) => {
    const name = subject.name.toLowerCase();
    const shortName = name.replace(/^(gcse|igcse)\s+/i, "");

    return (
      name === normalized ||
      shortName === normalized ||
      name.includes(normalized) ||
      normalized.includes(shortName)
    );
  });
}

export function resolveSubjectToneByLabel(subjectLabel: string): NavAccent {
  const match = resolveCatalogSubjectByLabel(subjectLabel);

  return match ? resolveSubjectToneById(match.subjectId) : "teal";
}
