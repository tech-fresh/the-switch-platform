import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export async function GET() {
  const userId = await getRequestUserId();
  const dashboard = await getDashboardHomeData(userId);

  return NextResponse.json({
    dashboard,
  });
}
