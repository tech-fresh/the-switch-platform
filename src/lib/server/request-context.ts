import {
  getDefaultQuizProgressRepository,
  getDefaultSavedProgressRepository,
  getDefaultStudentAccessProfileRepository,
} from "@/lib/server/repositories";
import { getRequestAuthSession } from "@/modules/auth/request";
import { getAuthUserIdFromSession } from "@/modules/auth/service";
import type { AuthRole, AuthSession } from "@/modules/auth/types";
import type { AuthenticatedAuthSession } from "@/modules/auth/types";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements/types";
import type { QuizProgressRepository } from "@/modules/quiz/types";
import type { SavedProgressRepository } from "@/modules/saved-progress/types";

export interface SwitchRequestContext {
  session: AuthSession;
  userId: string;
  repositories: {
    savedProgress: SavedProgressRepository;
    accessProfiles: StudentAccessProfileRepository;
    quizProgress: QuizProgressRepository;
  };
}

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("An authenticated session is required for this route.");
  }
}

export class AuthorizationRequiredError extends Error {
  constructor() {
    super("Your current account does not have permission to access this route.");
  }
}

export async function getSwitchRequestContext(): Promise<SwitchRequestContext> {
  const session = await getRequestAuthSession();

  return {
    session,
    userId: getAuthUserIdFromSession(session),
    repositories: {
      savedProgress: getDefaultSavedProgressRepository(),
      accessProfiles: getDefaultStudentAccessProfileRepository(),
      quizProgress: getDefaultQuizProgressRepository(),
    },
  };
}

export async function getAuthenticatedSwitchRequestContext(): Promise<SwitchRequestContext & {
  session: AuthenticatedAuthSession;
}> {
  const session = await getRequestAuthSession();

  if (session.status !== "authenticated") {
    throw new AuthenticationRequiredError();
  }

  return {
    session,
    userId: session.user.userId,
    repositories: {
      savedProgress: getDefaultSavedProgressRepository(),
      accessProfiles: getDefaultStudentAccessProfileRepository(),
      quizProgress: getDefaultQuizProgressRepository(),
    },
  };
}

export async function getAuthorizedSwitchRequestContext(
  roles: AuthRole[],
): Promise<SwitchRequestContext & { session: AuthenticatedAuthSession }> {
  const session = await getRequestAuthSession();

  if (session.status !== "authenticated") {
    throw new AuthenticationRequiredError();
  }

  if (!session.user.roles.some((role) => roles.includes(role))) {
    throw new AuthorizationRequiredError();
  }

  return {
    session,
    userId: session.user.userId,
    repositories: {
      savedProgress: getDefaultSavedProgressRepository(),
      accessProfiles: getDefaultStudentAccessProfileRepository(),
      quizProgress: getDefaultQuizProgressRepository(),
    },
  };
}
