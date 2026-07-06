import assert from "node:assert/strict";
import test from "node:test";

import {
  getLearningObjectiveById,
  getSubjectById,
  listCombinedScienceObjectives,
  listExamBoards,
  listLearningObjectives,
  listQualifications,
  listScienceAwardTypes,
  listSeparateScienceObjectives,
  listSubjects,
  listSubtopicsByTopic,
  listTopicsBySubject,
  validateSubjectLibrary,
} from "../src/modules/specification-engine/service.ts";

test("subject library exposes live qualifications and future expansion routes", () => {
  const qualifications = listQualifications();

  assert.equal(qualifications.length, 4);
  assert.ok(qualifications.some((qualification) => qualification.qualificationRoute === "gcse-england"));
  assert.ok(qualifications.some((qualification) => qualification.qualificationRoute === "igcse"));
  assert.deepEqual(listExamBoards("gcse-england"), ["AQA", "Edexcel", "OCR", "Eduqas", "WJEC", "CCEA"]);
});

test("subject listing keeps future separate sciences hidden by default", () => {
  const visibleSubjects = listSubjects({ studentVisibleOnly: true });

  assert.deepEqual(
    visibleSubjects.map((subject) => subject.subjectId),
    ["gcse-maths", "gcse-english-language", "gcse-combined-science", "igcse-maths"],
  );

  const allSubjects = listSubjects({ includeFuture: true });
  assert.ok(allSubjects.some((subject) => subject.subjectId === "gcse-biology"));
  assert.equal(getSubjectById("gcse-biology").studentVisible, false);
});

test("topic and subtopic lookup works for MVP subjects", () => {
  const topics = listTopicsBySubject("gcse-combined-science", {
    examBoard: "AQA",
    studentVisibleOnly: true,
  });

  assert.ok(topics.length >= 20);
  assert.ok(topics.some((topic) => topic.name === "Cell biology"));

  const subtopics = listSubtopicsByTopic("gcse-combined-science-cell-biology", {
    examBoard: "AQA",
    studentVisibleOnly: true,
  });

  assert.equal(subtopics.length, 1);
  assert.equal(subtopics[0]?.name, "Cell biology specification map");
});

test("combined and separate science objectives stay on distinct routes", () => {
  const combinedObjectives = listCombinedScienceObjectives({
    examBoard: "AQA",
    includeFuture: true,
  });
  const separateObjectives = listSeparateScienceObjectives({
    examBoard: "AQA",
  });

  assert.ok(combinedObjectives.length > 0);
  assert.ok(separateObjectives.length > 0);
  assert.ok(combinedObjectives.every((objective) => objective.subjectId === "gcse-combined-science"));
  assert.ok(
    separateObjectives.every((objective) =>
      ["gcse-biology", "gcse-chemistry", "gcse-physics"].includes(objective.subjectId),
    ),
  );
  assert.ok(
    separateObjectives.some((objective) => objective.pathwayTags.includes("triple_only")),
  );
});

test("learning objectives stay filtered to onboarding-compatible choices", () => {
  const aqaCombined = listLearningObjectives({
    qualificationRoute: "gcse-england",
    examBoard: "AQA",
    subjectId: "gcse-combined-science",
    studentVisibleOnly: true,
  });

  assert.ok(aqaCombined.length > 0);
  assert.ok(aqaCombined.every((objective) => objective.examBoard === "AQA"));
  assert.ok(aqaCombined.every((objective) => objective.subjectId === "gcse-combined-science"));

  const objective = getLearningObjectiveById(aqaCombined[0].id);
  assert.match(objective.sourceAttribution, /AQA GCSE Combined Science: Trilogy/i);
  assert.equal(objective.contentStatus, "reviewed");
  assert.equal(objective.qaStatus, "reviewed");
  assert.doesNotMatch(objective.learningObjective, /before student release/i);
});

test("science award types and validation cover future combined/triple expansion", () => {
  assert.deepEqual(listScienceAwardTypes(), [
    "combined_science",
    "separate_biology",
    "separate_chemistry",
    "separate_physics",
    "shared_science_content",
    "combined_only",
    "triple_only",
  ]);

  const validation = validateSubjectLibrary();
  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
  assert.ok(validation.counts.learningObjectives > 110);
});
