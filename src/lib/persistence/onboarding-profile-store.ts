import type { LearnerOnboardingProfile } from "@/modules/onboarding/types";

import { createJsonFileCollectionStore } from "./json-file-store";
import { createMemoryCollectionStore } from "./memory-store";
import { getPersistenceRuntimeConfig } from "./runtime";
import { createSqliteCollectionStore } from "./sqlite-store";

const runtimeConfig = getPersistenceRuntimeConfig();
const store =
  runtimeConfig.driver === "memory"
    ? createMemoryCollectionStore<LearnerOnboardingProfile>("onboarding-profiles.profiles")
    : runtimeConfig.driver === "sqlite"
      ? createSqliteCollectionStore<LearnerOnboardingProfile>({
          collectionKey: "onboarding-profiles.profiles",
          databasePath: runtimeConfig.primaryStorePath,
          backupDatabasePath: runtimeConfig.backupStorePath,
        })
      : createJsonFileCollectionStore<LearnerOnboardingProfile>({
          filename: "onboarding-profiles.json",
          collectionKey: "profiles",
          directory: runtimeConfig.dataDirectory,
          backupDirectory: runtimeConfig.backupDirectory,
        });

export async function readOnboardingProfiles(): Promise<LearnerOnboardingProfile[]> {
  return store.read();
}

export async function writeOnboardingProfiles(
  profiles: LearnerOnboardingProfile[],
): Promise<void> {
  return store.write(profiles);
}
