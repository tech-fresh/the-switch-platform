import type { DashboardHomeData } from "./types";

export type DashboardContractRoute = "GET /dashboard/home";

export interface GetDashboardHomeResponse {
  dashboard: DashboardHomeData;
}
