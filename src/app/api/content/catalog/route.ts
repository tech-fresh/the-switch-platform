import { NextResponse } from "next/server";
import { getMvpContentCatalog } from "@/modules/content/service";

export async function GET() {
  const catalog = await getMvpContentCatalog();

  return NextResponse.json({
    catalog,
  });
}
