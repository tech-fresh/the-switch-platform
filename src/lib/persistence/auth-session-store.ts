import type { AuthProvider } from "@/modules/auth/types";

import { createJsonFileCollectionStore } from "./json-file-store";

export interface PersistedAuthSessionRecord {
  sessionToken: string;
  sessionId: string;
  userId: string;
  provider: AuthProvider;
  signedInAt: string;
}

const store = createJsonFileCollectionStore<PersistedAuthSessionRecord>({
  filename: "auth-sessions.json",
  collectionKey: "sessions",
});

export async function readPersistedAuthSessions(): Promise<PersistedAuthSessionRecord[]> {
  return store.read();
}

export async function writePersistedAuthSessions(
  sessions: PersistedAuthSessionRecord[],
): Promise<void> {
  return store.write(sessions);
}
