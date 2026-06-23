import { redirect } from "next/navigation";

import { DashboardHome } from "@/components/dashboard-home";
import { getAccountOverviewApiData, getDashboardHomeApiData, getOnboardingOverviewApiData } from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAuthenticatedRequestSession();
  const onboarding = await getOnboardingOverviewApiData();

  if (!onboarding.isComplete) {
    redirect("/onboarding");
  }

  const [data, account] = await Promise.all([
    getDashboardHomeApiData(),
    getAccountOverviewApiData(),
  ]);

  return (
    <DashboardHome
      data={data}
      mode="dashboard"
      isAuthenticated={account.isAuthenticated || session.status === "authenticated"}
      displayName={
        account.session.status === "authenticated"
          ? account.session.user.displayName
          : session.user.displayName
      }
    />
  );
}
