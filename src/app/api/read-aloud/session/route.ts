import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getReadAloudSession } from "@/modules/read-aloud/service";
import type { ReadAloudContentType } from "@/modules/read-aloud/types";

const allowedContentTypes = new Set<ReadAloudContentType>([
  "revision-notes",
  "question",
  "answer",
  "worked-example",
  "feedback",
  "recommendation",
]);

export async function GET(request: Request) {
  const userId = await getRequestUserId();
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");

  if (!contentType || !allowedContentTypes.has(contentType as ReadAloudContentType)) {
    return NextResponse.json(
      {
        error: "contentType must be a valid read aloud content type.",
      },
      { status: 400 },
    );
  }

  const session = await getReadAloudSession(userId, contentType as ReadAloudContentType);

  return NextResponse.json({
    session,
  });
}
