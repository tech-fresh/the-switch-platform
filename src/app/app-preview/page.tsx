import { AppPreviewShowcase } from "@/components/app-preview-showcase";
import { listStudentVisibleContentSubjects } from "@/modules/content/service";
import { getDashboardHomeData } from "@/modules/dashboard/service";
import { getRequestUserId } from "@/modules/auth/request";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";

export const dynamic = "force-dynamic";

export default async function AppPreviewPage() {
  const userId = await getRequestUserId();
  const [dashboardData, summary] = await Promise.all([
    getDashboardHomeData(userId),
    getMockPowerGridSummary({ userId }),
  ]);
  const subjects = listStudentVisibleContentSubjects();

  return (
    <AppPreviewShowcase
      dashboardData={dashboardData}
      summary={summary}
      subjects={subjects}
    />
  );
}
