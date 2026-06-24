import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getResultsOverviewApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { ResultsExperience } from "./results-experience";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const [shell, results] = await Promise.all([
    requireStudentAppRouteContext(),
    getResultsOverviewApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <ResultsExperience results={results} />
    </StudentAppShell>
  );
}
