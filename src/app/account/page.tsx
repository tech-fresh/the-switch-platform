import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getAccountOverviewApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { AccountExperience, getAccountAuthErrorMessage } from "./account-experience";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ authError?: string | string[] | undefined }>;
}) {
  const [account, resolvedSearchParams] = await Promise.all([
    getAccountOverviewApiData(),
    searchParams ?? Promise.resolve({} as { authError?: string | string[] | undefined }),
  ]);
  const rawAuthError = resolvedSearchParams.authError;
  const authError = Array.isArray(rawAuthError) ? rawAuthError[0] : rawAuthError;
  const authErrorMessage = getAccountAuthErrorMessage(authError);
  const experience = <AccountExperience account={account} authErrorMessage={authErrorMessage} />;

  if (!account.isAuthenticated) {
    return (
      <main className="min-h-screen bg-stone-100 text-stone-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{experience}</div>
      </main>
    );
  }

  const shell = await requireStudentAppRouteContext();

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      {experience}
    </StudentAppShell>
  );
}
