import { NextResponse } from "next/server";

import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import {
  getOnboardingOverview,
  updateOnboardingProfile,
} from "@/modules/onboarding/service";
import type { LearnerOnboardingProfile } from "@/modules/onboarding/types";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    onboarding: await getOnboardingOverview(context.session.user.userId),
  }));
}

export async function PUT(request: Request) {
  try {
    return await withAuthenticatedSwitchRequestContext(async (context) => {
      const payload = (await request.json()) as Partial<{
        profile: Partial<LearnerOnboardingProfile> & { complete?: boolean };
      }>;

      const update = payload.profile;

      if (!update) {
        throw new Error("An onboarding profile update payload is required.");
      }

      const result = await updateOnboardingProfile(context.session.user.userId, update);

      return {
        profile: result.profile,
        isComplete: result.isComplete,
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onboarding update failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
