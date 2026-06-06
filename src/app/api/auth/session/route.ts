import { NextResponse } from "next/server";
import { getCurrentAuthSession } from "@/modules/auth/service";

export async function GET() {
  const session = await getCurrentAuthSession();

  return NextResponse.json({
    session,
  });
}
