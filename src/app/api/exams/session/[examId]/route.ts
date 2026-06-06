import { NextResponse } from "next/server";
import { getMockExamSession } from "@/modules/exam-engine/service";

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
