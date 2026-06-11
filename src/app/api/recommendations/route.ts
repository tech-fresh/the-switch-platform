import { withSwitchRequestContext } from "@/lib/server/api";
import { getStudentRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    recommendations: await getStudentRecommendations(context.userId),
  }));
}
