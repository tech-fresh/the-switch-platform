import type { QualificationPath } from "./types";

export function qualificationPathToCatalogType(
  qualificationPath: QualificationPath,
): "GCSE" | "IGCSE" {
  return qualificationPath === "igcse" ? "IGCSE" : "GCSE";
}
