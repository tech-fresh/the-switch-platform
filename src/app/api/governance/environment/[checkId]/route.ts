import { NextResponse } from "next/server";

import {
  AuthenticationRequiredError,
  AuthorizationRequiredError,
  getAuthorizedSwitchRequestContext,
} from "@/lib/server/request-context";
import {
  GovernanceRouteValidationError,
  parseGovernanceEnvironmentPatchInput,
} from "@/modules/governance/api";
import { recordLaunchGovernanceEnvironmentCheck } from "@/modules/governance/service";

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
      detail: string;
      environment: string;
    }>;
    const parsedInput = parseGovernanceEnvironmentPatchInput(
      payload,
      requestContext.session.user.displayName,
    );

    await recordLaunchGovernanceEnvironmentCheck({
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
        error: error instanceof Error ? error.message : "Unknown governance environment error",
      },
      { status: 400 },
    );
  }
}
