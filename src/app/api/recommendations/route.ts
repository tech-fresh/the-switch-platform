import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getStudentRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    recommendations: await getStudentRecommendations(context.userId),
  }));
}
