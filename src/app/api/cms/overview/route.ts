import { NextResponse } from "next/server";
import { getCmsOverview } from "@/modules/cms/service";

export async function GET() {
  const overview = await getCmsOverview();

  return NextResponse.json({
    overview,
  });
}
