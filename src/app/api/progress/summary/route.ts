import { withSwitchRequestContext } from "@/lib/server/api";
import { getOnboardingOverview } from "@/modules/onboarding/service";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => {
    const onboardingOverview =
      context.userId === "guest-preview" ? null : await getOnboardingOverview(context.userId);

    return {
      summary: await getMockPowerGridSummary({
        userId: context.userId,
        savedProgressRepository: context.repositories.savedProgress,
        onboardingProfile: onboardingOverview?.profile ?? null,
      }),
    };
  });
}
