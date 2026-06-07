import { NextResponse } from "next/server";
import {
  getMockTimedAssessmentAttemptId,
  getMockTimedAssessmentAttemptSeed,
} from "@/modules/timed-assessment/service";
import { markSavedProgressStatus } from "@/modules/saved-progress/service";

export async function GET(
  request: Request,
  context: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await context.params;
  const { searchParams } = new URL(request.url);
  const durationMinutesParam = searchParams.get("durationMinutes");
  const parsedDurationMinutes = durationMinutesParam ? Number(durationMinutesParam) : undefined;

  if (
    durationMinutesParam &&
    (typeof parsedDurationMinutes !== "number" ||
      !Number.isFinite(parsedDurationMinutes) ||
      parsedDurationMinutes <= 0)
  ) {
    return NextResponse.json(
      {
        error: "durationMinutes must be a positive number when provided.",
      },
      { status: 400 },
    );
  }

  try {
    const seed = await getMockTimedAssessmentAttemptSeed(assessmentId, {
      selectedDurationMinutes: parsedDurationMinutes,
    });

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

export async function POST(
  request: Request,
  context: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await context.params;
  const { searchParams } = new URL(request.url);
  const durationMinutesParam = searchParams.get("durationMinutes");
  const parsedDurationMinutes = durationMinutesParam ? Number(durationMinutesParam) : undefined;

  if (
    durationMinutesParam &&
    (typeof parsedDurationMinutes !== "number" ||
      !Number.isFinite(parsedDurationMinutes) ||
      parsedDurationMinutes <= 0)
  ) {
    return NextResponse.json(
      {
        error: "durationMinutes must be a positive number when provided.",
      },
      { status: 400 },
    );
  }

  try {
    const seed = await getMockTimedAssessmentAttemptSeed(assessmentId, {
      selectedDurationMinutes: parsedDurationMinutes,
    });
    const submittedRecord = await markSavedProgressStatus(
      seed.attempt.userId,
      "timed-assessment-attempt",
      getMockTimedAssessmentAttemptId(assessmentId, seed.attempt.userId),
      "submitted",
    );

    if (!submittedRecord) {
      return NextResponse.json(
        {
          error: "Unable to submit timed assessment attempt.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      attemptId: submittedRecord.entityId,
      status: "submitted" as const,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown timed assessment submission error",
      },
      { status: 404 },
    );
  }
}
