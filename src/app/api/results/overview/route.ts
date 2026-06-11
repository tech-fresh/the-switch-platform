import { withSwitchRequestContext } from "@/lib/server/api";
import { getResultsOverview } from "@/modules/results/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    results: await getResultsOverview(context.userId),
  }));
}
