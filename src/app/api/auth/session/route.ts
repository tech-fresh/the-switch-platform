import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {
  AUTH_SESSION_COOKIE_NAME,
  clearAuthSession,
  createAuthSession,
  getAuthCookieSettings,
  getCurrentAuthSession,
  getSignInOptions,
} from "@/modules/auth/service";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";

async function assertSameOriginRequest(): Promise<NextResponse | null> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!origin || !host) {
    return NextResponse.json(
      {
        error: "Unable to verify the request origin for this auth action.",
      },
      { status: 400 },
    );
  }

  const expectedOrigin = `${protocol}://${host}`;

  if (origin !== expectedOrigin) {
    return NextResponse.json(
      {
        error: "Cross-origin auth actions are not allowed.",
      },
      { status: 403 },
    );
  }

  return null;
}

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
  if (!getAuthRuntimeConfig().allowLocalSessionMutation) {
    return NextResponse.json(
      {
        error: "Direct session creation is disabled because this runtime expects redirect-based provider sign-in.",
      },
      { status: 409 },
    );
  }

  const originError = await assertSameOriginRequest();

  if (originError) {
    return originError;
  }

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

  response.cookies.set(AUTH_SESSION_COOKIE_NAME, sessionToken, getAuthCookieSettings());

  return response;
}

export async function DELETE() {
  const originError = await assertSameOriginRequest();

  if (originError) {
    return originError;
  }

  await clearAuthSession();

  const response = NextResponse.json({
    session: {
      status: "signed-out" as const,
    },
  });

  response.cookies.set(AUTH_SESSION_COOKIE_NAME, "", {
    ...getAuthCookieSettings(),
    maxAge: 0,
  });

  return response;
}
