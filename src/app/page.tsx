import { DashboardHome } from "@/components/dashboard-home";
import { getDashboardHomeApiData } from "@/lib/api/server";

export default async function HomePage() {
  const data = await getDashboardHomeApiData();

  return <DashboardHome data={data} mode="home" />;
}
