import { NextResponse } from "next/server";
import { getMockExamPapers } from "@/modules/exam-engine/service";

export async function GET() {
  const papers = getMockExamPapers();

  return NextResponse.json({
    papers,
  });
}
