import { withSwitchRequestContext } from "@/lib/server/api";
import { getRecommendationsPageData } from "@/modules/recommendations/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    recommendationsPage: await getRecommendationsPageData(context.userId),
  }));
}
