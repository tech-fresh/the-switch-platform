import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getJourneyContext } from "@/modules/journey/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    journey: await getJourneyContext(context.userId),
  }));
}
