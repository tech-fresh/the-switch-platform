import { NextResponse } from "next/server";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";

export async function GET() {
  const assessments = getMockTimedAssessments();

  return NextResponse.json({
    assessments,
  });
}
