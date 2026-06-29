import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
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
      <main className={mark32Ui.publicMain}>
        <div className={mark32Ui.contentWrap}>{experience}</div>
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
