import { NextResponse } from "next/server";

import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import { recordReview } from "@/modules/recall-strength/service";
import type { RecallStrengthReviewRequest } from "@/modules/recall-strength/contracts";

export async function POST(request: Request) {
  try {
    return await withAuthenticatedSwitchRequestContext(async (context) => {
      const body = (await request.json()) as Partial<RecallStrengthReviewRequest>;

      if (!body.topicId || !body.subjectId || !body.outcome) {
        throw new Error("topicId, subjectId, and outcome are required.");
      }

      return {
        snapshot: await recordReview(context.userId, {
          topicId: body.topicId,
          subjectId: body.subjectId,
          outcome: body.outcome,
        }),
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid recall strength review payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
