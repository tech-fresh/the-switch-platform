import { cookies } from "next/headers";

import { AUTH_SESSION_COOKIE_NAME, getCurrentAuthSession } from "./service";
import type { AuthSession } from "./types";

export async function getRequestAuthSession(): Promise<AuthSession> {
  const cookieStore = await cookies();

  return getCurrentAuthSession({
    sessionToken: cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value,
  });
}

export async function getRequestUserId(): Promise<string> {
  const session = await getRequestAuthSession();

  return session.status === "authenticated" ? session.user.userId : "guest-preview";
}
