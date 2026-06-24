import { DashboardHome } from "@/components/dashboard-home";
import { getDashboardHomeApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const shell = await requireStudentAppRouteContext();
  const data = await getDashboardHomeApiData();

  return (
    <DashboardHome
      data={data}
      mode="dashboard"
      isAuthenticated
      displayName={shell.displayName}
    />
  );
}
