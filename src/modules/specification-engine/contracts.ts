import type { SubjectLibraryLearningObjective, SubjectLibraryValidationResult } from "./types";

export type SpecificationEngineContractRoute = "GET /content/specification-library";

export interface GetSpecificationLibraryResponse {
  objectives: SubjectLibraryLearningObjective[];
  validation: SubjectLibraryValidationResult;
}
