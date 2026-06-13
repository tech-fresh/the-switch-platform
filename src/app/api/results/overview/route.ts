import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getResultsOverview } from "@/modules/results/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    results: await getResultsOverview(context.userId),
  }));
}
