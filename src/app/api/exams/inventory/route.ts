import { NextResponse } from "next/server";

import { requireRequestSessionRoles } from "@/modules/auth/request";
import {
  getExamInventorySummary,
  listExamInventoryPapers,
} from "@/modules/exam-inventory/service";

export async function GET() {
  await requireRequestSessionRoles(["editor", "admin"]);

  return NextResponse.json({
    summary: getExamInventorySummary(),
    papers: listExamInventoryPapers(),
  });
}
