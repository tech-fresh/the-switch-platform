import type { ReadAloudAccessArrangementConfig } from "@/modules/access-arrangements";

export interface ReadAloudSession {
  sessionId: string;
  userId: string;
  accessArrangementConfig?: ReadAloudAccessArrangementConfig;
}
