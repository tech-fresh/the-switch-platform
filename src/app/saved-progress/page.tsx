import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getJourneyNextActionApiData, getSavedProgressOverviewApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { SavedProgressExperience } from "./saved-progress-experience";

export const dynamic = "force-dynamic";

export default async function SavedProgressPage() {
  const [shell, overview, journey] = await Promise.all([
    requireStudentAppRouteContext(),
    getSavedProgressOverviewApiData(),
    getJourneyNextActionApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <SavedProgressExperience overview={overview} journey={journey} />
    </StudentAppShell>
  );
}
