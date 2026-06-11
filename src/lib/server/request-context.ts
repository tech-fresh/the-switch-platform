import { getDefaultSavedProgressRepository, getDefaultStudentAccessProfileRepository } from "@/lib/server/repositories";
import { getRequestAuthSession } from "@/modules/auth/request";
import { getAuthUserIdFromSession } from "@/modules/auth/service";
import type { AuthSession } from "@/modules/auth/types";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements/types";
import type { SavedProgressRepository } from "@/modules/saved-progress/types";

export interface SwitchRequestContext {
  session: AuthSession;
  userId: string;
  repositories: {
    savedProgress: SavedProgressRepository;
    accessProfiles: StudentAccessProfileRepository;
  };
}

export async function getSwitchRequestContext(): Promise<SwitchRequestContext> {
  const session = await getRequestAuthSession();

  return {
    session,
    userId: getAuthUserIdFromSession(session),
    repositories: {
      savedProgress: getDefaultSavedProgressRepository(),
      accessProfiles: getDefaultStudentAccessProfileRepository(),
    },
  };
}
