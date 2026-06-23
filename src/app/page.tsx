import { DashboardHome } from "@/components/dashboard-home";
import { getAccountOverviewApiData, getDashboardHomeApiData } from "@/lib/api/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [data, account] = await Promise.all([getDashboardHomeApiData(), getAccountOverviewApiData()]);

  return <DashboardHome data={data} mode="home" isAuthenticated={account.isAuthenticated} />;
}
