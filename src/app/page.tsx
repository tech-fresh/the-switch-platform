import { DashboardHome } from "@/components/dashboard-home";
import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";

export default async function HomePage() {
  return <DashboardHome data={buildMockPreviewDashboardData()} mode="home" isAuthenticated={false} />;
}
