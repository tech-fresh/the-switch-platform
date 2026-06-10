import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AuthProvider } from "@/modules/auth/types";

const storeDirectory = path.join(process.cwd(), ".codex-data");
const storePath = path.join(storeDirectory, "auth-sessions.json");
const tempStorePath = path.join(storeDirectory, "auth-sessions.tmp.json");

let writeChain = Promise.resolve();

export interface PersistedAuthSessionRecord {
  sessionToken: string;
  sessionId: string;
  userId: string;
  provider: AuthProvider;
  signedInAt: string;
}

interface AuthSessionStorePayload {
  sessions: PersistedAuthSessionRecord[];
}

export async function readPersistedAuthSessions(): Promise<PersistedAuthSessionRecord[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    const payload = JSON.parse(raw) as AuthSessionStorePayload;

    return Array.isArray(payload.sessions) ? payload.sessions : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writePersistedAuthSessions(
  sessions: PersistedAuthSessionRecord[],
): Promise<void> {
  writeChain = writeChain.then(async () => {
    await mkdir(storeDirectory, { recursive: true });
    await writeFile(
      tempStorePath,
      JSON.stringify({ sessions } satisfies AuthSessionStorePayload, null, 2),
      "utf8",
    );
    await rename(tempStorePath, storePath);
  });

  return writeChain;
}
