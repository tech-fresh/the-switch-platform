import type { StudentAccessProfile } from "@/modules/access-arrangements/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<StudentAccessProfile>("access-profiles.profiles")
    : createJsonFileCollectionStore<StudentAccessProfile>({
        filename: "access-profiles.json",
        collectionKey: "profiles",
        directory: runtimeConfig.dataDirectory,
        backupDirectory: runtimeConfig.backupDirectory,
      });

export async function readAccessProfiles(): Promise<StudentAccessProfile[]> {
  return store.read();
}

export async function writeAccessProfiles(
  profiles: StudentAccessProfile[],
): Promise<void> {
  return store.write(profiles);
}
