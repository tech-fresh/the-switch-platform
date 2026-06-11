import { withSwitchRequestContext } from "@/lib/server/api";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    dashboard: await getDashboardHomeData(context.userId),
  }));
}
