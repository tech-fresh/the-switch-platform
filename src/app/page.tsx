import { DashboardHome } from "@/components/dashboard-home";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export default async function HomePage() {
  const data = await getDashboardHomeData();

  return <DashboardHome data={data} mode="home" />;
}
