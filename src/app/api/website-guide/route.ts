import { NextResponse } from "next/server";
import { getWebsiteGuideData } from "@/modules/website-guide/service";

export async function GET() {
  const guide = await getWebsiteGuideData();

  return NextResponse.json({
    guide,
  });
}
