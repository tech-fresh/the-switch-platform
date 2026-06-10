import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_SESSION_COOKIE_NAME,
  clearAuthSession,
  createAuthSession,
  getCurrentAuthSession,
  getSignInOptions,
} from "@/modules/auth/service";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getCurrentAuthSession({
    sessionToken: cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value,
  });

  return NextResponse.json({
    session,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<{ provider: string }>;
  const signInOptions = await getSignInOptions();
  const provider = signInOptions.find((option) => option.provider === payload.provider)?.provider;

  if (!provider) {
    return NextResponse.json(
      {
        error: "A supported auth provider is required to create a session.",
      },
      { status: 400 },
    );
  }

  const { session, sessionToken } = await createAuthSession(provider);
  const response = NextResponse.json({
    session,
  });

  response.cookies.set(AUTH_SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;

  await clearAuthSession(sessionToken);

  const response = NextResponse.json({
    session: {
      status: "signed-out" as const,
    },
  });

  response.cookies.set(AUTH_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
