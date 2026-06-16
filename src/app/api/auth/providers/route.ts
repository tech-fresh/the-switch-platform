import { NextResponse } from "next/server";
import { getAuthReadinessSummary, getSignInOptions } from "@/modules/auth/service";

export async function GET() {
  const providers = await getSignInOptions();

  return NextResponse.json({
    providers,
    readiness: getAuthReadinessSummary(),
  });
}
