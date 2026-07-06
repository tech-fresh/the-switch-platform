import type {
  ScienceAwardType,
  SubjectLibraryLearningObjective,
  SubjectLibrarySeed,
  SubjectLibrarySubtopic,
  SubjectLibraryTopicSeed,
  SubjectLibraryValidationResult,
} from "./types";

const REQUIRED_SCIENCE_AWARD_TYPES: ScienceAwardType[] = [
  "combined_science",
  "separate_biology",
  "separate_chemistry",
  "separate_physics",
  "shared_science_content",
  "combined_only",
  "triple_only",
];

export function validateSubjectLibrarySeed(
  seed: SubjectLibrarySeed,
  subtopics: SubjectLibrarySubtopic[],
  learningObjectives: SubjectLibraryLearningObjective[],
): SubjectLibraryValidationResult {
  const errors: string[] = [];

  assertUniqueIds("subject", seed.subjects.map((subject) => subject.subjectId), errors);
  assertUniqueIds("topic", seed.topics.map((topic) => topic.topicId), errors);
  assertUniqueIds("subtopic", subtopics.map((subtopic) => subtopic.subtopicId), errors);
  assertUniqueIds(
    "learning objective",
    learningObjectives.map((objective) => objective.id),
    errors,
  );

  for (const qualification of seed.qualifications) {
    if (!qualification.qualificationRoute) {
      errors.push("Qualification route is missing from a qualification definition.");
    }

    if (qualification.supportedExamBoards.length === 0) {
      errors.push(
        `Qualification ${qualification.label} must declare at least one supported exam board.`,
      );
    }
  }

  for (const subject of seed.subjects) {
    if (!subject.subjectId.trim()) {
      errors.push("Subject ID is missing.");
    }

    if (subject.examBoards.length === 0) {
      errors.push(`Subject ${subject.name} must declare at least one exam board.`);
    }

    if (subject.isScience && subject.scienceAwardTypes.length === 0) {
      errors.push(`Science subject ${subject.subjectId} must declare science award types.`);
    }

    if (!subject.sourceTitleTemplate.includes("{board}")) {
      errors.push(
        `Subject ${subject.subjectId} must provide a source title template containing {board}.`,
      );
    }
  }

  for (const topic of seed.topics) {
    validateTopicSeed(topic, errors);
  }

  for (const subtopic of subtopics) {
    if (!subtopic.subjectId.trim()) {
      errors.push(`Subtopic ${subtopic.subtopicId} is missing a subject ID.`);
    }

    if (!subtopic.topicId.trim()) {
      errors.push(`Subtopic ${subtopic.subtopicId} is missing a topic ID.`);
    }
  }

  for (const objective of learningObjectives) {
    validateLearningObjective(objective, errors);
  }

  for (const subject of seed.subjects.filter((item) => item.studentVisible && !item.futureOnly)) {
    for (const examBoard of subject.examBoards.filter((board) =>
      ["AQA", "Edexcel", "Cambridge IGCSE"].includes(board),
    )) {
      const coverage = learningObjectives.filter(
        (objective) => objective.subjectId === subject.subjectId && objective.examBoard === examBoard,
      );

      if (coverage.length === 0) {
        errors.push(
          `Student-visible subject ${subject.subjectId} is missing imported specification coverage for ${examBoard}.`,
        );
      }
    }
  }

  for (const awardType of REQUIRED_SCIENCE_AWARD_TYPES) {
    if (!seed.scienceAwardTypes.includes(awardType)) {
      errors.push(`Science award type ${awardType} is missing from the library seed.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    counts: {
      qualifications: seed.qualifications.length,
      subjects: seed.subjects.length,
      topics: seed.topics.length,
      subtopics: subtopics.length,
      learningObjectives: learningObjectives.length,
    },
  };
}

function validateTopicSeed(topic: SubjectLibraryTopicSeed, errors: string[]) {
  if (!topic.topicId.trim()) {
    errors.push("Topic ID is missing.");
  }

  if (!topic.subjectId.trim()) {
    errors.push(`Topic ${topic.topicId || "<unknown>"} is missing a subject ID.`);
  }
}

function validateLearningObjective(
  objective: SubjectLibraryLearningObjective,
  errors: string[],
) {
  if (!objective.id.trim()) {
    errors.push("Learning objective ID is missing.");
  }

  if (!objective.subjectId.trim()) {
    errors.push(`Learning objective ${objective.id || "<unknown>"} is missing a subject ID.`);
  }

  if (!objective.topicId.trim()) {
    errors.push(`Learning objective ${objective.id || "<unknown>"} is missing a topic ID.`);
  }

  if (!objective.subtopicId.trim()) {
    errors.push(`Learning objective ${objective.id || "<unknown>"} is missing a subtopic ID.`);
  }

  if (!objective.examBoard) {
    errors.push(`Learning objective ${objective.id || "<unknown>"} is missing an exam board.`);
  }

  if (!objective.qualificationRoute) {
    errors.push(
      `Learning objective ${objective.id || "<unknown>"} is missing a qualification route.`,
    );
  }

  if (objective.subjectId.includes("science") || objective.subjectId.includes("biology") || objective.subjectId.includes("chemistry") || objective.subjectId.includes("physics")) {
    if (!objective.awardType) {
      errors.push(
        `Science learning objective ${objective.id || "<unknown>"} is missing a science award type.`,
      );
    }
  }

  if (!objective.specificationReference.trim()) {
    errors.push(
      `Learning objective ${objective.id || "<unknown>"} is missing a specification reference.`,
    );
  }

  if (!objective.sourceAttribution.trim()) {
    errors.push(
      `Learning objective ${objective.id || "<unknown>"} is missing source attribution.`,
    );
  }

  if (!objective.contentStatus.trim()) {
    errors.push(
      `Learning objective ${objective.id || "<unknown>"} is missing content status.`,
    );
  }

  if (
    objective.studentVisible &&
    (objective.contentStatus === "official-spec-import-required" || objective.qaStatus !== "reviewed")
  ) {
    errors.push(
      `Student-visible learning objective ${objective.id} must be fully imported and reviewed.`,
    );
  }

  if (
    objective.subjectId === "gcse-combined-science" &&
    objective.awardType &&
    objective.awardType.startsWith("separate_")
  ) {
    errors.push(
      `Combined Science objective ${objective.id} cannot use a separate science award type.`,
    );
  }

  if (
    ["gcse-biology", "gcse-chemistry", "gcse-physics"].includes(objective.subjectId) &&
    objective.awardType === "combined_science"
  ) {
    errors.push(
      `Separate science objective ${objective.id} cannot use the combined science award type.`,
    );
  }
}

function assertUniqueIds(kind: string, ids: string[], errors: string[]) {
  const seen = new Set<string>();

  for (const id of ids) {
    if (!id.trim()) {
      continue;
    }

    if (seen.has(id)) {
      errors.push(`Duplicate ${kind} ID found: ${id}`);
      continue;
    }

    seen.add(id);
  }
}
