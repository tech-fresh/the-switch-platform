import { NextResponse } from "next/server";
import { getContentEditorialAudit } from "@/modules/content/service";

export async function GET() {
  const audit = await getContentEditorialAudit();

  return NextResponse.json({
    audit,
  });
}
