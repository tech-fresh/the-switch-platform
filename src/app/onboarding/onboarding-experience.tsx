"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { OnboardingOverview } from "@/modules/onboarding/types";
import type { LearnerOnboardingProfile } from "@/modules/onboarding/types";

interface OnboardingExperienceProps {
  initialOverview: OnboardingOverview;
}

type DraftProfile = Partial<LearnerOnboardingProfile>;

async function saveProfile(update: DraftProfile & { complete?: boolean }) {
  const response = await fetch("/api/onboarding/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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

export function OnboardingExperience({ initialOverview }: OnboardingExperienceProps) {
  const [stepIndex, setStepIndex] = useState(initialOverview.nextStepIndex);
  const [profile, setProfile] = useState<DraftProfile>(initialOverview.profile ?? {});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const options = initialOverview.options;

  const stepLabels = [
    "Welcome",
    "School",
    "Qualification",
    "Subjects",
    "Accessibility",
    "Guardian",
    "Consent",
    "Complete",
  ];

  const selectedSubjectIds = profile.selectedSubjectIds ?? [];

  const progressLabel = useMemo(
    () => `Step ${Math.min(stepIndex + 1, stepLabels.length)} of ${stepLabels.length}`,
    [stepIndex, stepLabels.length],
  );

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

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            Guided setup
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Build your first dashboard</h1>
          <p className="text-sm leading-7 text-stone-600">
            This journey captures school context, qualification route, subjects, accessibility,
            guardian invite, and consent before your personalised dashboard opens.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{progressLabel}</p>
        </header>

        {error ? (
          <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}

        <section className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          {stepIndex === 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Welcome — who is this account for?</h2>
              <div className="grid gap-3">
                {options.learnerRoles.map((role) => (
                  <label
                    key={role.id}
                    className={`block cursor-pointer border p-4 ${
                      profile.learnerRole === role.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="learnerRole"
                      checked={profile.learnerRole === role.id}
                      onChange={() => setProfile({ ...profile, learnerRole: role.id })}
                    />
                    <p className="font-medium">{role.label}</p>
                    <p className="mt-1 text-sm text-stone-600">{role.description}</p>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">School and year group</h2>
              <label className="block space-y-2 text-sm">
                <span className="font-medium">School name</span>
                <input
                  className="w-full border border-stone-300 px-3 py-2"
                  value={profile.schoolName ?? ""}
                  onChange={(event) => setProfile({ ...profile, schoolName: event.target.value })}
                  placeholder="Start typing your school name"
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Nation</span>
                <select
                  className="w-full border border-stone-300 px-3 py-2"
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
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Year group</span>
                <select
                  className="w-full border border-stone-300 px-3 py-2"
                  value={profile.yearGroup ?? "Year 11"}
                  onChange={(event) => setProfile({ ...profile, yearGroup: event.target.value })}
                >
                  {options.yearGroups.map((yearGroup) => (
                    <option key={yearGroup} value={yearGroup}>
                      {yearGroup}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-2 border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
                <p className="font-medium">UK school lookup sources</p>
                <ul className="space-y-1">
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
          ) : null}

          {stepIndex === 2 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Qualification path</h2>
              <div className="grid gap-3">
                {options.qualificationPaths.map((path) => (
                  <label
                    key={path.id}
                    className={`block cursor-pointer border p-4 ${
                      profile.qualificationPath === path.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="qualificationPath"
                      checked={profile.qualificationPath === path.id}
                      onChange={() => setProfile({ ...profile, qualificationPath: path.id })}
                    />
                    <p className="font-medium">{path.label}</p>
                    <p className="mt-1 text-sm text-stone-600">{path.description}</p>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Choose your subjects</h2>
              <p className="text-sm text-stone-600">
                GCSE and iGCSE routes are both supported. Pick the subjects you want on your dashboard.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.subjects.map((subject) => (
                  <label
                    key={subject.subjectId}
                    className={`flex cursor-pointer items-start gap-3 border p-3 text-sm ${
                      selectedSubjectIds.includes(subject.subjectId)
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjectIds.includes(subject.subjectId)}
                      onChange={() => toggleSubject(subject.subjectId)}
                    />
                    <span>
                      <span className="block font-medium">{subject.name}</span>
                      <span className="text-stone-600">{subject.qualificationLabel}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 4 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Accessibility and support paths</h2>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(profile.wantsAccessibilitySupport)}
                  onChange={(event) =>
                    setProfile({ ...profile, wantsAccessibilitySupport: event.target.checked })
                  }
                />
                <span>I want accessibility support settings as part of my setup.</span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(profile.wantsAccessArrangementHelp)}
                  onChange={(event) =>
                    setProfile({ ...profile, wantsAccessArrangementHelp: event.target.checked })
                  }
                />
                <span>I may need exam access arrangement help (extra time, reader, rest breaks, etc.).</span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(profile.sendSupportPathVisible)}
                  onChange={(event) =>
                    setProfile({ ...profile, sendSupportPathVisible: event.target.checked })
                  }
                />
                <span>Show SEND and support-path signposting during my first weeks on the platform.</span>
              </label>
              <p className="text-sm text-stone-600">
                Support remains signposting-first. The platform does not provide counselling or AI wellbeing support.
              </p>
            </div>
          ) : null}

          {stepIndex === 5 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Optional guardian invite</h2>
              <p className="text-sm text-stone-600">
                School-age learners can invite a parent or guardian to stay informed. This is optional during MVP.
              </p>
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Guardian email (optional)</span>
                <input
                  className="w-full border border-stone-300 px-3 py-2"
                  type="email"
                  value={profile.guardianInviteEmail ?? ""}
                  onChange={(event) =>
                    setProfile({ ...profile, guardianInviteEmail: event.target.value })
                  }
                  placeholder="parent@example.com"
                />
              </label>
            </div>
          ) : null}

          {stepIndex === 6 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Age or consent confirmation</h2>
              <p className="text-sm text-stone-600">
                Confirm that you are old enough to use the platform, or that a parent, guardian, or teacher has
                agreed to this setup.
              </p>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(profile.ageOrConsentConfirmed)}
                  onChange={(event) =>
                    setProfile({ ...profile, ageOrConsentConfirmed: event.target.checked })
                  }
                />
                <span>I confirm age or consent for this account setup.</span>
              </label>
            </div>
          ) : null}

          {stepIndex >= 7 ? (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Ready to open your dashboard</h2>
              <p className="text-sm text-stone-600">
                Your first dashboard will use the subjects, qualification route, and support choices captured here.
              </p>
            </div>
          ) : null}
        </section>

        <div className="flex flex-wrap gap-3">
          {stepIndex > 0 ? (
            <button
              type="button"
              className="border border-stone-300 bg-white px-4 py-2 text-sm font-medium"
              disabled={isSaving}
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              Back
            </button>
          ) : null}
          {stepIndex < 6 ? (
            <button
              type="button"
              className="border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-medium text-white"
              disabled={isSaving}
              onClick={() => void persistStep(profile, stepIndex + 1)}
            >
              {isSaving ? "Saving..." : "Continue"}
            </button>
          ) : null}
          {stepIndex === 6 ? (
            <button
              type="button"
              className="border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-medium text-white"
              disabled={isSaving}
              onClick={() => void persistStep(profile, 7, true)}
            >
              {isSaving ? "Finishing..." : "Finish setup and open dashboard"}
            </button>
          ) : null}
          <Link className="border border-stone-300 bg-white px-4 py-2 text-sm" href="/account">
            Account
          </Link>
        </div>
      </div>
    </main>
  );
}
