import { NextResponse } from "next/server";
import { getCurrentAuthSession } from "@/modules/auth/service";
import { getAuthRuntimeConfig } from "@/modules/auth/runtime";

export async function GET() {
  const session = await getCurrentAuthSession();
  const runtime = getAuthRuntimeConfig();

  return NextResponse.json({
    session,
    runtime,
  });
}
