import { NextResponse } from "next/server";
import { listTopicContentPackages } from "@/modules/cms/content-package-service";

export async function GET() {
  const contentPackages = listTopicContentPackages();

  return NextResponse.json({
    contentPackages,
  });
}
