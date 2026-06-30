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
];

const SCHOOL_NATION_LABELS: Record<string, string> = {
  england: "England",
  scotland: "Scotland",
  wales: "Wales",
  "northern-ireland": "Northern Ireland",
};

function catalogTypeForQualificationPath(
  qualificationPath: LearnerOnboardingProfile["qualificationPath"] | undefined,
): "GCSE" | "IGCSE" {
  return qualificationPath === "igcse" ? "IGCSE" : "GCSE";
}

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
  const activeSchoolNation = profile.schoolNation ?? "england";

  const qualificationLabel = useMemo(() => {
    const match = options.qualificationPaths.find((path) => path.id === profile.qualificationPath);
    return match?.label.replace("(England)", "").replace("(Wales)", "").trim() ?? "GCSE";
  }, [options.qualificationPaths, profile.qualificationPath]);

  const subjectsForQualification = useMemo(() => {
    const catalogType = catalogTypeForQualificationPath(profile.qualificationPath);
    return options.subjects.filter((subject) => subject.qualificationLabel === catalogType);
  }, [options.subjects, profile.qualificationPath]);

  const validSelectedSubjectIds = useMemo(
    () =>
      selectedSubjectIds.filter((subjectId) =>
        subjectsForQualification.some((subject) => subject.subjectId === subjectId),
      ),
    [selectedSubjectIds, subjectsForQualification],
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
        return validSelectedSubjectIds.length > 0;
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
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
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
                    onChange={() => {
                      const nextPath = path.id as LearnerOnboardingProfile["qualificationPath"];
                      const catalogType = catalogTypeForQualificationPath(nextPath);
                      const nextSelected = selectedSubjectIds.filter((subjectId) =>
                        options.subjects.find((subject) => subject.subjectId === subjectId)
                          ?.qualificationLabel === catalogType,
                      );
                      setProfile({
                        ...profile,
                        qualificationPath: nextPath,
                        selectedSubjectIds: nextSelected,
                      });
                    }}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-700">{path.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{path.description}</span>
                  </span>
                  <span className="text-xl">{QUALIFICATION_ICONS[path.id] ?? "📘"}</span>
                </label>
              );
            })}
          </div>
          {options.deferredQualificationPaths?.length ? (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Coming later
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.deferredQualificationPaths.map((path) => (
                  <div
                    key={path.id}
                    className="flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 opacity-80"
                    aria-disabled="true"
                  >
                    <span className="text-xl">{QUALIFICATION_ICONS[path.id] ?? "📘"}</span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">{path.label}</span>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          {path.statusNote}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{path.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
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
      const activeSchoolSources = options.schoolSources.filter((source) =>
        (options.mvpSchoolNations ?? ["england"]).includes(source.nation),
      );
      const selectedSchoolSource =
        activeSchoolSources.find((source) => source.nation === activeSchoolNation) ??
        activeSchoolSources[0];

      return (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-950">
            <p className="font-medium">Secondary school</p>
            <p className="mt-1 text-xs leading-5 text-sky-900/80">
              The Switch MVP is built for secondary learners studying GCSE or iGCSE. Primary and
              other school phases are planned for later.
            </p>
          </div>
          <div className="space-y-2">
            <span className="block text-sm font-medium text-slate-700">Where is your school?</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {(options.mvpSchoolNations ?? ["england"]).map((nation) => {
                const selected = activeSchoolNation === nation;
                return (
                  <button
                    key={nation}
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        schoolPhase: "secondary",
                        schoolNation: nation as LearnerOnboardingProfile["schoolNation"],
                      })
                    }
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-800">
                      {SCHOOL_NATION_LABELS[nation] ?? nation}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Use the official school finder for this nation.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Secondary school name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={profile.schoolName ?? ""}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  schoolPhase: "secondary",
                  schoolName: event.target.value,
                })
              }
              placeholder="e.g. Riverside Secondary School"
            />
          </label>
          <p className="text-xs leading-5 text-slate-500">
            School lookup now works across the UK. Qualification routes remain locked to GCSE
            (England) and iGCSE during the current MVP.
          </p>
          <div className="space-y-3 rounded-xl bg-sky-50 p-4 text-sm text-sky-950">
            <p className="font-medium">Find and click your school using official UK sources</p>
            {selectedSchoolSource ? (
              <a
                className="flex items-center justify-between rounded-2xl border border-sky-200 bg-white px-4 py-3 font-medium text-sky-900 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
                href={selectedSchoolSource.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  Open {SCHOOL_NATION_LABELS[selectedSchoolSource.nation]} school finder
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {activeSchoolSources.map((source) => {
                const selected = source.nation === activeSchoolNation;
                return (
                  <a
                    key={source.nation}
                    className={`rounded-2xl border px-4 py-3 transition ${
                      selected
                        ? "border-sky-300 bg-white shadow-sm"
                        : "border-sky-100 bg-sky-50/60 hover:border-sky-200 hover:bg-white"
                    }`}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="block text-sm font-semibold text-slate-800">
                      {SCHOOL_NATION_LABELS[source.nation]}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {source.label}
                    </span>
                  </a>
                );
              })}
            </div>
            <p className="text-xs leading-5 text-sky-900/80">
              Search on the official school finder, click your school there, then return here and
              enter the exact school name.
            </p>
          </div>
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {subjectsForQualification.map((subject) => {
            const selected = validSelectedSubjectIds.includes(subject.subjectId);
            return (
              <label
                key={subject.subjectId}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition ${
                  selected ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-sky-600"
                  checked={selected}
                  onChange={() => toggleSubject(subject.subjectId)}
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-slate-700">{subject.name}</span>
                  {subject.description ? (
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      {subject.description}
                    </span>
                  ) : null}
                </span>
                <span className="text-xl">{SUBJECT_ICONS[subject.subjectId] ?? "📘"}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 5) {
      return (
        <div className="mx-auto max-w-xl space-y-3">
          {options.supportChoices.map((choice) => (
            <label
              key={choice.key}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 shadow-sm transition ${
                Boolean(profile[choice.key])
                  ? "border-sky-400 ring-2 ring-sky-100"
                  : "border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-sky-600"
                checked={Boolean(profile[choice.key as keyof DraftProfile])}
                onChange={(event) =>
                  setProfile({ ...profile, [choice.key]: event.target.checked })
                }
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-800">{choice.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{choice.description}</span>
                <span className="mt-2 inline-block rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                  {choice.moduleLabel}
                </span>
              </span>
            </label>
          ))}
          <p className="text-xs text-slate-500">
            Optional — all three map to MVP modules: Accessibility, Access Arrangements foundation, and
            Support Hub. No complex SEND UI during MVP.
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
      subtitle:
        "MVP: GCSE (England) or iGCSE. Wales and Northern Ireland GCSE routes are coming later.",
    },
    2: {
      title: `Great to meet you, ${learnerFirstName}!`,
      subtitle: "Which profile matches your vibe? You can change this later.",
    },
    3: {
      title: "Which secondary school do you go to?",
      subtitle:
        "Choose your UK nation, open the official school finder, click your school there, then enter the school name here.",
    },
    4: {
      title: (
        <>
          Which <span className="text-sky-600">🎒 {qualificationLabel}</span> subjects are you studying?
        </>
      ),
      subtitle: "Pick the MVP subjects you are studying — Combined Science covers biology, chemistry, and physics.",
    },
    5: {
      title: "Accessibility, access arrangements, and SEND support",
      subtitle:
        "Optional MVP setup — links to Accessibility, Access Arrangements foundation, and Support Hub.",
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
