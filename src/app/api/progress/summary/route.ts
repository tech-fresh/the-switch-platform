import { NextResponse } from "next/server";
import { getMockPowerGridSummary } from "@/modules/power-grid/service";

export async function GET() {
  const summary = await getMockPowerGridSummary();

  return NextResponse.json({
    summary,
  });
}
