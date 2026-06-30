"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Mark32PageHeader } from "@/components/streamlined/mark32-page-header";
import { ACCESSIBILITY_UPDATED_EVENT } from "@/components/accessibility-runtime";
import type { ColourSchemePreference } from "@/modules/access-arrangements";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import type { Recommendation } from "@/modules/recommendations/types";
import type { ReadAloudSession } from "@/modules/read-aloud/types";
import type { SupportHubData } from "@/modules/support/types";

interface AccessibilityExperienceProps {
  snapshot: AccessibilitySnapshot;
  readAloudSession: ReadAloudSession;
  recommendations: Recommendation[];
  support: SupportHubData;
}

type ToggleKey =
  | "focusModeEnabled"
  | "highContrastModeEnabled"
  | "dyslexiaFriendlyFontEnabled"
  | "reducedDistractionModeEnabled"
  | "textToSpeechEnabled";

export function AccessibilityExperience({
  snapshot,
  readAloudSession,
  recommendations,
  support,
}: AccessibilityExperienceProps) {
  const [settings, setSettings] = useState(snapshot.settings);
  const [accessProfile, setAccessProfile] = useState(snapshot.studentAccessProfile);
  const [speed, setSpeed] = useState(readAloudSession.speed);
  const [voiceId, setVoiceId] = useState(readAloudSession.selectedVoiceId);
  const [previewState, setPreviewState] = useState<"idle" | "playing" | "paused">("idle");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const derivedPreview = useMemo(
    () => ({
      ...readAloudSession,
      speed,
      selectedVoiceId: voiceId,
    }),
    [readAloudSession, speed, voiceId],
  );
  const readAloudEnabled =
    accessProfile.activeAccessArrangements.includes("READER") ||
    accessProfile.activeAccessArrangements.includes("TEXT_TO_SPEECH") ||
    settings.textToSpeechEnabled;
  const readAloudSource = accessProfile.activeAccessArrangements.includes("READER") ||
    accessProfile.activeAccessArrangements.includes("TEXT_TO_SPEECH")
    ? "access-arrangement"
    : settings.textToSpeechEnabled
      ? "student-preference"
      : "disabled";

  const toggleSetting = (key: ToggleKey) => {
    setSaveState("idle");
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const updateColourScheme = (preferredColourScheme: ColourSchemePreference) => {
    setSaveState("idle");
    setSettings((current) => ({
      ...current,
      preferredColourScheme,
    }));
  };

  const updateFontSize = (preferredFontSize: number) => {
    setSaveState("idle");
    setSettings((current) => ({
      ...current,
      preferredFontSize,
    }));
  };

  const updateLineSpacing = (lineSpacing: "default" | "wide" | "extra-wide") => {
    setSaveState("idle");
    setSettings((current) => ({
      ...current,
      lineSpacing,
    }));
  };

  const updateReadingSpeed = (preferredReadingSpeed: number) => {
    setSaveState("idle");
    setSpeed(preferredReadingSpeed);
    setSettings((current) => ({
      ...current,
      preferredReadingSpeed,
    }));
  };

  const handleSaveSettings = async () => {
    setSaveState("saving");

    try {
      const response = await fetch("/api/accessibility/snapshot", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error("Accessibility save request failed.");
      }

      const payload = (await response.json()) as { snapshot: AccessibilitySnapshot };

      setSettings(payload.snapshot.settings);
      setAccessProfile(payload.snapshot.studentAccessProfile);
      window.dispatchEvent(
        new CustomEvent(ACCESSIBILITY_UPDATED_EVENT, {
          detail: payload.snapshot,
        }),
      );
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const handleReadAloudAction = (nextState: "playing" | "paused" | "idle") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (nextState === "playing") {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(derivedPreview.previewText);
        utterance.rate = derivedPreview.speed;
        utterance.lang =
          derivedPreview.availableVoices.find((voice) => voice.voiceId === derivedPreview.selectedVoiceId)
            ?.language ?? "en-GB";
        utterance.onend = () => setPreviewState("idle");
        window.speechSynthesis.speak(utterance);
      }

      if (nextState === "paused") {
        window.speechSynthesis.pause();
      }

      if (nextState === "idle") {
        window.speechSynthesis.cancel();
      }
    }

    setPreviewState(nextState);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <Mark32PageHeader
          eyebrow="Accessibility + access"
          eyebrowTone="emerald"
          title="Support settings, read aloud, and next-step guidance"
          description="Control what you need for study — colour overlays, focus modes, read aloud preview, and links to access arrangements and support."
          stats={[
            {
              label: "Access profile",
              value: `${accessProfile.activeAccessArrangements.length || 0} active`,
              detail: accessProfile.activeAccessArrangements.length
                ? accessProfile.activeAccessArrangements.join(", ")
                : "No formal arrangements applied yet",
            },
            {
              label: "Read aloud",
              value: readAloudSource,
              detail: readAloudEnabled
                ? "Support is available in the current profile."
                : "Preview is ready even before formal support is enabled.",
            },
            {
              label: "Preference carry-over",
              value: "Saved",
              detail: "Settings travel with saved sessions and persist across study routes.",
            },
          ]}
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Support safety
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Accessibility stays practical while urgent help stays clear
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {support.routeGuidance.find((guidance) => guidance.routeId === "/accessibility")?.message}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {support.safetyReview.escalationGuidance}
                </p>
                <Link
                  href="/support"
                  className="mt-4 inline-flex items-center justify-center border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-violet-300"
                >
                  Open support hub
                </Link>
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="border-b border-stone-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Accessibility settings
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Core support controls
                </h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["focusModeEnabled", "Focus mode"],
                  ["highContrastModeEnabled", "High contrast"],
                  ["dyslexiaFriendlyFontEnabled", "Dyslexia friendly font"],
                  ["reducedDistractionModeEnabled", "Reduced distraction"],
                  ["textToSpeechEnabled", "Text to speech"],
                ].map(([key, label]) => {
                  const settingKey = key as ToggleKey;
                  const enabled = settings[settingKey];

                  return (
                    <button
                      key={settingKey}
                      type="button"
                      onClick={() => toggleSetting(settingKey)}
                      className={`flex items-center justify-between border px-4 py-4 text-left transition ${
                        enabled
                          ? "border-amber-700 bg-amber-50 text-stone-950"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs uppercase tracking-[0.2em]">
                        {enabled ? "On" : "Off"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Font size</p>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="1"
                    value={settings.preferredFontSize}
                    onChange={(event) => updateFontSize(Number(event.target.value))}
                    className="mt-4 w-full"
                  />
                  <p className="mt-2 text-2xl font-semibold text-stone-950">
                    {settings.preferredFontSize}px
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Colour scheme</p>
                  <select
                    value={settings.preferredColourScheme}
                    onChange={(event) => updateColourScheme(event.target.value as ColourSchemePreference)}
                    className="mt-4 w-full border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
                  >
                    <option value="default">Default</option>
                    <option value="high-contrast">High contrast</option>
                    <option value="cream">Cream</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                  </select>
                  <p className="mt-2 text-2xl font-semibold capitalize text-stone-950">
                    {settings.preferredColourScheme}
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Line spacing</p>
                  <select
                    value={settings.lineSpacing}
                    onChange={(event) =>
                      updateLineSpacing(event.target.value as "default" | "wide" | "extra-wide")
                    }
                    className="mt-4 w-full border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
                  >
                    <option value="default">Default</option>
                    <option value="wide">Wide</option>
                    <option value="extra-wide">Extra wide</option>
                  </select>
                  <p className="mt-2 text-2xl font-semibold capitalize text-stone-950">
                    {settings.lineSpacing}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saveState === "saving"}
                  className="border border-amber-700 bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saveState === "saving" ? "Saving..." : "Save support settings"}
                </button>
                <p className="text-sm text-stone-600">
                  {saveState === "saved"
                    ? "Saved to the accessibility, access-profile, and read-aloud preference layer."
                    : saveState === "error"
                      ? "Settings could not be saved just yet."
                      : "Save these settings so future read-aloud, exam, and resume flows can reuse them."}
                </p>
              </div>
            </article>

            <article className="border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                    Read aloud preview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                    Browser speech synthesis preview
                  </h2>
                </div>
                <span className="text-sm capitalize text-stone-600">{previewState}</span>
              </div>

              <div className="mt-5 space-y-5">
                <div className="border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm leading-7 text-stone-700">
                  {derivedPreview.previewText}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-stone-700">Voice</span>
                    <select
                      value={voiceId}
                      onChange={(event) => setVoiceId(event.target.value)}
                      className="w-full border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
                    >
                      {derivedPreview.availableVoices.map((voice) => (
                        <option key={voice.voiceId} value={voice.voiceId}>
                          {voice.label} ({voice.language})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-stone-700">Speed</span>
                    <input
                      type="range"
                      min="0.8"
                      max="1.6"
                      step="0.1"
                      value={speed}
                      onChange={(event) => updateReadingSpeed(Number(event.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-stone-600">{speed.toFixed(1)}x</p>
                  </label>
                </div>

                <p className="text-sm leading-6 text-stone-600">
                  Save this support profile to make the selected reading speed the default for
                  future read-aloud sessions in exams and timed assessments.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleReadAloudAction("playing")}
                    className="border border-amber-700 bg-amber-700 px-4 py-2 text-sm font-medium text-white"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReadAloudAction("paused")}
                    className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReadAloudAction("idle")}
                    className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Recommendations
              </h2>
              <div className="mt-4 space-y-3">
                {recommendations.map((recommendation) => (
                  <a
                    key={recommendation.recommendationId}
                    href={recommendation.href}
                    className="block border border-stone-200 bg-stone-50 p-4 transition hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-stone-950">{recommendation.title}</p>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                        {recommendation.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {recommendation.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-amber-700">
                      {recommendation.actionLabel}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            <section className="border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                What this route proves
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                <li>Accessibility settings can live outside the page in their own module.</li>
                <li>Read aloud can be previewed without folding support logic into exams.</li>
                <li>Support and progress signals can combine into actionable recommendations.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
