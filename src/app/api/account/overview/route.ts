import { NextResponse } from "next/server";
import { getRequestAuthSession } from "@/modules/auth/request";
import { getAccountOverview } from "@/modules/auth/service";

export async function GET() {
  const session = await getRequestAuthSession();
  const account = await getAccountOverview({ session });

  return NextResponse.json({
    account,
  });
}
