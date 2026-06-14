import { randomUUID } from "node:crypto";

export interface OperationsEvent {
  eventId: string;
  domain: "auth" | "saved-progress" | "assessment" | "exam" | "editorial";
  action: string;
  status: "success" | "warning" | "failure";
  occurredAt: string;
  userId?: string;
  entityId?: string;
  detail: string;
}

export function buildOperationsEvent(input: Omit<OperationsEvent, "eventId" | "occurredAt"> & {
  eventId?: string;
  occurredAt?: string;
}): OperationsEvent {
  return {
    eventId: input.eventId ?? `ops-${randomUUID()}`,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    domain: input.domain,
    action: input.action,
    status: input.status,
    userId: input.userId,
    entityId: input.entityId,
    detail: input.detail,
  };
}

export function recordOperationsEvent(event: OperationsEvent): void {
  const message = `[switch:ops] ${JSON.stringify(event)}`;

  if (event.status === "failure") {
    console.error(message);
    return;
  }

  if (event.status === "warning") {
    console.warn(message);
    return;
  }

  console.info(message);
}
