import { DashboardHome } from "@/components/dashboard-home";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export default async function DashboardPage() {
  const data = await getDashboardHomeData();

  return <DashboardHome data={data} mode="dashboard" />;
}
