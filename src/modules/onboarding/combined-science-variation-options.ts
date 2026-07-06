import type { ExamBoard } from "@/modules/access-arrangements";

import type {
  CombinedScienceVariation,
  LearnerOnboardingProfile,
  OnboardingCombinedScienceVariationOption,
} from "./types";

const COMBINED_SCIENCE_SUBJECT_ID = "gcse-combined-science";

const VARIATION_OPTIONS: OnboardingCombinedScienceVariationOption[] = [
  {
    id: "aqa-combined-science-trilogy",
    label: "AQA Combined Science: Trilogy",
    description: "The live AQA combined-science route currently supported in The Switch.",
    examBoard: "AQA",
  },
  {
    id: "edexcel-gcse-combined-science",
    label: "Pearson Edexcel GCSE Combined Science",
    description: "The live Pearson Edexcel combined-science route currently supported in The Switch.",
    examBoard: "Edexcel",
  },
];

export function listCombinedScienceVariationOptions(
  examBoard: ExamBoard | undefined,
): OnboardingCombinedScienceVariationOption[] {
  if (!examBoard) {
    return [];
  }

  return VARIATION_OPTIONS.filter((option) => option.examBoard === examBoard);
}

export function hasCombinedScienceSelection(
  selectedSubjectIds: string[] | undefined,
): boolean {
  return Boolean(selectedSubjectIds?.includes(COMBINED_SCIENCE_SUBJECT_ID));
}

export function getDefaultCombinedScienceVariation(
  examBoard: ExamBoard | undefined,
): CombinedScienceVariation | undefined {
  return listCombinedScienceVariationOptions(examBoard)[0]?.id;
}

export function resolveCombinedScienceVariationForProfile(
  profile: Pick<LearnerOnboardingProfile, "examBoard" | "combinedScienceVariation" | "selectedSubjectIds">,
): CombinedScienceVariation | undefined {
  if (!hasCombinedScienceSelection(profile.selectedSubjectIds)) {
    return undefined;
  }

  const allowed = listCombinedScienceVariationOptions(profile.examBoard);

  if (
    profile.combinedScienceVariation &&
    allowed.some((option) => option.id === profile.combinedScienceVariation)
  ) {
    return profile.combinedScienceVariation;
  }

  return getDefaultCombinedScienceVariation(profile.examBoard);
}

export function getCombinedScienceVariationLabel(
  variation: CombinedScienceVariation | undefined,
): string | null {
  return VARIATION_OPTIONS.find((option) => option.id === variation)?.label ?? null;
}
