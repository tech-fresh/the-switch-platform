import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";

export async function GET() {
  const userId = await getRequestUserId();
  const summary = await getMockPowerGridSummary({ userId });

  return NextResponse.json({
    summary,
  });
}
