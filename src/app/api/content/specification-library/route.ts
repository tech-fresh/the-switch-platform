import { NextResponse } from "next/server";

import { requireRequestSessionRoles } from "@/modules/auth/request";
import {
  listLearningObjectives,
  validateSubjectLibrary,
} from "@/modules/specification-engine/service";

export async function GET() {
  await requireRequestSessionRoles(["editor", "admin"]);

  return NextResponse.json({
    objectives: listLearningObjectives({
      includeFuture: true,
    }),
    validation: validateSubjectLibrary(),
  });
}
