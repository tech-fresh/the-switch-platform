import { NextResponse } from "next/server";
import { getResultsOverview } from "@/modules/results/service";

export async function GET() {
  const results = await getResultsOverview();

  return NextResponse.json({
    results,
  });
}
