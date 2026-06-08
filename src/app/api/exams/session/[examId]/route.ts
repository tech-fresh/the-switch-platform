import { NextResponse } from "next/server";
import { getMockExamSession, saveMockExamSession, submitMockExamSession } from "@/modules/exam-engine/service";
import type { SaveExamSessionRequest, SubmitExamSessionRequest } from "@/modules/exam-engine/contracts";

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
  request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;

  try {
    const payload = (await request.json()) as Partial<SubmitExamSessionRequest>;

    if (
      !payload.examSessionId ||
      !payload.currentQuestionId ||
      !payload.questionResponses ||
      typeof payload.timeRemainingMinutes !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Incomplete exam session submit payload.",
        },
        { status: 400 },
      );
    }

    const session = await submitMockExamSession(examId, {
      examSessionId: payload.examSessionId,
      currentQuestionId: payload.currentQuestionId,
      questionResponses: payload.questionResponses,
      timeRemainingMinutes: payload.timeRemainingMinutes,
    });

    return NextResponse.json({
      sessionId: session.examSessionId,
      status: "submitted" as const,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown exam submission error",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;

  try {
    const payload = (await request.json()) as Partial<SaveExamSessionRequest>;

    if (
      !payload.examSessionId ||
      !payload.currentQuestionId ||
      !payload.questionResponses ||
      typeof payload.timeRemainingMinutes !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Incomplete exam session save payload.",
        },
        { status: 400 },
      );
    }

    const session = await saveMockExamSession(examId, {
      examSessionId: payload.examSessionId,
      currentQuestionId: payload.currentQuestionId,
      questionResponses: payload.questionResponses,
      timeRemainingMinutes: payload.timeRemainingMinutes,
    });

    return NextResponse.json({
      session,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown exam autosave error",
      },
      { status: 400 },
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
