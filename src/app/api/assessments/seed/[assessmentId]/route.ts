import { NextResponse } from "next/server";
import { getMockTimedAssessmentAttemptSeed } from "@/modules/timed-assessment/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await context.params;

  try {
    const seed = await getMockTimedAssessmentAttemptSeed(assessmentId);

    return NextResponse.json({
      seed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown timed assessment error",
      },
      { status: 404 },
    );
  }
}
