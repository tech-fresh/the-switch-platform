import { getStudentAccessProfile } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import type { ReadAloudContentType, ReadAloudSession, ReadAloudVoiceOption } from "./types";

const mockVoices: ReadAloudVoiceOption[] = [
  { voiceId: "en-gb-student-clear", label: "Clear UK Voice", language: "en-GB" },
  { voiceId: "en-gb-warm-guide", label: "Warm UK Voice", language: "en-GB" },
  { voiceId: "en-us-neutral-study", label: "Neutral Study Voice", language: "en-US" },
];

const previewTextByType: Record<ReadAloudContentType, string> = {
  "revision-notes":
    "Ratio compares quantities. Start by finding the total number of parts before scaling each share.",
  question:
    "Which quotation best shows that the setting feels isolated?",
  answer:
    "The strongest answer is the single light across the empty moor because it suggests distance and loneliness.",
  "worked-example":
    "Expand each bracket first, then combine the like terms to reach the simplified expression.",
  feedback:
    "You chose the right method, but the final sign changed direction in the last line.",
  recommendation:
    "Revise Chemical Changes next, then attempt the short timed checkpoint while the examples are still fresh.",
};

export async function getReadAloudSession(
  userId: string,
  contentType: ReadAloudContentType,
  repository?: StudentAccessProfileRepository,
): Promise<ReadAloudSession> {
  const profile = await getStudentAccessProfile(userId, repository);
  const enabledByArrangement =
    profile.activeAccessArrangements.includes("READER") ||
    profile.activeAccessArrangements.includes("TEXT_TO_SPEECH");
  const accessArrangementConfig = {
    enabled: enabledByArrangement || profile.textToSpeechEnabled,
    readingSpeed: profile.preferredReadingSpeed,
    source: enabledByArrangement
      ? ("access-arrangement" as const)
      : profile.textToSpeechEnabled
        ? ("student-preference" as const)
        : ("disabled" as const),
  };

  return {
    sessionId: `read-aloud-${userId}-${contentType}`,
    userId,
    accessArrangementConfig,
    contentType,
    previewText: previewTextByType[contentType],
    selectedVoiceId: mockVoices[0].voiceId,
    speed: profile.preferredReadingSpeed,
    availableVoices: mockVoices,
  };
}
