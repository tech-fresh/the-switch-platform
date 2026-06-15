import { getAuthenticatedSwitchRequestContext } from "@/lib/server/request-context";
import {
  withAuthenticatedSwitchRequestContext,
  withSwitchRouteErrorBoundary,
} from "@/lib/server/api";
import { getAccessibilitySnapshot, updateAccessibilitySettings } from "@/modules/accessibility/service";
import type { UpdateAccessibilitySnapshotRequest } from "@/modules/accessibility/contracts";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    snapshot: await getAccessibilitySnapshot(context.userId, context.repositories.accessProfiles),
  }));
}

export async function PATCH(request: Request) {
  return withSwitchRouteErrorBoundary({
    badRequestMessage: "Unknown accessibility update error",
    run: async () => {
      const context = await getAuthenticatedSwitchRequestContext();
      const payload = (await request.json()) as Partial<UpdateAccessibilitySnapshotRequest>;

      if (!payload.settings) {
        throw new Error("Accessibility settings payload is required.");
      }

      return {
        snapshot: await updateAccessibilitySettings(
          {
            ...payload.settings,
            userId: context.userId,
          },
          context.repositories.accessProfiles,
        ),
      };
    },
  });
}
