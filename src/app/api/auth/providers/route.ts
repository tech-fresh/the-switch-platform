import { NextResponse } from "next/server";
import { getSignInOptions } from "@/modules/auth/service";

export async function GET() {
  const providers = await getSignInOptions();

  return NextResponse.json({
    providers,
  });
}
