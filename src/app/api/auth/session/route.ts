import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { buildOperationsEvent, recordOperationsEvent } from "@/lib/server/operations-event";
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
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "auth",
        action: "session-create-blocked",
        status: "warning",
        detail: "Direct auth session creation was blocked because the runtime expects provider-led sign-in.",
      }),
    );
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
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "auth",
        action: "session-create-invalid-provider",
        status: "warning",
        detail: "An auth session creation request was rejected because the provider was not supported.",
      }),
    );
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
  recordOperationsEvent(
    buildOperationsEvent({
      domain: "auth",
      action: "session-created",
      status: "success",
      userId: session.status === "authenticated" ? session.user.userId : undefined,
      entityId: session.status === "authenticated" ? session.sessionId : undefined,
      detail: `A new auth session was created through the ${provider} provider.`,
    }),
  );

  return response;
}

export async function DELETE() {
  const originError = await assertSameOriginRequest();

  if (originError) {
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "auth",
        action: "session-delete-origin-blocked",
        status: "warning",
        detail: "An auth sign-out request was blocked because the request origin could not be trusted.",
      }),
    );
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
  recordOperationsEvent(
    buildOperationsEvent({
      domain: "auth",
      action: "session-cleared",
      status: "success",
      detail: "The current auth session cookie was cleared.",
    }),
  );

  return response;
}
