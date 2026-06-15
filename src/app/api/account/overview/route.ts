import { withSwitchRequestContext } from "@/lib/server/api";
import { getAccountOverview } from "@/modules/auth/service";

export async function GET() {
  return withSwitchRequestContext(async (context) => ({
    account: await getAccountOverview({ session: context.session }),
  }));
}
