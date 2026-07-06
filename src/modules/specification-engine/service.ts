import subjectLibrarySeedJson from "@/data/subjects/mvp-subject-library.json";
import type { ExamBoard } from "@/modules/access-arrangements";

import { buildImportedLearningObjectives, listImportedSubjectBoards } from "./imports";
import type {
  ScienceAwardType,
  SubjectLibraryFilters,
  SubjectLibraryLearningObjective,
  SubjectLibraryQualification,
  SubjectLibrarySeed,
  SubjectLibrarySubject,
  SubjectLibrarySubtopic,
  SubjectLibraryTopicSeed,
  SubjectLibraryValidationResult,
} from "./types";
import { validateSubjectLibrarySeed } from "./validators";

const subjectLibrarySeed = subjectLibrarySeedJson as SubjectLibrarySeed;

const subtopics = buildSubtopics(subjectLibrarySeed.topics);
const learningObjectives = buildImportedLearningObjectives(subjectLibrarySeed, subtopics);

export function listQualifications(): SubjectLibraryQualification[] {
  return subjectLibrarySeed.qualifications.map((qualification) => ({ ...qualification }));
}

export function listExamBoards(
  qualificationRoute?: SubjectLibraryQualification["qualificationRoute"],
): ExamBoard[] {
  if (!qualificationRoute) {
    return unique(subjectLibrarySeed.qualifications.flatMap((qualification) => qualification.supportedExamBoards));
  }

  return (
    subjectLibrarySeed.qualifications.find(
      (qualification) => qualification.qualificationRoute === qualificationRoute,
    )?.supportedExamBoards ?? []
  ).slice();
}

export function listSubjects(filters: SubjectLibraryFilters = {}): SubjectLibrarySubject[] {
  return subjectLibrarySeed.subjects
    .filter((subject) => matchesSubjectFilters(subject, filters))
    .map((subject) => ({ ...subject, examBoards: [...subject.examBoards], scienceAwardTypes: [...subject.scienceAwardTypes] }));
}

export function getSubjectById(subjectId: string): SubjectLibrarySubject {
  const subject = subjectLibrarySeed.subjects.find((item) => item.subjectId === subjectId);

  if (!subject) {
    throw new Error(`Unknown subject library subject: ${subjectId}`);
  }

  return {
    ...subject,
    examBoards: [...subject.examBoards],
    scienceAwardTypes: [...subject.scienceAwardTypes],
  };
}

export function listTopicsBySubject(
  subjectId: string,
  filters: Omit<SubjectLibraryFilters, "subjectId"> = {},
): SubjectLibraryTopicSeed[] {
  const objectives = listLearningObjectives({ ...filters, subjectId });
  const topicIds = new Set(objectives.map((objective) => objective.topicId));

  return subjectLibrarySeed.topics
    .filter((topic) => topic.subjectId === subjectId && topicIds.has(topic.topicId))
    .map((topic) => ({ ...topic, commandWords: [...topic.commandWords], pathwayTags: [...(topic.pathwayTags ?? [])] }));
}

export function listSubtopicsByTopic(
  topicId: string,
  filters: Omit<SubjectLibraryFilters, "subjectId"> = {},
): SubjectLibrarySubtopic[] {
  const objectives = listLearningObjectives(filters);
  const visibleSubtopicIds = new Set(
    objectives.filter((objective) => objective.topicId === topicId).map((objective) => objective.subtopicId),
  );

  return subtopics
    .filter((subtopic) => subtopic.topicId === topicId && visibleSubtopicIds.has(subtopic.subtopicId))
    .map((subtopic) => ({ ...subtopic }));
}

export function listLearningObjectives(
  filters: SubjectLibraryFilters = {},
): SubjectLibraryLearningObjective[] {
  return learningObjectives
    .filter((objective) => matchesLearningObjectiveFilters(objective, filters))
    .map((objective) => ({
      ...objective,
      commandWords: [...objective.commandWords],
      pathwayTags: [...objective.pathwayTags],
    }));
}

export function getLearningObjectiveById(
  id: string,
): SubjectLibraryLearningObjective {
  const objective = learningObjectives.find((item) => item.id === id);

  if (!objective) {
    throw new Error(`Unknown specification learning objective: ${id}`);
  }

  return {
    ...objective,
    commandWords: [...objective.commandWords],
    pathwayTags: [...objective.pathwayTags],
  };
}

export function listScienceAwardTypes(): ScienceAwardType[] {
  return [...subjectLibrarySeed.scienceAwardTypes];
}

export function listCombinedScienceObjectives(
  filters: Omit<SubjectLibraryFilters, "awardType" | "pathwayTag"> = {},
): SubjectLibraryLearningObjective[] {
  return listLearningObjectives({
    ...filters,
    pathwayTag: "combined_science",
  });
}

export function listSeparateScienceObjectives(
  filters: Omit<SubjectLibraryFilters, "awardType" | "pathwayTag"> = {},
): SubjectLibraryLearningObjective[] {
  return listLearningObjectives({
    ...filters,
    includeFuture: true,
  }).filter((objective) =>
    ["gcse-biology", "gcse-chemistry", "gcse-physics"].includes(objective.subjectId),
  );
}

export function validateSubjectLibrary(): SubjectLibraryValidationResult {
  return validateSubjectLibrarySeed(subjectLibrarySeed, subtopics, learningObjectives);
}

function buildSubtopics(topics: SubjectLibraryTopicSeed[]): SubjectLibrarySubtopic[] {
  return topics.map((topic) => ({
    subtopicId: `${topic.topicId}--specification-map`,
    topicId: topic.topicId,
    subjectId: topic.subjectId,
    name: `${topic.name} specification map`,
  }));
}

function matchesSubjectFilters(
  subject: SubjectLibrarySubject,
  filters: SubjectLibraryFilters,
): boolean {
  if (filters.subjectId && subject.subjectId !== filters.subjectId) {
    return false;
  }

  if (filters.qualificationRoute && subject.qualificationRoute !== filters.qualificationRoute) {
    return false;
  }

  if (filters.qualificationType && subject.qualificationType !== filters.qualificationType) {
    return false;
  }

  if (filters.examBoard && !subject.examBoards.includes(filters.examBoard)) {
    return false;
  }

  if (filters.examBoard) {
    const importedSubjectBoards = new Set(
      listImportedSubjectBoards().map((entry) => `${entry.subjectId}:${entry.examBoard}`),
    );

    if (!filters.includeFuture && !importedSubjectBoards.has(`${subject.subjectId}:${filters.examBoard}`)) {
      return false;
    }
  }

  if (filters.studentVisibleOnly && !subject.studentVisible) {
    return false;
  }

  if (!filters.includeFuture && subject.futureOnly) {
    return false;
  }

  if (filters.awardType && !subject.scienceAwardTypes.includes(filters.awardType)) {
    return false;
  }

  if (filters.pathwayTag && !subject.scienceAwardTypes.includes(filters.pathwayTag)) {
    return false;
  }

  return true;
}

function matchesLearningObjectiveFilters(
  objective: SubjectLibraryLearningObjective,
  filters: SubjectLibraryFilters,
): boolean {
  if (filters.qualificationRoute && objective.qualificationRoute !== filters.qualificationRoute) {
    return false;
  }

  if (filters.qualificationType && objective.qualificationType !== filters.qualificationType) {
    return false;
  }

  if (filters.examBoard && objective.examBoard !== filters.examBoard) {
    return false;
  }

  if (filters.subjectId && objective.subjectId !== filters.subjectId) {
    return false;
  }

  if (filters.studentVisibleOnly && !objective.studentVisible) {
    return false;
  }

  if (!filters.includeFuture) {
    const subject = getSubjectById(objective.subjectId);

    if (subject.futureOnly) {
      return false;
    }
  }

  if (filters.awardType && objective.awardType !== filters.awardType) {
    return false;
  }

  if (filters.pathwayTag && !objective.pathwayTags.includes(filters.pathwayTag)) {
    return false;
  }

  return true;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
