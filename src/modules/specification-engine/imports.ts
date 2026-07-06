import type { ExamBoard } from "@/modules/access-arrangements";
import type { ContentReviewStatus } from "@/modules/content/types";

import type {
  ScienceAwardType,
  SubjectLibraryContentStatus,
  SubjectLibraryLearningObjective,
  SubjectLibraryQualification,
  SubjectLibrarySeed,
  SubjectLibrarySubject,
  SubjectLibrarySubtopic,
  SubjectLibraryTopicSeed,
} from "./types";

interface ImportedSpecificationSource {
  subjectId: string;
  examBoard: ExamBoard;
  specificationVersion: string;
  sourceAttribution: string;
  referencePrefix: string;
  assessmentObjective: string;
  contentStatus: SubjectLibraryContentStatus;
  qaStatus: ContentReviewStatus;
  lastReviewedAt: string;
  objectiveTemplate: (topicName: string) => string;
}

const IMPORTED_SOURCES: ImportedSpecificationSource[] = [
  {
    subjectId: "gcse-maths",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE Mathematics (8300) specification, 2026 update",
    sourceAttribution: "AQA GCSE Mathematics (8300) Specification, section 3 Subject content",
    referencePrefix: "8300:3",
    assessmentObjective: "AO1 Use and apply standard techniques; AO2 Reason, interpret and communicate mathematically; AO3 Solve problems within mathematics and in other contexts.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Secure and apply the ${topicName} content required by AQA GCSE Mathematics across fluency, reasoning, and problem solving.`,
  },
  {
    subjectId: "gcse-maths",
    examBoard: "Edexcel",
    specificationVersion: "Pearson Edexcel GCSE (9-1) Mathematics (1MA1) specification, Issue 5",
    sourceAttribution: "Pearson Edexcel GCSE (9-1) Mathematics (1MA1) Specification, subject content",
    referencePrefix: "1MA1:content",
    assessmentObjective: "AO1 Use and apply standard techniques; AO2 Reason, interpret and communicate mathematically; AO3 Solve problems within mathematics and in other contexts.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Use the Pearson Edexcel GCSE Mathematics specification content for ${topicName} in procedural accuracy, reasoning, and problem-solving contexts.`,
  },
  {
    subjectId: "gcse-english-language",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE English Language (8700) specification, 20 March 2026 PDF",
    sourceAttribution: "AQA GCSE English Language (8700) Specification, section 3 Subject content and section 4 Scheme of assessment",
    referencePrefix: "8700:3-4",
    assessmentObjective: "AO1 identify and interpret explicit and implicit information; AO2 explain, comment on and analyse language and structure; AO3 compare writers' ideas and perspectives; AO4 evaluate texts critically; AO5 communicate clearly and imaginatively; AO6 use accurate vocabulary, sentence structures, spelling and punctuation.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Develop the reading and writing skill set for ${topicName} set out in the AQA GCSE English Language specification.`,
  },
  {
    subjectId: "gcse-english-language",
    examBoard: "Edexcel",
    specificationVersion: "Pearson Edexcel GCSE (9-1) English Language A (1EN0) specification, Issue 7",
    sourceAttribution: "Pearson Edexcel GCSE (9-1) English Language A (1EN0) Specification, subject content and assessment objectives",
    referencePrefix: "1EN0:content",
    assessmentObjective: "AO1 identify and interpret information; AO2 analyse language, form and structure; AO3 compare writers' ideas and perspectives; AO4 evaluate texts; AO5 communicate effectively for different purposes and audiences; AO6 use a range of vocabulary and sentence structures with accurate spelling and punctuation.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Build the Pearson Edexcel English Language A knowledge and response habits required for ${topicName}.`,
  },
  {
    subjectId: "gcse-combined-science",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE Combined Science: Trilogy (8464) specification, 2026 update",
    sourceAttribution: "AQA GCSE Combined Science: Trilogy (8464) Specification, Biology/Chemistry/Physics subject content and required practicals",
    referencePrefix: "8464:content",
    assessmentObjective: "AO1 demonstrate knowledge and understanding of scientific ideas; AO2 apply knowledge and understanding; AO3 analyse information and evaluate evidence, methods and procedures.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Secure the Combined Science: Trilogy content for ${topicName} across knowledge, application, practical method, and evidence evaluation.`,
  },
  {
    subjectId: "gcse-combined-science",
    examBoard: "Edexcel",
    specificationVersion: "Pearson Edexcel GCSE (9-1) Combined Science (1SC0) specification, Issue 6",
    sourceAttribution: "Pearson Edexcel GCSE (9-1) Combined Science (1SC0) Specification, Biology/Chemistry/Physics content overview",
    referencePrefix: "1SC0:content",
    assessmentObjective: "AO1 demonstrate knowledge and understanding of scientific ideas; AO2 apply knowledge and understanding; AO3 analyse information and evaluate evidence, methods and procedures.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Cover the Pearson Edexcel Combined Science content for ${topicName} with the required balance of knowledge, application, and evaluation.`,
  },
  {
    subjectId: "igcse-maths",
    examBoard: "Cambridge IGCSE",
    specificationVersion: "Cambridge IGCSE Mathematics (0580) syllabus for examination in 2025, 2026 and 2027",
    sourceAttribution: "Cambridge IGCSE Mathematics (0580) syllabus, subject content and assessment objectives",
    referencePrefix: "0580:content",
    assessmentObjective: "AO1 recall, select and use knowledge, facts, concepts and techniques; AO2 communicate, reason and interpret mathematically; AO3 solve problems in mathematical and real-life contexts.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Apply the Cambridge IGCSE Mathematics syllabus content for ${topicName} in routine and non-routine problem solving.`,
  },
  {
    subjectId: "gcse-biology",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE Biology (8461) specification, 2026 update",
    sourceAttribution: "AQA GCSE Biology (8461) Specification, subject content and required practicals",
    referencePrefix: "8461:content",
    assessmentObjective: "AO1 demonstrate knowledge and understanding of scientific ideas; AO2 apply knowledge and understanding; AO3 analyse information and evaluate evidence, methods and procedures.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Develop the separate Biology specification content for ${topicName}, including application and required practical expectations.`,
  },
  {
    subjectId: "gcse-chemistry",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE Chemistry (8462) specification, 2026 update",
    sourceAttribution: "AQA GCSE Chemistry (8462) Specification, subject content and required practicals",
    referencePrefix: "8462:content",
    assessmentObjective: "AO1 demonstrate knowledge and understanding of scientific ideas; AO2 apply knowledge and understanding; AO3 analyse information and evaluate evidence, methods and procedures.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Develop the separate Chemistry specification content for ${topicName}, including application and required practical expectations.`,
  },
  {
    subjectId: "gcse-physics",
    examBoard: "AQA",
    specificationVersion: "AQA GCSE Physics (8463) specification, 2026 update",
    sourceAttribution: "AQA GCSE Physics (8463) Specification, subject content and required practicals",
    referencePrefix: "8463:content",
    assessmentObjective: "AO1 demonstrate knowledge and understanding of scientific ideas; AO2 apply knowledge and understanding; AO3 analyse information and evaluate evidence, methods and procedures.",
    contentStatus: "reviewed",
    qaStatus: "reviewed",
    lastReviewedAt: "2026-07-01T12:30:00.000Z",
    objectiveTemplate: (topicName) =>
      `Develop the separate Physics specification content for ${topicName}, including application and required practical expectations.`,
  },
];

export function buildImportedLearningObjectives(
  seed: SubjectLibrarySeed,
  subtopics: SubjectLibrarySubtopic[],
): SubjectLibraryLearningObjective[] {
  return IMPORTED_SOURCES.flatMap((source) => {
    const subject = seed.subjects.find((item) => item.subjectId === source.subjectId);

    if (!subject) {
      return [];
    }

    const qualification = seed.qualifications.find(
      (item) => item.qualificationRoute === subject.qualificationRoute,
    );

    if (!qualification) {
      return [];
    }

    return seed.topics
      .filter((topic) => topic.subjectId === subject.subjectId)
      .map((topic) => {
        const subtopic = subtopics.find((item) => item.topicId === topic.topicId);

        if (!subtopic) {
          throw new Error(`Missing generated subtopic for ${topic.topicId}`);
        }

        const awardType = subject.isScience
          ? resolvePrimaryScienceAwardType(subject.subjectId)
          : null;
        const pathwayTags = subject.isScience
          ? resolveSciencePathwayTags(subject.subjectId, topic.pathwayTags ?? [])
          : [];

        return {
          id: `${subject.subjectId}--${slugify(source.examBoard)}--${topic.topicId}--${subtopic.subtopicId}`,
          qualificationRoute: subject.qualificationRoute,
          examBoard: source.examBoard,
          qualificationType: subject.qualificationType,
          subject: subject.name,
          subjectId: subject.subjectId,
          awardType,
          pathwayTags,
          paper: topic.paper,
          tier: topic.tier,
          topic: topic.name,
          topicId: topic.topicId,
          subtopic: subtopic.name,
          subtopicId: subtopic.subtopicId,
          learningObjective: source.objectiveTemplate(topic.name),
          specificationReference: `${source.referencePrefix}:${topic.topicId}`,
          assessmentObjective: topic.assessmentObjective.includes("Board-specific")
            ? source.assessmentObjective
            : topic.assessmentObjective,
          commandWords: [...topic.commandWords],
          sourceAttribution: source.sourceAttribution,
          specificationVersion: source.specificationVersion,
          contentStatus: source.contentStatus,
          qaStatus: source.qaStatus,
          lastReviewedAt: source.lastReviewedAt,
          studentVisible: subject.studentVisible && !subject.futureOnly,
        };
      });
  });
}

export function listImportedSubjectBoards(): Array<{
  subjectId: string;
  examBoard: ExamBoard;
}> {
  return IMPORTED_SOURCES.map((source) => ({
    subjectId: source.subjectId,
    examBoard: source.examBoard,
  }));
}

function resolvePrimaryScienceAwardType(subjectId: string): ScienceAwardType {
  switch (subjectId) {
    case "gcse-combined-science":
      return "combined_science";
    case "gcse-biology":
      return "separate_biology";
    case "gcse-chemistry":
      return "separate_chemistry";
    case "gcse-physics":
      return "separate_physics";
    default:
      return "shared_science_content";
  }
}

function resolveSciencePathwayTags(
  subjectId: string,
  topicPathwayTags: ScienceAwardType[],
): ScienceAwardType[] {
  const tags = new Set<ScienceAwardType>(topicPathwayTags);

  if (subjectId === "gcse-combined-science") {
    tags.add("combined_science");
  }

  if (subjectId === "gcse-biology") {
    tags.add("separate_biology");
    tags.add("triple_only");
  }

  if (subjectId === "gcse-chemistry") {
    tags.add("separate_chemistry");
    tags.add("triple_only");
  }

  if (subjectId === "gcse-physics") {
    tags.add("separate_physics");
    tags.add("triple_only");
  }

  if (tags.size === 0) {
    tags.add("shared_science_content");
  }

  return [...tags];
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
