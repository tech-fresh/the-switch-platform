import { withSwitchRequestContext } from "@/lib/server/api";
import { getWeeklyPlannerSummary } from "@/modules/weekly-planner/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    planner: await getWeeklyPlannerSummary({ userId: context.userId }),
  }));
}
