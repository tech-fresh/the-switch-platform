import { NextResponse } from "next/server";
import { getMockExamSession } from "@/modules/exam-engine/service";
import { markSavedProgressStatus } from "@/modules/saved-progress/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;

  try {
    const session = await getMockExamSession(examId);

    return NextResponse.json({
      session,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown exam session error",
      },
      { status: 404 },
    );
  }
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;

  try {
    const session = await getMockExamSession(examId);
    const submittedRecord = await markSavedProgressStatus(
      session.userId,
      "exam-session",
      session.examSessionId,
      "submitted",
    );

    if (!submittedRecord) {
      return NextResponse.json(
        {
          error: "Unable to submit exam session.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      sessionId: submittedRecord.entityId,
      status: "submitted" as const,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown exam submission error",
      },
      { status: 404 },
    );
  }
}

export async function PUT(
  _request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;

  try {
    const session = await getMockExamSession(examId, {
      startFreshAttempt: true,
    });

    return NextResponse.json({
      session,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown fresh exam session error",
      },
      { status: 404 },
    );
  }
}
