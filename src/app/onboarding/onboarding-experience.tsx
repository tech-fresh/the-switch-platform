"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  OnboardingBackButton,
  OnboardingContinueButton,
  OnboardingShell,
} from "@/components/onboarding/onboarding-shell";
import { mark32Ui } from "@/components/streamlined/mark32-ui";
import {
  getDefaultExamBoard,
  listOnboardingExamBoardOptions,
} from "@/modules/onboarding/exam-board-options";
import type { LearnerOnboardingProfile, OnboardingOverview, StudyGoal } from "@/modules/onboarding/types";

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

  const examBoardOptions = useMemo(
    () =>
      profile.qualificationPath
        ? listOnboardingExamBoardOptions(profile.qualificationPath)
        : [],
    [profile.qualificationPath],
  );

  const activeExamBoard =
    profile.examBoard && examBoardOptions.includes(profile.examBoard)
      ? profile.examBoard
      : profile.qualificationPath
        ? getDefaultExamBoard(profile.qualificationPath)
        : undefined;

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
        return Boolean(profile.yearGroup?.trim()) && Boolean(profile.studyGoal);
      case 3:
        return Boolean(profile.schoolName?.trim());
      case 4:
        return validSelectedSubjectIds.length > 0 && Boolean(activeExamBoard);
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
                        examBoard: getDefaultExamBoard(nextPath),
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
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {YEAR_PERSONAS.map((persona) => {
              const selected = profile.yearGroup === persona.yearGroup;
              return (
                <button
                  key={persona.yearGroup}
                  type="button"
                  onClick={() => setProfile({ ...profile, yearGroup: persona.yearGroup })}
                  className={`rounded-2xl border-2 bg-white p-6 text-center transition ${
                    selected ? "border-teal-500 shadow-md" : "border-transparent shadow-sm hover:border-stone-200"
                  }`}
                >
                  <span className="mx-auto mb-3 block text-4xl">{persona.emoji}</span>
                  <p className="text-sm text-stone-500">{learnerFirstName} the</p>
                  <p className="mt-1 text-base font-semibold text-stone-800">{persona.title}</p>
                  <p className="mt-2 text-xs text-stone-500">{persona.yearGroup}</p>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className={mark32Ui.eyebrow}>Your study goal</p>
            <div className="grid gap-3">
              {options.studyGoals.map((goal) => {
                const selected = profile.studyGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, studyGoal: goal.id as StudyGoal })}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      selected
                        ? "border-teal-400 bg-teal-50 ring-2 ring-teal-100"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-stone-900">{goal.label}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{goal.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
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
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-3">
            <p className={mark32Ui.eyebrow}>Your exam board</p>
            <p className="text-sm leading-6 text-stone-600">
              This sets which full papers and access-arrangement guidance you see on Exams.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {examBoardOptions.map((board) => {
                const selected = activeExamBoard === board;
                return (
                  <button
                    key={board}
                    type="button"
                    onClick={() => setProfile({ ...profile, examBoard: board })}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      selected
                        ? "border-teal-400 bg-teal-50 ring-2 ring-teal-100"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-stone-900">{board}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Full papers for this board unlock on `/exams` after setup.
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className={mark32Ui.eyebrow}>Your subjects</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {subjectsForQualification.map((subject) => {
                const selected = validSelectedSubjectIds.includes(subject.subjectId);
                return (
                  <label
                    key={subject.subjectId}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition ${
                      selected ? "border-teal-400 ring-2 ring-teal-100" : "border-stone-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4 shrink-0 rounded border-stone-300 text-teal-700"
                      checked={selected}
                      onChange={() => toggleSubject(subject.subjectId)}
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-stone-700">{subject.name}</span>
                      {subject.description ? (
                        <span className="mt-0.5 block text-xs leading-5 text-stone-500">
                          {subject.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xl">{SUBJECT_ICONS[subject.subjectId] ?? "📘"}</span>
                  </label>
                );
              })}
            </div>
          </div>
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
      <div className="mx-auto max-w-xl space-y-5">
        <section className={`${mark32Ui.card} space-y-3`}>
          <p className={mark32Ui.eyebrow}>Dashboard ready</p>
          <h2 className="text-lg font-semibold text-stone-950">Your Mission Control dashboard includes:</h2>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>
              {profile.yearGroup} · {qualificationLabel} · {activeExamBoard}
            </li>
            <li>
              {validSelectedSubjectIds.length} subject{validSelectedSubjectIds.length === 1 ? "" : "s"} on your
              study routes
            </li>
            <li>
              Study goal:{" "}
              {options.studyGoals.find((goal) => goal.id === profile.studyGoal)?.label ?? "Exam readiness"}
            </li>
            <li>Full papers on `/exams` matched to your board and subjects</li>
          </ul>
        </section>

        <div className={`${mark32Ui.cardMuted} text-sm leading-6 text-stone-700`}>
          After you confirm, we&apos;ll build your dashboard and unlock Exams, Subjects, and Progress with this setup.
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-stone-300 text-teal-700"
            checked={Boolean(profile.ageOrConsentConfirmed)}
            onChange={(event) =>
              setProfile({ ...profile, ageOrConsentConfirmed: event.target.checked })
            }
          />
          <span>
            I confirm that I am old enough to use The Switch, or that a parent, guardian, or teacher has agreed to
            this setup.
          </span>
        </label>
      </div>
    );
  })();

  const titles: Record<number, { title: ReactNode; subtitle?: ReactNode }> = {
    0: {
      title: "Who is creating this dashboard?",
      subtitle: "Every answer in this flow builds your personalised Mission Control dashboard.",
    },
    1: {
      title: "Choose your qualification route",
      subtitle:
        "MVP: GCSE (England) or iGCSE. Wales and Northern Ireland GCSE routes are coming later.",
    },
    2: {
      title: `Great to meet you, ${learnerFirstName}!`,
      subtitle: "Pick your year group and the study goal that should guide your dashboard.",
    },
    3: {
      title: "Add your secondary school",
      subtitle:
        "Choose your UK nation, open the official school finder, click your school there, then enter the school name here.",
    },
    4: {
      title: (
        <>
          Choose your <span className="text-teal-800">exam board</span> and{" "}
          <span className="text-teal-800">{qualificationLabel}</span> subjects
        </>
      ),
      subtitle:
        "Your board and subjects decide which full papers, revision routes, and progress signals appear after setup.",
    },
    5: {
      title: "Set up accessibility and support",
      subtitle:
        "Optional — these choices carry into Accessibility, access arrangements, and the Support Hub.",
    },
    6: {
      title: "Invite a parent or guardian",
      subtitle: "Optional during MVP — school-age learners can add a guardian email here.",
    },
    7: {
      title: "Your dashboard is ready to build",
      subtitle: "Confirm consent, then open Mission Control with Exams, Subjects, and Progress unlocked.",
    },
  };

  const currentTitle = titles[stepIndex] ?? titles[0];
  const continueLabel =
    stepIndex === 4
      ? "Save board & subjects"
      : stepIndex === 7
        ? "Open my dashboard"
        : "Continue";

  return (
    <OnboardingShell
      stepIndex={stepIndex}
      totalSteps={TOTAL_STEPS}
      stepLabels={options.dashboardCreationStepLabels}
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
                void persistStep(
                  {
                    ...profile,
                    examBoard: activeExamBoard,
                    studyGoal: profile.studyGoal ?? "exam-readiness",
                  },
                  8,
                  true,
                );
                return;
              }
              void persistStep(
                {
                  ...profile,
                  examBoard: stepIndex >= 4 ? activeExamBoard : profile.examBoard,
                  studyGoal: profile.studyGoal ?? "exam-readiness",
                },
                stepIndex + 1,
              );
            }}
          />
        </>
      }
    >
      {stepContent}
    </OnboardingShell>
  );
}
