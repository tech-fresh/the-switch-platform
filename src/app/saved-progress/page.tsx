import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getSavedProgressOverviewApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { SavedProgressExperience } from "./saved-progress-experience";

export const dynamic = "force-dynamic";

export default async function SavedProgressPage() {
  const [shell, overview] = await Promise.all([
    requireStudentAppRouteContext(),
    getSavedProgressOverviewApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <SavedProgressExperience overview={overview} />
    </StudentAppShell>
  );
}
