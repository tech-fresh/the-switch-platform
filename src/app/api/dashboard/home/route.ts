import { NextResponse } from "next/server";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export async function GET() {
  const dashboard = await getDashboardHomeData();

  return NextResponse.json({
    dashboard,
  });
}
