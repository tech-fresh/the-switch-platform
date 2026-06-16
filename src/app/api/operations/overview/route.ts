import { withAuthorizedSwitchRequestContext } from "@/lib/server/api";
import { getOperationsOverview } from "@/modules/operations/service";

export async function GET() {
  return withAuthorizedSwitchRequestContext(["editor", "admin"], async () => ({
    operations: await getOperationsOverview(),
  }));
}
