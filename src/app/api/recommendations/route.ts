import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getStudentRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  const userId = await getRequestUserId();
  const recommendations = await getStudentRecommendations(userId);

  return NextResponse.json({
    recommendations,
  });
}
