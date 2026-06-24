import { redirect } from "next/navigation";

import {
  getAccountOverviewApiData,
  getDashboardHomeApiData,
  getOnboardingOverviewApiData,
} from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export interface StudentAppRouteContext {
  displayName: string;
  supportChips: string[];
  onboardingSubjectIds: string[];
}

/** Auth + onboarding gate + shell props for signed-in student routes. */
export async function requireStudentAppRouteContext(): Promise<StudentAppRouteContext> {
  const session = await requireAuthenticatedRequestSession();
  const onboarding = await getOnboardingOverviewApiData();

  if (!onboarding.isComplete) {
    redirect("/onboarding");
  }

  const [dashboard, account] = await Promise.all([
    getDashboardHomeApiData(),
    getAccountOverviewApiData(),
  ]);

  const displayName =
    account.session.status === "authenticated"
      ? account.session.user.displayName
      : session.user.displayName;

  return {
    displayName,
    supportChips: dashboard.supportPreferenceChips,
    onboardingSubjectIds: onboarding.profile?.selectedSubjectIds ?? [],
  };
}
