import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getResultsOverview } from "@/modules/results/service";

export async function GET() {
  const userId = await getRequestUserId();
  const results = await getResultsOverview(userId);

  return NextResponse.json({
    results,
  });
}
