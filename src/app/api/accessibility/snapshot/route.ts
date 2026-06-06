import { NextResponse } from "next/server";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";

export async function GET() {
  const snapshot = await getAccessibilitySnapshot("student-demo");

  return NextResponse.json({
    snapshot,
  });
}
