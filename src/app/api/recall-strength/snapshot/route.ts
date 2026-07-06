import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { getRecallStrengthSnapshot } from "@/modules/recall-strength/service";

export async function GET() {
  return withAuthenticatedSwitchRequestContext(async (context) => ({
    snapshot: await getRecallStrengthSnapshot(context.userId),
  }));
}
