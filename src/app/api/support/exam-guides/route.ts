import { NextResponse } from "next/server";
import { getSupportHubData } from "@/modules/support/service";

export async function GET() {
  const support = await getSupportHubData();

  return NextResponse.json({
    guides: support.examSupportGuides,
  });
}
