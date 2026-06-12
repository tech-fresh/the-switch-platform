import type { AuthProvider } from "@/modules/auth/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";

export interface PersistedAuthSessionRecord {
  sessionToken: string;
  sessionId: string;
  userId: string;
  provider: AuthProvider;
  signedInAt: string;
}

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<PersistedAuthSessionRecord>("auth-sessions.sessions")
    : createJsonFileCollectionStore<PersistedAuthSessionRecord>({
        filename: "auth-sessions.json",
        collectionKey: "sessions",
        directory: runtimeConfig.dataDirectory,
      });

export async function readPersistedAuthSessions(): Promise<PersistedAuthSessionRecord[]> {
  return store.read();
}

export async function writePersistedAuthSessions(
  sessions: PersistedAuthSessionRecord[],
): Promise<void> {
  return store.write(sessions);
}
