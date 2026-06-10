import { NextResponse } from "next/server";
import { getRequestUserId } from "@/modules/auth/request";
import { getAccessibilitySnapshot, updateAccessibilitySettings } from "@/modules/accessibility/service";
import type { UpdateAccessibilitySnapshotRequest } from "@/modules/accessibility/contracts";

export async function GET() {
  const userId = await getRequestUserId();
  const snapshot = await getAccessibilitySnapshot(userId);

  return NextResponse.json({
    snapshot,
  });
}

export async function PATCH(request: Request) {
  try {
    const userId = await getRequestUserId();
    const payload = (await request.json()) as Partial<UpdateAccessibilitySnapshotRequest>;

    if (!payload.settings) {
      return NextResponse.json(
        {
          error: "Accessibility settings payload is required.",
        },
        { status: 400 },
      );
    }

    const snapshot = await updateAccessibilitySettings({
      ...payload.settings,
      userId,
    });

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
