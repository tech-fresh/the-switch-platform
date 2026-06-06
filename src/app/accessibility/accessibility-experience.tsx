"use client";

import { useMemo, useState } from "react";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import type { Recommendation } from "@/modules/recommendations/types";
import type { ReadAloudSession } from "@/modules/read-aloud/types";

interface AccessibilityExperienceProps {
  snapshot: AccessibilitySnapshot;
  readAloudSession: ReadAloudSession;
  recommendations: Recommendation[];
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
}: AccessibilityExperienceProps) {
  const [settings, setSettings] = useState(snapshot.settings);
  const [speed, setSpeed] = useState(readAloudSession.speed);
  const [voiceId, setVoiceId] = useState(readAloudSession.selectedVoiceId);
  const [previewState, setPreviewState] = useState<"idle" | "playing" | "paused">("idle");

  const derivedPreview = useMemo(
    () => ({
      ...readAloudSession,
      speed,
      selectedVoiceId: voiceId,
    }),
    [readAloudSession, speed, voiceId],
  );

  const toggleSetting = (key: ToggleKey) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
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
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 border-b border-stone-200 pb-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Accessibility + Support
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Support settings, read aloud preview, and next-step guidance in one student-ready route.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                This route turns the support architecture into a real product slice. It shows what
                the student can control, what access-arrangement support is active, and how those
                settings connect to live recommendations.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Access profile</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {snapshot.studentAccessProfile.activeAccessArrangements.length || 0} active
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {snapshot.studentAccessProfile.activeAccessArrangements.length
                  ? snapshot.studentAccessProfile.activeAccessArrangements.join(", ")
                  : "No formal arrangements applied yet"}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Read aloud</p>
              <p className="mt-2 text-lg font-semibold text-stone-950 capitalize">
                {readAloudSession.accessArrangementConfig?.source ?? "disabled"}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {readAloudSession.accessArrangementConfig?.enabled
                  ? "Support is available in the current profile."
                  : "Preview is ready even before formal support is enabled."}
              </p>
            </div>
            <div className="border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Preference carry-over</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">Saved</p>
              <p className="mt-1 text-sm text-stone-600">
                Settings are designed to travel with saved sessions and future API persistence.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
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
                  <p className="mt-2 text-2xl font-semibold text-stone-950">
                    {settings.preferredFontSize}px
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Colour scheme</p>
                  <p className="mt-2 text-2xl font-semibold capitalize text-stone-950">
                    {settings.preferredColourScheme}
                  </p>
                </div>
                <div className="border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Line spacing</p>
                  <p className="mt-2 text-2xl font-semibold capitalize text-stone-950">
                    {settings.lineSpacing}
                  </p>
                </div>
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
                      onChange={(event) => setSpeed(Number(event.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-stone-600">{speed.toFixed(1)}x</p>
                  </label>
                </div>

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
    </main>
  );
}
