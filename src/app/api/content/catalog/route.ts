import { NextResponse } from "next/server";
import { getMvpContentCatalog, getStudentMvpContentCatalog } from "@/modules/content/service";
import type { ContentCatalogAudience } from "@/modules/content/contracts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audience = (searchParams.get("audience") ?? "student") as ContentCatalogAudience;
  const catalog =
    audience === "internal" ? await getMvpContentCatalog() : await getStudentMvpContentCatalog();

  return NextResponse.json({
    catalog,
    audience: audience === "internal" ? "internal" : "student",
  });
}
