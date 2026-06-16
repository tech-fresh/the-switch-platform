import type { GovernanceEvidenceRecord, GovernanceStatus } from "./types";

export class GovernanceRouteValidationError extends Error {}

export interface GovernanceReviewPatchInput {
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
}

export interface GovernanceSignOffPatchInput {
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
}

export interface GovernanceEvidencePatchInput {
  status: GovernanceEvidenceRecord["status"];
  owner: string;
  summary: string;
  environment: string;
}

export interface GovernanceEnvironmentPatchInput {
  status: GovernanceStatus;
  owner: string;
  detail: string;
  environment: string;
}

export interface GovernanceSmokePatchInput {
  status: GovernanceStatus;
  owner: string;
  note: string;
  environment: string;
}

export function parseGovernanceReviewPatchInput(
  payload: Partial<{
    status: GovernanceStatus;
    owner: string;
    note: string;
    environment: string;
  }>,
  fallbackOwner: string,
): GovernanceReviewPatchInput {
  return {
    status: parseGovernanceStatus(payload.status),
    owner: normalizeOwner(payload.owner, fallbackOwner),
    note: payload.note?.trim() ?? "",
    environment: payload.environment?.trim() ?? "",
  };
}

export function parseGovernanceSignOffPatchInput(
  payload: Partial<{
    status: GovernanceStatus;
    owner: string;
    note: string;
    environment: string;
  }>,
  fallbackOwner: string,
): GovernanceSignOffPatchInput {
  return {
    status: parseGovernanceStatus(payload.status),
    owner: normalizeOwner(payload.owner, fallbackOwner),
    note: payload.note?.trim() ?? "",
    environment: payload.environment?.trim() ?? "",
  };
}

export function parseGovernanceEvidencePatchInput(
  payload: Partial<{
    status: GovernanceEvidenceRecord["status"];
    owner: string;
    summary: string;
    environment: string;
  }>,
  fallbackOwner: string,
): GovernanceEvidencePatchInput {
  return {
    status: parseGovernanceEvidenceStatus(payload.status),
    owner: normalizeOwner(payload.owner, fallbackOwner),
    summary: payload.summary?.trim() ?? "",
    environment: payload.environment?.trim() ?? "",
  };
}

export function parseGovernanceEnvironmentPatchInput(
  payload: Partial<{
    status: GovernanceStatus;
    owner: string;
    detail: string;
    environment: string;
  }>,
  fallbackOwner: string,
): GovernanceEnvironmentPatchInput {
  return {
    status: parseGovernanceStatus(payload.status),
    owner: normalizeOwner(payload.owner, fallbackOwner),
    detail: payload.detail?.trim() ?? "",
    environment: payload.environment?.trim() ?? "",
  };
}

export function parseGovernanceSmokePatchInput(
  payload: Partial<{
    status: GovernanceStatus;
    owner: string;
    note: string;
    environment: string;
  }>,
  fallbackOwner: string,
): GovernanceSmokePatchInput {
  return {
    status: parseGovernanceStatus(payload.status),
    owner: normalizeOwner(payload.owner, fallbackOwner),
    note: payload.note?.trim() ?? "",
    environment: payload.environment?.trim() ?? "",
  };
}

function parseGovernanceStatus(value: GovernanceStatus | undefined): GovernanceStatus {
  if (value === "ready" || value === "watch") {
    return value;
  }

  throw new GovernanceRouteValidationError("status must be ready or watch.");
}

function parseGovernanceEvidenceStatus(
  value: GovernanceEvidenceRecord["status"] | undefined,
): GovernanceEvidenceRecord["status"] {
  if (value === "recorded" || value === "still-needed") {
    return value;
  }

  throw new GovernanceRouteValidationError("status must be recorded or still-needed.");
}

function normalizeOwner(value: string | undefined, fallbackOwner: string): string {
  return value?.trim() || fallbackOwner;
}
