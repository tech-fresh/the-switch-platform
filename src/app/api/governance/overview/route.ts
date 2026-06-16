import { withAuthorizedSwitchRequestContext } from "@/lib/server/api";
import { getLaunchGovernanceOverview } from "@/modules/governance/service";

export async function GET() {
  return withAuthorizedSwitchRequestContext(["editor", "admin"], async () => ({
    governance: await getLaunchGovernanceOverview(),
  }));
}
