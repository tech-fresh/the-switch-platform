import type { SavedProgressAccessArrangementSnapshot } from "@/modules/access-arrangements";

export interface SavedProgressRecord {
  progressId: string;
  userId: string;
  accessArrangementSnapshot?: SavedProgressAccessArrangementSnapshot;
}
