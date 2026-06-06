import { NextResponse } from "next/server";
import { getAccountOverview } from "@/modules/auth/service";

export async function GET() {
  const account = await getAccountOverview();

  return NextResponse.json({
    account,
  });
}
