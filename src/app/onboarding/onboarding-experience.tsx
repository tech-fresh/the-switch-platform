"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  OnboardingBackButton,
  OnboardingContinueButton,
  OnboardingShell,
} from "@/components/onboarding/onboarding-shell";
import type { LearnerOnboardingProfile, OnboardingOverview } from "@/modules/onboarding/types";

interface OnboardingExperienceProps {
  initialOverview: OnboardingOverview;
  displayName: string;
}

type DraftProfile = Partial<LearnerOnboardingProfile>;

const TOTAL_STEPS = 8;

const ROLE_STYLES: Record<string, { emoji: string; circle: string }> = {
  student: { emoji: "🎓", circle: "bg-orange-100 text-orange-600" },
  "parent-guardian": { emoji: "👨‍👩‍👧", circle: "bg-violet-100 text-violet-600" },
  "teacher-staff": { emoji: "💼", circle: "bg-rose-100 text-rose-600" },
};

const QUALIFICATION_ICONS: Record<string, string> = {
  "gcse-england": "🎒",
  "gcse-wales": "🏴",
  "gcse-northern-ireland": "📜",
  igcse: "🌍",
};

const SUBJECT_ICONS: Record<string, string> = {
  "gcse-maths": "📐",
  "gcse-english-language": "✍️",
  "gcse-combined-science": "🧬",
  "igcse-maths": "📊",
};

const YEAR_PERSONAS = [
  { yearGroup: "Year 11", title: "Exam ready", emoji: "🤖" },
  { yearGroup: "Year 10", title: "Building momentum", emoji: "😅" },
  { yearGroup: "Year 9", title: "Getting started", emoji: "🙂" },
];

async function saveProfile(update: DraftProfile & { complete?: boolean }) {
  const response = await fetch("/api/onboarding/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile: update }),
  });

  const payload = (await response.json()) as {
    error?: string;
    profile?: LearnerOnboardingProfile;
    isComplete?: boolean;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not save onboarding step.");
  }

  return payload;
}

function firstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] || "there";
}

export function OnboardingExperience({ initialOverview, displayName }: OnboardingExperienceProps) {
  const [stepIndex, setStepIndex] = useState(initialOverview.nextStepIndex);
  const [profile, setProfile] = useState<DraftProfile>(initialOverview.profile ?? {});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const options = initialOverview.options;
  const selectedSubjectIds = profile.selectedSubjectIds ?? [];
  const learnerFirstName = firstName(displayName);

  const qualificationLabel = useMemo(() => {
    const match = options.qualificationPaths.find((path) => path.id === profile.qualificationPath);
    return match?.label.replace("(England)", "").replace("(Wales)", "").trim() ?? "GCSE";
  }, [options.qualificationPaths, profile.qualificationPath]);

  async function persistStep(update: DraftProfile, nextStep: number, complete = false) {
    setIsSaving(true);
    setError(null);

    try {
      const result = await saveProfile({ ...update, complete });
      if (result.profile) {
        setProfile(result.profile);
      }

      if (result.isComplete) {
        window.location.href = "/dashboard";
        return;
      }

      setStepIndex(nextStep);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this step.");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleSubject(subjectId: string) {
    const next = selectedSubjectIds.includes(subjectId)
      ? selectedSubjectIds.filter((id) => id !== subjectId)
      : [...selectedSubjectIds, subjectId];
    setProfile({ ...profile, selectedSubjectIds: next });
  }

  function canContinueCurrentStep(): boolean {
    switch (stepIndex) {
      case 0:
        return Boolean(profile.learnerRole);
      case 1:
        return Boolean(profile.qualificationPath);
      case 2:
        return Boolean(profile.yearGroup?.trim());
      case 3:
        return Boolean(profile.schoolName?.trim());
      case 4:
        return selectedSubjectIds.length > 0;
      case 7:
        return Boolean(profile.ageOrConsentConfirmed);
      default:
        return true;
    }
  }

  const stepContent = (() => {
    if (stepIndex === 0) {
      return (
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {options.learnerRoles.map((role) => {
            const style = ROLE_STYLES[role.id] ?? ROLE_STYLES.student;
            const selected = profile.learnerRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setProfile({ ...profile, learnerRole: role.id })}
                className={`rounded-2xl border-2 bg-white p-6 text-center transition ${
                  selected ? "border-sky-500 shadow-md" : "border-transparent shadow-sm hover:border-slate-200"
                }`}
              >
                <span
                  className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full text-2xl ${style.circle}`}
                >
                  {style.emoji}
                </span>
                <p className="text-sm text-slate-500">I&apos;m a</p>
                <p className="mt-1 text-base font-semibold text-slate-800">{role.label.toLowerCase()}</p>
              </button>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {options.qualificationPaths.map((path) => {
            const selected = profile.qualificationPath === path.id;
            return (
              <label
                key={path.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition ${
                  selected ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"
                }`}
              >
                <input
                  className="size-4 rounded border-slate-300 text-sky-600"
                  type="radio"
                  name="qualificationPath"
                  checked={selected}
                  onChange={() => setProfile({ ...profile, qualificationPath: path.id })}
                />
                <span className="flex-1 text-sm font-medium text-slate-700">{path.label}</span>
                <span className="text-xl">{QUALIFICATION_ICONS[path.id] ?? "📘"}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {YEAR_PERSONAS.map((persona) => {
            const selected = profile.yearGroup === persona.yearGroup;
            return (
              <button
                key={persona.yearGroup}
                type="button"
                onClick={() => setProfile({ ...profile, yearGroup: persona.yearGroup })}
                className={`rounded-2xl border-2 bg-white p-6 text-center transition ${
                  selected ? "border-sky-500 shadow-md" : "border-transparent shadow-sm hover:border-slate-200"
                }`}
              >
                <span className="mx-auto mb-3 block text-4xl">{persona.emoji}</span>
                <p className="text-sm text-slate-500">{learnerFirstName} the</p>
                <p className="mt-1 text-base font-semibold text-slate-800">{persona.title}</p>
                <p className="mt-2 text-xs text-slate-500">{persona.yearGroup}</p>
              </button>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">School name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={profile.schoolName ?? ""}
              onChange={(event) => setProfile({ ...profile, schoolName: event.target.value })}
              placeholder="Start typing your school"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Nation</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={profile.schoolNation ?? "england"}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  schoolNation: event.target.value as LearnerOnboardingProfile["schoolNation"],
                })
              }
            >
              <option value="england">England</option>
              <option value="scotland">Scotland</option>
              <option value="wales">Wales</option>
              <option value="northern-ireland">Northern Ireland</option>
            </select>
          </label>
          <div className="rounded-xl bg-sky-50 p-4 text-sm text-sky-950">
            <p className="font-medium">Find your school using official UK sources</p>
            <ul className="mt-2 space-y-1">
              {options.schoolSources.map((source) => (
                <li key={source.nation}>
                  <a className="underline" href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {options.subjects.map((subject) => {
            const selected = selectedSubjectIds.includes(subject.subjectId);
            return (
              <label
                key={subject.subjectId}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition ${
                  selected ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-sky-600"
                  checked={selected}
                  onChange={() => toggleSubject(subject.subjectId)}
                />
                <span className="flex-1 text-sm font-medium text-slate-700">{subject.name}</span>
                <span className="text-xl">{SUBJECT_ICONS[subject.subjectId] ?? "📘"}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 5) {
      return (
        <div className="mx-auto max-w-xl space-y-3 rounded-2xl bg-white p-6 shadow-sm">
          {[
            {
              key: "wantsAccessibilitySupport",
              label: "I want accessibility support as part of my setup.",
            },
            {
              key: "wantsAccessArrangementHelp",
              label: "I may need exam access arrangement help (extra time, reader, rest breaks).",
            },
            {
              key: "sendSupportPathVisible",
              label: "Show SEND and support-path signposting in my first weeks.",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm"
            >
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
                checked={Boolean(profile[item.key as keyof DraftProfile])}
                onChange={(event) =>
                  setProfile({ ...profile, [item.key]: event.target.checked })
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
          <p className="text-xs text-slate-500">
            Support stays signposting-first — not counselling or AI wellbeing support.
          </p>
        </div>
      );
    }

    if (stepIndex === 6) {
      return (
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Guardian email (optional)</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              type="email"
              value={profile.guardianInviteEmail ?? ""}
              onChange={(event) =>
                setProfile({ ...profile, guardianInviteEmail: event.target.value })
              }
              placeholder="parent@example.com"
            />
          </label>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
            checked={Boolean(profile.ageOrConsentConfirmed)}
            onChange={(event) =>
              setProfile({ ...profile, ageOrConsentConfirmed: event.target.checked })
            }
          />
          <span>
            I confirm that I am old enough to use The Switch, or that a parent, guardian, or teacher
            has agreed to this setup.
          </span>
        </label>
      </div>
    );
  })();

  const titles: Record<number, { title: ReactNode; subtitle?: ReactNode }> = {
    0: { title: "Select your Switch account type:" },
    1: {
      title: "What are you studying for this year?",
      subtitle: "More than one? Pick your main route — we'll narrow down the specifics later.",
    },
    2: {
      title: `Great to meet you, ${learnerFirstName}!`,
      subtitle: "Which profile matches your vibe? You can change this later.",
    },
    3: {
      title: "Where do you go to school?",
      subtitle: "We use official UK school sources — not a static guess list.",
    },
    4: {
      title: (
        <>
          Which <span className="text-sky-600">🎒 {qualificationLabel}</span> subjects are you studying?
        </>
      ),
      subtitle: "We'll narrow down the specifics later...",
    },
    5: {
      title: "Accessibility and support",
      subtitle: "Optional — tell us if you want accessibility or access-arrangement help visible early.",
    },
    6: {
      title: "Invite a parent or guardian",
      subtitle: "Optional during MVP — school-age learners can add a guardian email here.",
    },
    7: {
      title: "Almost there!",
      subtitle: "Confirm age or consent, then we'll build your first dashboard.",
    },
  };

  const currentTitle = titles[stepIndex] ?? titles[0];
  const continueLabel =
    stepIndex === 4 ? "Let's go!" : stepIndex === 7 ? "Open my dashboard" : "Continue";

  return (
    <OnboardingShell
      stepIndex={stepIndex}
      totalSteps={TOTAL_STEPS}
      title={currentTitle.title}
      subtitle={currentTitle.subtitle}
      error={error}
      footer={
        <>
          {stepIndex > 0 ? (
            <OnboardingBackButton disabled={isSaving} onClick={() => setStepIndex(stepIndex - 1)} />
          ) : (
            <span />
          )}
          <OnboardingContinueButton
            label={isSaving ? "Saving..." : continueLabel}
            disabled={isSaving || !canContinueCurrentStep()}
            onClick={() => {
              if (stepIndex === 7) {
                void persistStep(profile, 8, true);
                return;
              }
              void persistStep(profile, stepIndex + 1);
            }}
          />
        </>
      }
    >
      {stepContent}
    </OnboardingShell>
  );
}
