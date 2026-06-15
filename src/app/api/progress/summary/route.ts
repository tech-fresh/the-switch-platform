import { withSwitchRequestContext } from "@/lib/server/api";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    summary: await getMockPowerGridSummary({
      userId: context.userId,
      savedProgressRepository: context.repositories.savedProgress,
    }),
  }));
}
