import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getRankedRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => {
    const recommendations = await getRankedRecommendations(context.userId);

    return {
      recommendations,
      topPick: recommendations[0] ?? null,
    };
  });
}
