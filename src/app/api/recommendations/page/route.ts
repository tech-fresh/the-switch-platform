import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getRecommendationsPageData } from "@/modules/recommendations/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    recommendationsPage: await getRecommendationsPageData(context.userId),
  }));
}
