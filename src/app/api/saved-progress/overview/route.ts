import { NextResponse } from "next/server";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";

export async function GET() {
  const overview = await getSavedProgressOverview();

  return NextResponse.json({
    overview,
  });
}
