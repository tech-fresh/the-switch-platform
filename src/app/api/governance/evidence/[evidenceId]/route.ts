import { NextResponse } from "next/server";

import {
  AuthenticationRequiredError,
  AuthorizationRequiredError,
  getAuthorizedSwitchRequestContext,
} from "@/lib/server/request-context";
import {
  GovernanceRouteValidationError,
  parseGovernanceEvidencePatchInput,
} from "@/modules/governance/api";
import { recordLaunchGovernanceEvidence } from "@/modules/governance/service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ evidenceId: string }> },
) {
  try {
    const requestContext = await getAuthorizedSwitchRequestContext(["editor", "admin"]);
    const { evidenceId } = await context.params;
    const payload = (await request.json()) as Partial<{
      status: "recorded" | "still-needed";
      owner: string;
      summary: string;
      environment: string;
    }>;
    const parsedInput = parseGovernanceEvidencePatchInput(
      payload,
      requestContext.session.user.displayName,
    );

    await recordLaunchGovernanceEvidence({
      evidenceId,
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
        error: error instanceof Error ? error.message : "Unknown governance evidence error",
      },
      { status: 400 },
    );
  }
}
