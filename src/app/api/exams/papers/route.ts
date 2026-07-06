import { NextResponse } from "next/server";

import { getSwitchRequestContext } from "@/lib/server/request-context";
import { listStudentVisibleExamPapers } from "@/modules/exam-inventory/service";
import { filterExamPapersForOnboardingProfile } from "@/modules/onboarding/exam-availability";
import { getOnboardingProfileByUserId } from "@/modules/onboarding/repository";

export async function GET() {
  const papers = listStudentVisibleExamPapers();
  const requestContext = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(requestContext.userId);

  const visiblePapers =
    profile && profile.completedAt
      ? filterExamPapersForOnboardingProfile(papers, profile)
      : papers;

  return NextResponse.json({
    papers: visiblePapers,
  });
}
