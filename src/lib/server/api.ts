import { NextResponse } from "next/server";
import type { AuthRole } from "@/modules/auth/types";

import {
  AuthenticationRequiredError,
  AuthorizationRequiredError,
  getAuthorizedSwitchRequestContext,
  getAuthenticatedSwitchRequestContext,
  getSwitchRequestContext,
  type SwitchRequestContext,
} from "./request-context";

export async function withSwitchRequestContext<TData>(
  handler: (context: SwitchRequestContext) => Promise<TData>,
): Promise<NextResponse> {
  const context = await getSwitchRequestContext();
  const data = await handler(context);

  return NextResponse.json(data);
}

export async function withAuthenticatedSwitchRequestContext<TData>(
  handler: (context: Awaited<ReturnType<typeof getAuthenticatedSwitchRequestContext>>) => Promise<TData>,
): Promise<NextResponse> {
  try {
    const context = await getAuthenticatedSwitchRequestContext();
    const data = await handler(context);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 401 },
      );
    }

    throw error;
  }
}

export async function withAuthorizedSwitchRequestContext<TData>(
  roles: AuthRole[],
  handler: (context: Awaited<ReturnType<typeof getAuthorizedSwitchRequestContext>>) => Promise<TData>,
): Promise<NextResponse> {
  try {
    const context = await getAuthorizedSwitchRequestContext(roles);
    const data = await handler(context);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 401 },
      );
    }

    if (error instanceof AuthorizationRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 403 },
      );
    }

    throw error;
  }
}

export async function withSwitchRouteErrorBoundary<TData>(options: {
  run: () => Promise<TData>;
  badRequestMessage?: string;
  status?: number;
}): Promise<NextResponse> {
  try {
    const data = await options.run();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : options.badRequestMessage ?? "Unknown route error",
      },
      { status: options.status ?? 400 },
    );
  }
}
