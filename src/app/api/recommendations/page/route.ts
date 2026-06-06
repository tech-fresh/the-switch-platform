import { NextResponse } from "next/server";
import { getRecommendationsPageData } from "@/modules/recommendations/service";

export async function GET() {
  const recommendationsPage = await getRecommendationsPageData("student-demo");

  return NextResponse.json({
    recommendationsPage,
  });
}
