import { NextResponse } from "next/server";

import { getSwitchRequestContext, type SwitchRequestContext } from "./request-context";

export async function withSwitchRequestContext<TData>(
  handler: (context: SwitchRequestContext) => Promise<TData>,
): Promise<NextResponse> {
  const context = await getSwitchRequestContext();
  const data = await handler(context);

  return NextResponse.json(data);
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
