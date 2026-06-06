import { NextResponse } from "next/server";
import { getStudentRecommendations } from "@/modules/recommendations/service";

export async function GET() {
  const recommendations = await getStudentRecommendations("student-demo");

  return NextResponse.json({
    recommendations,
  });
}
