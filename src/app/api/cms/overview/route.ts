import { withAuthorizedSwitchRequestContext } from "@/lib/server/api";
import { getCmsOverview } from "@/modules/cms/service";

export async function GET() {
  return withAuthorizedSwitchRequestContext(["editor", "admin"], async () => {
    const overview = await getCmsOverview();

    return {
      overview,
    };
  });
}
