import type { ReadAloudAccessArrangementConfig } from "@/modules/access-arrangements";

export type ReadAloudContentType =
  | "revision-notes"
  | "question"
  | "answer"
  | "worked-example"
  | "feedback"
  | "recommendation";

export interface ReadAloudVoiceOption {
  voiceId: string;
  label: string;
  language: string;
}

export interface ReadAloudSession {
  sessionId: string;
  userId: string;
  accessArrangementConfig?: ReadAloudAccessArrangementConfig;
  contentType: ReadAloudContentType;
  previewText: string;
  selectedVoiceId: string;
  speed: number;
  availableVoices: ReadAloudVoiceOption[];
}
