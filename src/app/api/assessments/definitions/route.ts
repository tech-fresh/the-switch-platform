import { NextResponse } from "next/server";

import { getSwitchRequestContext } from "@/lib/server/request-context";
import { filterAssessmentsForOnboardingProfile } from "@/modules/onboarding/personalization";
import { getOnboardingProfileByUserId } from "@/modules/onboarding/repository";
import { getMockTimedAssessments } from "@/modules/timed-assessment/service";

export async function GET() {
  const requestContext = await getSwitchRequestContext();
  const profile = await getOnboardingProfileByUserId(requestContext.userId);
  const allAssessments = getMockTimedAssessments();
  const assessments =
    profile && profile.completedAt
      ? filterAssessmentsForOnboardingProfile(allAssessments, profile)
      : allAssessments;

  return NextResponse.json({
    assessments,
  });
}
