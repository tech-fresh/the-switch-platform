import { redirect } from "next/navigation";

import { OnboardingExperience } from "@/app/onboarding/onboarding-experience";
import { getAccountOverviewApiData, getOnboardingOverviewApiData } from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await requireAuthenticatedRequestSession();
  const [onboarding, account] = await Promise.all([
    getOnboardingOverviewApiData(),
    getAccountOverviewApiData(),
  ]);

  if (onboarding.isComplete) {
    redirect("/dashboard");
  }

  const displayName =
    account.session.status === "authenticated"
      ? account.session.user.displayName
      : session.user.displayName;

  return <OnboardingExperience initialOverview={onboarding} displayName={displayName} />;
}
