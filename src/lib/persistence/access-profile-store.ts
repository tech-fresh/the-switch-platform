import type { StudentAccessProfile } from "@/modules/access-arrangements/types";

import { createJsonFileCollectionStore } from "./json-file-store";

const store = createJsonFileCollectionStore<StudentAccessProfile>({
  filename: "access-profiles.json",
  collectionKey: "profiles",
});

export async function readAccessProfiles(): Promise<StudentAccessProfile[]> {
  return store.read();
}

export async function writeAccessProfiles(
  profiles: StudentAccessProfile[],
): Promise<void> {
  return store.write(profiles);
}
