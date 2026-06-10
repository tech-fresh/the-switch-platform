import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getMockExamSession, saveMockExamSession, submitMockExamSession } from "@/modules/exam-engine/service";
import type { SaveExamSessionRequest, SubmitExamSessionRequest } from "@/modules/exam-engine/contracts";
import type { ExamQuestionResponse } from "@/modules/exam-engine/types";

function isCompleteExamSessionPayload(
  payload: Partial<SaveExamSessionRequest | SubmitExamSessionRequest>,
): payload is SaveExamSessionRequest {
  return Boolean(
    payload.examSessionId &&
      payload.currentQuestionId &&
      payload.questionResponses &&
      typeof payload.timeRemainingMinutes === "number",
  );
}

function validateExamSessionPayload(
  payload: Partial<SaveExamSessionRequest | SubmitExamSessionRequest>,
  session: Awaited<ReturnType<typeof getMockExamSession>>,
): string | null {
  if (!isCompleteExamSessionPayload(payload)) {
    return "Incomplete exam session payload.";
  }

  if (!Array.isArray(payload.questionResponses)) {
    return "Exam session question responses must be an array.";
  }

  if (payload.examSessionId !== session.examSessionId) {
    return "Exam session id does not match the active paper session.";
  }

  if (!session.questions.some((question) => question.questionId === payload.currentQuestionId)) {
    return "Current question id does not belong to the active paper session.";
  }

  const questionIds = new Set(session.questions.map((question) => question.questionId));

  if (payload.questionResponses.length !== session.questionResponses.length) {
    return "Exam session response count does not match the active paper session.";
  }

  const hasInvalidResponse = payload.questionResponses.some((response) => {
    const typedResponse = response as Partial<ExamQuestionResponse>;

    return (
      !typedResponse.questionId ||
      !questionIds.has(typedResponse.questionId) ||
      typeof typedResponse.flagged !== "boolean" ||
      !typedResponse.status
    );
  });

  if (hasInvalidResponse) {
    return "Exam session responses contain invalid question or status data.";
  }

  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ examId: string }> },
) {
  const { examId } = await context.params;
  const userId = await getRequestUserId();

  try {
    const session = await getMockExamSession(examId, { userId });

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
  const userId = await getRequestUserId();

  try {
    const payload = (await request.json()) as Partial<SubmitExamSessionRequest>;
    const activeSession = await getMockExamSession(examId, { userId });
    const validationError = validateExamSessionPayload(payload, activeSession);

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        { status: 400 },
      );
    }

    if (!isCompleteExamSessionPayload(payload)) {
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
      userId,
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
  const userId = await getRequestUserId();

  try {
    const payload = (await request.json()) as Partial<SaveExamSessionRequest>;
    const activeSession = await getMockExamSession(examId, { userId });
    const validationError = validateExamSessionPayload(payload, activeSession);

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        { status: 400 },
      );
    }

    if (!isCompleteExamSessionPayload(payload)) {
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
      userId,
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
  const userId = await getRequestUserId();

  try {
    const session = await getMockExamSession(examId, {
      startFreshAttempt: true,
      userId,
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
