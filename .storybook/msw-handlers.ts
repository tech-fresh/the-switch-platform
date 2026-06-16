import { HttpResponse, http } from "msw";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import { baseAccessibilitySnapshot } from "./story-fixtures";

export const mswHandlers = [
  http.delete("/api/auth/session", () => HttpResponse.json({ success: true })),
  http.patch("/api/cms/workflow/:contentId", async ({ params, request }) => {
    const payload = (await request.json()) as {
      actionType: string;
      note: string;
      owner: string;
      status: string;
    };

    return HttpResponse.json({
      contentId: params.contentId,
      workflow: {
        status: payload.status,
        note: payload.note,
        owner: payload.owner,
        actionType: payload.actionType,
      },
    });
  }),
  http.patch("/api/saved-progress/session/:entityType/:entityId", async ({ params, request }) => {
    const payload = (await request.json()) as {
      status: string;
      entityType: string;
      entityId: string;
    };

    return HttpResponse.json({
      session: {
        entityId: params.entityId ?? payload.entityId,
        entityType: params.entityType ?? payload.entityType,
        status: payload.status,
      },
    });
  }),
  http.patch("/api/accessibility/snapshot", async ({ request }) => {
    const payload = (await request.json()) as {
      settings?: AccessibilitySnapshot["settings"];
    };

    return HttpResponse.json({
      snapshot: {
        settings: payload.settings ?? baseAccessibilitySnapshot.settings,
        studentAccessProfile: {
          ...baseAccessibilitySnapshot.studentAccessProfile,
          preferredReadingSpeed:
            payload.settings?.preferredReadingSpeed ??
            baseAccessibilitySnapshot.studentAccessProfile.preferredReadingSpeed,
          preferredFontSize:
            payload.settings?.preferredFontSize ??
            baseAccessibilitySnapshot.studentAccessProfile.preferredFontSize,
          preferredColourScheme:
            payload.settings?.preferredColourScheme ??
            baseAccessibilitySnapshot.studentAccessProfile.preferredColourScheme,
          textToSpeechEnabled:
            payload.settings?.textToSpeechEnabled ??
            baseAccessibilitySnapshot.studentAccessProfile.textToSpeechEnabled,
          accessibilityPreferences:
            payload.settings?.preferences ??
            baseAccessibilitySnapshot.studentAccessProfile.accessibilityPreferences,
        },
      } satisfies AccessibilitySnapshot,
    });
  }),
];
