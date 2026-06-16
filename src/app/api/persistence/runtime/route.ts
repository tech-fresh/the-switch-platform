import { withAuthorizedSwitchRequestContext } from "@/lib/server/api";
import { getPersistenceRuntimeSummary } from "@/lib/server/repositories";

export async function GET() {
  return withAuthorizedSwitchRequestContext(["editor", "admin"], async () => ({
    persistence: await getPersistenceRuntimeSummary(),
  }));
}
