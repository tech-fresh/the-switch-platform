import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getJourneyNextActionApiData, getResultsOverviewApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { ResultsExperience } from "./results-experience";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const [shell, results, journey] = await Promise.all([
    requireStudentAppRouteContext(),
    getResultsOverviewApiData(),
    getJourneyNextActionApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <div className="flex flex-col gap-6">
        <ResultsExperience results={results} />
        <JourneyNextStepPanel journey={journey} />
      </div>
    </StudentAppShell>
  );
}
