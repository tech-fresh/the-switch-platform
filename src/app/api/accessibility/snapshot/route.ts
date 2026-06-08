import { NextResponse } from "next/server";
import { getAccessibilitySnapshot, updateAccessibilitySettings } from "@/modules/accessibility/service";
import type { UpdateAccessibilitySnapshotRequest } from "@/modules/accessibility/contracts";

export async function GET() {
  const snapshot = await getAccessibilitySnapshot("student-demo");

  return NextResponse.json({
    snapshot,
  });
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as Partial<UpdateAccessibilitySnapshotRequest>;

    if (!payload.settings) {
      return NextResponse.json(
        {
          error: "Accessibility settings payload is required.",
        },
        { status: 400 },
      );
    }

    const snapshot = await updateAccessibilitySettings(payload.settings);

    return NextResponse.json({
      snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown accessibility update error",
      },
      { status: 400 },
    );
  }
}
