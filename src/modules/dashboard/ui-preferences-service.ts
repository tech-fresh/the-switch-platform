import {
  readDashboardUiPreferencesRecords,
  writeDashboardUiPreferencesRecords,
} from "@/lib/persistence/dashboard-ui-preferences-store";

export interface DashboardUiPreferences {
  plannerPromptDismissed: boolean;
}

export async function getDashboardUiPreferences(userId: string): Promise<DashboardUiPreferences> {
  const records = await readDashboardUiPreferencesRecords();
  const record = records.find((item) => item.userId === userId);

  return {
    plannerPromptDismissed: record?.plannerPromptDismissed ?? false,
  };
}

export async function setPlannerPromptDismissed(
  userId: string,
  dismissed: boolean,
): Promise<DashboardUiPreferences> {
  const records = await readDashboardUiPreferencesRecords();
  const nextRecord = {
    userId,
    plannerPromptDismissed: dismissed,
    updatedAt: new Date().toISOString(),
  };
  const withoutUser = records.filter((item) => item.userId !== userId);

  await writeDashboardUiPreferencesRecords([...withoutUser, nextRecord]);

  return {
    plannerPromptDismissed: dismissed,
  };
}
