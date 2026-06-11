import { withSwitchRequestContext } from "@/lib/server/api";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    overview: await getSavedProgressOverview({
      userId: context.userId,
      savedProgressRepository: context.repositories.savedProgress,
    }),
  }));
}
