import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import {
  getMockTimedAssessmentAttemptSeed,
  saveMockTimedAssessmentAttempt,
  submitMockTimedAssessmentAttempt,
} from "@/modules/timed-assessment/service";
import type {
  SaveTimedAssessmentAttemptRequest,
  SubmitTimedAssessmentRequest,
} from "@/modules/timed-assessment/contracts";

export async function GET(
  request: Request,
  context: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await context.params;
  const userId = await getRequestUserId();
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
      userId,
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
  const userId = await getRequestUserId();
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
    const payload = (await request.json()) as Partial<SubmitTimedAssessmentRequest>;

    if (
      !payload.attemptId ||
      typeof payload.selectedDurationMinutes !== "number" ||
      !payload.selectedAnswerIds ||
      !payload.writtenAnswers ||
      !payload.notes ||
      !payload.bookmarkedQuestionIds ||
      typeof payload.timeRemainingMinutes !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Incomplete timed assessment submit payload.",
        },
        { status: 400 },
      );
    }

    const seed = await submitMockTimedAssessmentAttempt(assessmentId, {
      attemptId: payload.attemptId,
      currentQuestionId: payload.currentQuestionId,
      selectedDurationMinutes: payload.selectedDurationMinutes,
      selectedAnswerIds: payload.selectedAnswerIds,
      writtenAnswers: payload.writtenAnswers,
      notes: payload.notes,
      bookmarkedQuestionIds: payload.bookmarkedQuestionIds,
      timeRemainingMinutes: payload.timeRemainingMinutes,
      userId,
    });

    return NextResponse.json({
      attemptId: seed.attempt.attemptId,
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await context.params;
  const userId = await getRequestUserId();

  try {
    const payload = (await request.json()) as Partial<SaveTimedAssessmentAttemptRequest>;

    if (
      !payload.attemptId ||
      typeof payload.selectedDurationMinutes !== "number" ||
      !payload.selectedAnswerIds ||
      !payload.writtenAnswers ||
      !payload.notes ||
      !payload.bookmarkedQuestionIds ||
      typeof payload.timeRemainingMinutes !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Incomplete timed assessment save payload.",
        },
        { status: 400 },
      );
    }

    const seed = await saveMockTimedAssessmentAttempt(assessmentId, {
      attemptId: payload.attemptId,
      currentQuestionId: payload.currentQuestionId,
      selectedDurationMinutes: payload.selectedDurationMinutes,
      selectedAnswerIds: payload.selectedAnswerIds,
      writtenAnswers: payload.writtenAnswers,
      notes: payload.notes,
      bookmarkedQuestionIds: payload.bookmarkedQuestionIds,
      timeRemainingMinutes: payload.timeRemainingMinutes,
      userId,
    });

    return NextResponse.json({
      seed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown timed assessment save error",
      },
      { status: 400 },
    );
  }
}
