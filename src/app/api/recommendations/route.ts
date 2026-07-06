import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getRankedRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    recommendations: await getRankedRecommendations(context.userId),
  }));
}
