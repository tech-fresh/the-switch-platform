import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getSavedProgressOverview } from "@/modules/saved-progress/overview-service";

export async function GET() {
  const userId = await getRequestUserId();
  const overview = await getSavedProgressOverview({ userId });

  return NextResponse.json({
    overview,
  });
}
