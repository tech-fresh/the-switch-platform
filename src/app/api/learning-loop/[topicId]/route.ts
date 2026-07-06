import { withAuthenticatedSwitchRequestContext } from "@/lib/server/api";
import {
  advanceLearningLoopStage,
  getLearningLoopSession,
} from "@/modules/learning-loop/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ topicId: string }> },
) {
  const { topicId } = await context.params;

  return withAuthenticatedSwitchRequestContext(async (authContext) => ({
    session: await getLearningLoopSession(authContext.userId, topicId),
  }));
}

export async function POST(
  request: Request,
  context: { params: Promise<{ topicId: string }> },
) {
  const { topicId } = await context.params;
  const body = (await request.json()) as { subjectId: string };

  return withAuthenticatedSwitchRequestContext(async (authContext) => ({
    session: await advanceLearningLoopStage(authContext.userId, topicId, body.subjectId),
  }));
}
