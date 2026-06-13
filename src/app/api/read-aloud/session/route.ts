import { NextResponse } from "next/server";
import { getAuthenticatedSwitchRequestContext } from "@/lib/server/request-context";
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
  const context = await getAuthenticatedSwitchRequestContext();
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

  const session = await getReadAloudSession(
    context.userId,
    contentType as ReadAloudContentType,
    context.repositories.accessProfiles,
  );

  return NextResponse.json({
    session,
  });
}
