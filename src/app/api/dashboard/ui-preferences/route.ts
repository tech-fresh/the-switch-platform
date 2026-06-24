import { NextResponse } from "next/server";

import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import {
  getDashboardUiPreferences,
  setPlannerPromptDismissed,
} from "@/modules/dashboard/ui-preferences-service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    preferences: await getDashboardUiPreferences(context.userId),
  }));
}

export async function PUT(request: Request) {
  try {
    return await withAuthenticatedSwitchRequestContext(async (context) => {
      const body = (await request.json()) as { plannerPromptDismissed?: boolean };

      if (typeof body.plannerPromptDismissed !== "boolean") {
        throw new Error("plannerPromptDismissed must be a boolean.");
      }

      return {
        preferences: await setPlannerPromptDismissed(context.userId, body.plannerPromptDismissed),
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard UI preferences update failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
