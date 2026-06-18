import { NextResponse } from "next/server";
import { getSignInOptions } from "@/modules/auth/service";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";

export async function GET() {
  const providers = await getSignInOptions();
  const runtime = getAuthRuntimeConfig();

  return NextResponse.json({
    providers,
    runtime,
  });
}
