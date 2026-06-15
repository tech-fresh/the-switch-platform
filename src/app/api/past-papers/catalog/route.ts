import { NextResponse } from "next/server";
import { getPastPaperCatalogOverview } from "@/modules/past-papers/service";

export async function GET() {
  const catalog = await getPastPaperCatalogOverview();

  return NextResponse.json({
    catalog,
  });
}
