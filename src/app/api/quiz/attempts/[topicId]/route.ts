import { NextResponse } from "next/server";

import { getSwitchRequestContext } from "@/lib/server/request-context";
import { submitQuizAnswer } from "@/modules/quiz/service";
import type { SubmitQuizAnswerRequest } from "@/modules/quiz/contracts";

export async function POST(
  request: Request,
  context: { params: Promise<{ topicId: string }> },
) {
  const { topicId } = await context.params;
  const requestContext = await getSwitchRequestContext();

  try {
    const payload = (await request.json()) as Partial<SubmitQuizAnswerRequest>;

    if (!payload.selectedOptionId) {
      return NextResponse.json(
        {
          error: "selectedOptionId is required.",
        },
        { status: 400 },
      );
    }

    const result = await submitQuizAnswer(
      topicId,
      {
        userId: requestContext.userId,
        selectedOptionId: payload.selectedOptionId,
      },
      requestContext.repositories.quizProgress,
    );

    return NextResponse.json({
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown quiz answer submission error",
      },
      { status: 400 },
    );
  }
}
