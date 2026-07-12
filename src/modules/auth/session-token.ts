import { createHmac, timingSafeEqual } from "node:crypto";

import type { AuthProvider, AuthenticatedAuthSession } from "./types";

const SESSION_TOKEN_PURPOSE = "switch-auth-session";
const FLOW_TOKEN_PURPOSE = "switch-auth-flow";

export interface AuthFlowState {
  provider: AuthProvider;
  state: string;
  codeVerifier: string;
  returnTo: string;
  createdAt: string;
  expiresAt: string;
}

export function isSameAuthFlowState(left: AuthFlowState, right: AuthFlowState): boolean {
  return (
    left.provider === right.provider &&
    left.state === right.state &&
    left.codeVerifier === right.codeVerifier &&
    left.returnTo === right.returnTo &&
    left.createdAt === right.createdAt &&
    left.expiresAt === right.expiresAt
  );
}

interface TokenEnvelope<TPayload> {
  payload: TPayload;
  purpose: string;
}

export function createSessionToken(
  session: AuthenticatedAuthSession,
  secret: string,
): string {
  return signToken({ payload: session, purpose: SESSION_TOKEN_PURPOSE }, secret);
}

export function readSessionToken(
  token: string | null | undefined,
  secret: string,
): AuthenticatedAuthSession | null {
  const envelope = readToken<AuthenticatedAuthSession>(token, secret);

  if (!envelope || envelope.purpose !== SESSION_TOKEN_PURPOSE) {
    return null;
  }

  if (new Date(envelope.payload.expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return envelope.payload;
}

export function createAuthFlowToken(state: AuthFlowState, secret: string): string {
  return signToken({ payload: state, purpose: FLOW_TOKEN_PURPOSE }, secret);
}

export function readAuthFlowToken(
  token: string | null | undefined,
  secret: string,
): AuthFlowState | null {
  const envelope = readToken<AuthFlowState>(token, secret);

  if (!envelope || envelope.purpose !== FLOW_TOKEN_PURPOSE) {
    return null;
  }

  if (new Date(envelope.payload.expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return envelope.payload;
}

function signToken<TPayload>(envelope: TokenEnvelope<TPayload>, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(envelope)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

function readToken<TPayload>(token: string | null | undefined, secret: string): TokenEnvelope<TPayload> | null {
  if (!token) {
    return null;
  }

  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const encodedPayload = token.slice(0, separatorIndex);
  const providedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (!safeCompare(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as TokenEnvelope<TPayload>;
  } catch {
    return null;
  }
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
