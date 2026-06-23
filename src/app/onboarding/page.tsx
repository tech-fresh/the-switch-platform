import { redirect } from "next/navigation";

import { OnboardingExperience } from "@/app/onboarding/onboarding-experience";
import { getOnboardingOverviewApiData } from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  await requireAuthenticatedRequestSession();
  const onboarding = await getOnboardingOverviewApiData();

  if (onboarding.isComplete) {
    redirect("/dashboard");
  }

  return <OnboardingExperience initialOverview={onboarding} />;
}
