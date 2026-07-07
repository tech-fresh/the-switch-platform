import { redirect } from "next/navigation";

import { getOnboardingOverview } from "@/modules/onboarding/service";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export interface StudentAppRouteContext {
  userId: string;
  displayName: string;
  supportChips: string[];
  onboardingSubjectIds: string[];
}

/** Auth + onboarding gate + shell props for signed-in student routes. */
export async function requireStudentAppRouteContext(): Promise<StudentAppRouteContext> {
  const session = await requireAuthenticatedRequestSession();
  const onboarding = await getOnboardingOverview(session.user.userId);

  if (!onboarding.isComplete) {
    redirect("/onboarding");
  }

  return {
    userId: session.user.userId,
    displayName: session.user.displayName,
    supportChips: [],
    onboardingSubjectIds: onboarding.profile?.selectedSubjectIds ?? [],
  };
}
