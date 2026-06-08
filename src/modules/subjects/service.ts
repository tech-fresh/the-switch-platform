import type { Subject } from "./types";
import { listStudentVisibleContentSubjects } from "@/modules/content/service";

export function getMockSubjects(): Subject[] {
  return listStudentVisibleContentSubjects();
}

export function getMockSubject(subjectId: string): Subject {
  const subject = getMockSubjects().find((item) => item.subjectId === subjectId);

  if (!subject) {
    throw new Error(`Unknown mock subject: ${subjectId}`);
  }

  return subject;
}
