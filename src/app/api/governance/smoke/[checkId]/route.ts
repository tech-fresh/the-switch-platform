import { NextResponse } from "next/server";

import {
  AuthenticationRequiredError,
  AuthorizationRequiredError,
  getAuthorizedSwitchRequestContext,
} from "@/lib/server/request-context";
import {
  GovernanceRouteValidationError,
  parseGovernanceSmokePatchInput,
} from "@/modules/governance/api";
import { recordLaunchGovernanceSmokeCheck } from "@/modules/governance/service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ checkId: string }> },
) {
  try {
    const requestContext = await getAuthorizedSwitchRequestContext(["editor", "admin"]);
    const { checkId } = await context.params;
    const payload = (await request.json()) as Partial<{
      status: "ready" | "watch";
      owner: string;
      note: string;
      environment: string;
    }>;
    const parsedInput = parseGovernanceSmokePatchInput(
      payload,
      requestContext.session.user.displayName,
    );

    await recordLaunchGovernanceSmokeCheck({
      checkId,
      ...parsedInput,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof AuthorizationRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof GovernanceRouteValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown governance smoke-check error",
      },
      { status: 400 },
    );
  }
}
