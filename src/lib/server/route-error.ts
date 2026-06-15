export interface RouteErrorResult<TData> {
  data?: TData;
  error?: string;
  status: number;
}

export async function runRouteWithErrorBoundary<TData>(options: {
  run: () => Promise<TData>;
  badRequestMessage?: string;
  status?: number;
}): Promise<RouteErrorResult<TData>> {
  try {
    return {
      data: await options.run(),
      status: 200,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : options.badRequestMessage ?? "Unknown route error",
      status: options.status ?? 400,
    };
  }
}
