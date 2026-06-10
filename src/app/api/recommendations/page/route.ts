import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getRecommendationsPageData } from "@/modules/recommendations/service";

export async function GET() {
  const userId = await getRequestUserId();
  const recommendationsPage = await getRecommendationsPageData(userId);

  return NextResponse.json({
    recommendationsPage,
  });
}
