import { applyAccessArrangementsToExam } from "@/modules/access-arrangements";
import type { StudentAccessProfileRepository } from "@/modules/access-arrangements";
import { listSavedProgressByUser, saveExamProgress } from "@/modules/saved-progress/service";
import type { SavedProgressRecord, SavedProgressRepository } from "@/modules/saved-progress/types";
import { buildOperationsEvent, recordOperationsEvent } from "@/lib/server/operations-event";
import type {
  ExamPaper,
  ExamQuestion,
  ExamQuestionResponse,
  ExamSession,
  ExamSessionGenerationSummary,
} from "./types";

interface ExamPaperBlueprint extends Omit<ExamPaper, "questions"> {
  questionSlots: ExamQuestionSlot[];
}

interface ExamQuestionSlot {
  slotId: string;
  number: number;
  topic: string;
  marks: number;
  type: "multiple-choice";
  guidance?: string;
  variants: ExamQuestion[];
}

const mockExamPaperBlueprints: ExamPaperBlueprint[] = [
  {
    examId: "aqa-maths-higher-paper-1",
    title: "GCSE Mathematics",
    subject: "Mathematics",
    paperMode: "full-gcse",
    studentStage: "gcse",
    board: "AQA",
    qualificationType: "GCSE",
    tier: "HIGHER",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 90,
    totalMarks: 80,
    yearGroups: ["Year 11"],
    curriculumTags: ["Year 11 mock readiness", "Higher tier algebra", "GCSE paper fluency"],
    boardTopicCoverage: "Built around common Year 11 higher-tier maths coverage used in AQA GCSE paper sequences.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Algebra", "Ratio", "Coordinate Geometry"],
    studentContextSummary: "Full GCSE paper practice for students already working at GCSE paper level.",
    gcsePreparationSummary: "Use this paper once Year 10 progression work feels secure and the student is ready for full GCSE timing.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Algebra",
        marks: 2,
        type: "multiple-choice",
        guidance: "Show the expansion of each bracket before combining terms.",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 3(2x - 5) + 4(x + 1). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10x - 11" },
              { optionId: "b", label: "B", text: "6x - 1" },
              { optionId: "c", label: "C", text: "10x - 19" },
              { optionId: "d", label: "D", text: "7x - 11" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v1",
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 2(3x + 4) - (x - 5). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "5x + 9" },
              { optionId: "b", label: "B", text: "6x + 13" },
              { optionId: "c", label: "C", text: "5x + 13" },
              { optionId: "d", label: "D", text: "7x - 1" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v2",
          },
          {
            questionId: "q1-v3",
            number: 1,
            topic: "Algebra",
            prompt: "Expand and simplify: 5(x - 2) + 2(2x + 3). Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "9x - 4" },
              { optionId: "b", label: "B", text: "7x + 1" },
              { optionId: "c", label: "C", text: "9x - 10" },
              { optionId: "d", label: "D", text: "7x - 7" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q1-v3",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Ratio",
        marks: 3,
        type: "multiple-choice",
        guidance: "Convert the scaled distance into centimetres first, then into kilometres.",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Ratio",
            prompt:
              "A map uses a scale of 1:25,000. Two towns are 7.2 cm apart on the map. How many kilometres apart are they in real life?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "1.8 km" },
              { optionId: "b", label: "B", text: "18 km" },
              { optionId: "c", label: "C", text: "180 km" },
              { optionId: "d", label: "D", text: "0.18 km" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v1",
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Ratio",
            prompt:
              "A recipe uses the ratio 3:5 for flour to sugar. If 240 g of sugar is used, how much flour is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "90 g" },
              { optionId: "b", label: "B", text: "144 g" },
              { optionId: "c", label: "C", text: "160 g" },
              { optionId: "d", label: "D", text: "400 g" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v2",
          },
          {
            questionId: "q2-v3",
            number: 2,
            topic: "Ratio",
            prompt:
              "Blue paint and white paint are mixed in the ratio 4:7. If 28 litres of blue paint are used, how much white paint is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "35 litres" },
              { optionId: "b", label: "B", text: "42 litres" },
              { optionId: "c", label: "C", text: "49 litres" },
              { optionId: "d", label: "D", text: "56 litres" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q2-v3",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Coordinate Geometry",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point A is at (2, -1) and point B is at (8, 11). What is the midpoint of AB?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(5, 10)" },
              { optionId: "b", label: "B", text: "(6, 5)" },
              { optionId: "c", label: "C", text: "(5, 5)" },
              { optionId: "d", label: "D", text: "(10, 12)" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v1",
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point C is at (-4, 6) and point D is at (2, 10). What is the midpoint of CD?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(-1, 8)" },
              { optionId: "b", label: "B", text: "(-2, 16)" },
              { optionId: "c", label: "C", text: "(3, 4)" },
              { optionId: "d", label: "D", text: "(-6, 2)" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v2",
          },
          {
            questionId: "q3-v3",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "Point E is at (1, 3) and point F is at (9, -5). What is the midpoint of EF?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(8, -2)" },
              { optionId: "b", label: "B", text: "(4, -1)" },
              { optionId: "c", label: "C", text: "(5, -1)" },
              { optionId: "d", label: "D", text: "(10, -8)" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q3-v3",
          },
        ],
      },
      {
        slotId: "q4",
        number: 4,
        topic: "Functions",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q4-v1",
            number: 4,
            topic: "Functions",
            prompt: "The function f(x) = 2x + 3. Work out f(7). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10" },
              { optionId: "b", label: "B", text: "14" },
              { optionId: "c", label: "C", text: "17" },
              { optionId: "d", label: "D", text: "21" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v1",
          },
          {
            questionId: "q4-v2",
            number: 4,
            topic: "Functions",
            prompt: "The function g(x) = 3x - 4. Work out g(6). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "10" },
              { optionId: "b", label: "B", text: "14" },
              { optionId: "c", label: "C", text: "18" },
              { optionId: "d", label: "D", text: "22" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v2",
          },
          {
            questionId: "q4-v3",
            number: 4,
            topic: "Functions",
            prompt: "The function h(x) = x + 9. Work out h(5). Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "4" },
              { optionId: "b", label: "B", text: "9" },
              { optionId: "c", label: "C", text: "14" },
              { optionId: "d", label: "D", text: "45" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "aqa-maths-higher-paper-1-q4-v3",
          },
        ],
      },
    ],
  },
  {
    examId: "edexcel-english-paper-1",
    title: "GCSE English Language",
    subject: "English Language",
    paperMode: "full-gcse",
    studentStage: "gcse",
    board: "Edexcel",
    qualificationType: "GCSE",
    tier: "FOUNDATION",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 105,
    totalMarks: 64,
    yearGroups: ["Year 11"],
    curriculumTags: ["Year 11 mock readiness", "Foundation English analysis", "GCSE extract fluency"],
    boardTopicCoverage: "Built around shared Year 11 English Language extract analysis skills used across Edexcel GCSE paper expectations.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Inference", "Language Analysis", "Structure"],
    studentContextSummary: "Full GCSE paper practice for students already moving through full English Language paper timing and extract analysis.",
    gcsePreparationSummary: "Use this paper after Year 10 end-of-year preparation papers so GCSE extract and structure work feels familiar.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Inference",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the writer's view of the storm in the extract?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It is calming and familiar." },
              { optionId: "b", label: "B", text: "It feels sudden and dangerous." },
              { optionId: "c", label: "C", text: "It is exaggerated for humour." },
              { optionId: "d", label: "D", text: "It has already passed." },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v1",
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the narrator's view of the abandoned house?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels safe and welcoming." },
              { optionId: "b", label: "B", text: "It seems expensive but empty." },
              { optionId: "c", label: "C", text: "It appears unsettling and secretive." },
              { optionId: "d", label: "D", text: "It reminds them of school." },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v2",
          },
          {
            questionId: "q1-v3",
            number: 1,
            topic: "Inference",
            prompt: "Which statement best matches the writer's view of the market at noon?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels crowded and relentless." },
              { optionId: "b", label: "B", text: "It seems silent and empty." },
              { optionId: "c", label: "C", text: "It is presented as magical." },
              { optionId: "d", label: "D", text: "It has already closed." },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q1-v3",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Language Analysis",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the setting feels isolated?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"Cars hurried by in every lane.\"" },
              { optionId: "b", label: "B", text: "\"The single light blinked across the empty moor.\"" },
              { optionId: "c", label: "C", text: "\"Children shouted from the playground.\"" },
              { optionId: "d", label: "D", text: "\"Music spilled from the open door.\"" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v1",
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the character feels trapped?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"She danced into the square.\"" },
              { optionId: "b", label: "B", text: "\"The locked gate pressed cold against her hands.\"" },
              { optionId: "c", label: "C", text: "\"The sky widened above the field.\"" },
              { optionId: "d", label: "D", text: "\"Laughter rolled through the hall.\"" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v2",
          },
          {
            questionId: "q2-v3",
            number: 2,
            topic: "Language Analysis",
            prompt:
              "Which quotation would be strongest evidence that the beach feels threatening?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"The tide clawed at the broken pier.\"" },
              { optionId: "b", label: "B", text: "\"Children built towers in the sand.\"" },
              { optionId: "c", label: "C", text: "\"The sun warmed the rocks.\"" },
              { optionId: "d", label: "D", text: "\"A gull floated lazily above.\"" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q2-v3",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Structure",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from a wide description of the landscape to a close-up of the window latch?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It speeds up the ending." },
              {
                optionId: "b",
                label: "B",
                text: "It narrows the reader's attention and increases tension.",
              },
              { optionId: "c", label: "C", text: "It makes the scene more humorous." },
              { optionId: "d", label: "D", text: "It reveals the narrator is unreliable." },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v1",
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from the busy station platform to one silent suitcase left behind?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It slows the pace and focuses suspense." },
              { optionId: "b", label: "B", text: "It proves the narrator is lying." },
              { optionId: "c", label: "C", text: "It removes all sense of mystery." },
              { optionId: "d", label: "D", text: "It changes the text into comedy." },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v2",
          },
          {
            questionId: "q3-v3",
            number: 3,
            topic: "Structure",
            prompt:
              "What is the clearest effect of the writer moving from the noisy classroom to the final image of one unopened letter?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It lightens the mood with humour." },
              { optionId: "b", label: "B", text: "It broadens the focus to many characters." },
              { optionId: "c", label: "C", text: "It sharpens the reader's attention onto a key detail." },
              { optionId: "d", label: "D", text: "It removes all tension from the scene." },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "edexcel-english-paper-1-q3-v3",
          },
        ],
      },
    ],
  },
  {
    examId: "year10-maths-end-of-year-progression-paper",
    title: "Year 10 End-of-Year Mathematics Progression Paper",
    subject: "Mathematics",
    paperMode: "year-10-end-of-year",
    studentStage: "year-10",
    board: "AQA",
    qualificationType: "GCSE",
    tier: "HIGHER",
    paperName: "Progression Paper",
    year: 2026,
    durationMinutes: 60,
    totalMarks: 40,
    yearGroups: ["Year 10"],
    curriculumTags: ["Year 10 end-of-year", "Advanced set bridge", "GCSE-style command words"],
    boardTopicCoverage: "Built around Year 10 maths topics that many GCSE boards teach before full mock-paper difficulty.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Algebra", "Ratio", "Functions"],
    studentContextSummary: "Year 10 end-of-year paper using GCSE-style command words and mark expectations without requiring a full GCSE paper length.",
    gcsePreparationSummary: "This paper is designed to show whether a Year 10 student is ready to step from end-of-year assessment into full GCSE-style maths questions.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Algebra",
        marks: 2,
        type: "multiple-choice",
        guidance: "Show the bracket expansion before collecting the like terms.",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Algebra",
            prompt: "Year 10 progression question: Expand and simplify 4(x + 3) - x. Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "3x + 12" },
              { optionId: "b", label: "B", text: "4x + 3" },
              { optionId: "c", label: "C", text: "5x + 12" },
              { optionId: "d", label: "D", text: "3x + 3" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q1-v1"
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Algebra",
            prompt: "Year 10 progression question: Expand and simplify 3(2x - 1) + 5. Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "6x + 2" },
              { optionId: "b", label: "B", text: "6x - 4" },
              { optionId: "c", label: "C", text: "5x + 2" },
              { optionId: "d", label: "D", text: "6x + 4" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q1-v2"
          }
        ]
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Ratio",
        marks: 3,
        type: "multiple-choice",
        guidance: "Work out the value of one part before scaling back up.",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Ratio",
            prompt: "A Year 10 end-of-year ratio check uses the ratio 2:3. If the total is 35, what is the larger part?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "14" },
              { optionId: "b", label: "B", text: "21" },
              { optionId: "c", label: "C", text: "20" },
              { optionId: "d", label: "D", text: "28" }
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q2-v1"
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Ratio",
            prompt: "Blue and yellow paint are mixed in the ratio 4:1. If 10 litres of yellow paint are used, how much blue paint is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "14 litres" },
              { optionId: "b", label: "B", text: "20 litres" },
              { optionId: "c", label: "C", text: "30 litres" },
              { optionId: "d", label: "D", text: "40 litres" }
            ],
            correctOptionId: "d",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q2-v2"
          }
        ]
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Functions",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Functions",
            prompt: "A GCSE-style progression question uses f(x) = 4x - 1. Work out f(5).",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "16" },
              { optionId: "b", label: "B", text: "19" },
              { optionId: "c", label: "C", text: "20" },
              { optionId: "d", label: "D", text: "21" }
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q3-v1"
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Functions",
            prompt: "A GCSE-style progression question uses g(x) = 2x + 7. Work out g(6).",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "17" },
              { optionId: "b", label: "B", text: "18" },
              { optionId: "c", label: "C", text: "19" },
              { optionId: "d", label: "D", text: "20" }
            ],
            correctOptionId: "c",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q3-v2"
          }
        ]
      },
      {
        slotId: "q4",
        number: 4,
        topic: "Coordinate Geometry",
        marks: 3,
        type: "multiple-choice",
        guidance: "Use midpoint structure carefully because this is closer to a GCSE-style question stem.",
        variants: [
          {
            questionId: "q4-v1",
            number: 4,
            topic: "Coordinate Geometry",
            prompt: "Point A is at (1, 5) and point B is at (7, 9). What is the midpoint of AB?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(4, 7)" },
              { optionId: "b", label: "B", text: "(8, 14)" },
              { optionId: "c", label: "C", text: "(3, 4)" },
              { optionId: "d", label: "D", text: "(6, 2)" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q4-v1"
          },
          {
            questionId: "q4-v2",
            number: 4,
            topic: "Coordinate Geometry",
            prompt: "Point C is at (-2, 4) and point D is at (6, 10). What is the midpoint of CD?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(2, 7)" },
              { optionId: "b", label: "B", text: "(4, 6)" },
              { optionId: "c", label: "C", text: "(8, 14)" },
              { optionId: "d", label: "D", text: "(2, 6)" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-maths-end-of-year-progression-paper-q4-v2"
          }
        ]
      }
    ]
  },
  {
    examId: "year10-english-end-of-year-progression-paper",
    title: "Year 10 End-of-Year English Progression Paper",
    subject: "English Language",
    paperMode: "year-10-end-of-year",
    studentStage: "year-10",
    board: "Edexcel",
    qualificationType: "GCSE",
    tier: "FOUNDATION",
    paperName: "Progression Paper",
    year: 2026,
    durationMinutes: 60,
    totalMarks: 36,
    yearGroups: ["Year 10"],
    curriculumTags: ["Year 10 end-of-year", "GCSE extract bridge", "Evidence and analysis"],
    boardTopicCoverage: "Built around Year 10 English skills that become direct GCSE paper habits in Year 11.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Inference", "Language Analysis", "Structure"],
    studentContextSummary: "Year 10 end-of-year paper that introduces GCSE-style extract analysis and explanation in a shorter progression format.",
    gcsePreparationSummary: "This paper is designed to check whether a Year 10 student can move from classroom English tasks into more GCSE-like evidence and analysis questions.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Inference",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Inference",
            prompt: "Year 10 progression question: Which statement best matches the narrator's view of the empty field?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels joyful and busy." },
              { optionId: "b", label: "B", text: "It feels bleak and exposed." },
              { optionId: "c", label: "C", text: "It feels ordinary and safe." },
              { optionId: "d", label: "D", text: "It feels playful and bright." }
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q1-v1"
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Inference",
            prompt: "Year 10 progression question: Which statement best matches the writer's view of the narrow staircase?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It feels unsettling and claustrophobic." },
              { optionId: "b", label: "B", text: "It feels luxurious and warm." },
              { optionId: "c", label: "C", text: "It feels cheerful and noisy." },
              { optionId: "d", label: "D", text: "It feels playful and harmless." }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q1-v2"
          }
        ]
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Language Analysis",
        marks: 2,
        type: "multiple-choice",
        guidance: "Choose the quotation that best proves the effect, not just one from the same scene.",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Language Analysis",
            prompt: "Which quotation best suggests the setting feels threatening?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"The tide clawed at the black stones.\"" },
              { optionId: "b", label: "B", text: "\"A gull drifted across the pale sky.\"" },
              { optionId: "c", label: "C", text: "\"Children laughed in the distance.\"" },
              { optionId: "d", label: "D", text: "\"The sunlight flashed on the waves.\"" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q2-v1"
          },
          {
            questionId: "q2-v2",
            number: 2,
            topic: "Language Analysis",
            prompt: "Which quotation best suggests the house feels abandoned?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "\"Dust lay thick on the window ledge.\"" },
              { optionId: "b", label: "B", text: "\"Music played in the kitchen.\"" },
              { optionId: "c", label: "C", text: "\"The hallway smelled of fresh bread.\"" },
              { optionId: "d", label: "D", text: "\"The curtains were bright and new.\"" }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q2-v2"
          }
        ]
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Structure",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Structure",
            prompt: "What is the clearest effect of the writer moving from the noisy road to one silent doorway?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It narrows the focus and sharpens tension." },
              { optionId: "b", label: "B", text: "It proves the narrator is dishonest." },
              { optionId: "c", label: "C", text: "It turns the text into comedy." },
              { optionId: "d", label: "D", text: "It removes mystery from the scene." }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q3-v1"
          },
          {
            questionId: "q3-v2",
            number: 3,
            topic: "Structure",
            prompt: "What is the clearest effect of the writer moving from a broad landscape to one cracked window frame?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "It narrows the reader's attention onto a key detail." },
              { optionId: "b", label: "B", text: "It removes the sense of atmosphere." },
              { optionId: "c", label: "C", text: "It makes the scene humorous." },
              { optionId: "d", label: "D", text: "It broadens the focus to more characters." }
            ],
            correctOptionId: "a",
            sourceQuestionKey: "year10-english-end-of-year-progression-paper-q3-v2"
          }
        ]
      }
    ]
  },
  {
    examId: "year10-maths-advanced-gcse-bridge-paper",
    title: "Advanced Year 10 GCSE Mathematics Bridge Paper",
    subject: "Mathematics",
    paperMode: "year-10-gcse-bridge",
    studentStage: "year-10",
    board: "Edexcel",
    qualificationType: "GCSE",
    tier: "HIGHER",
    paperName: "Bridge Paper",
    year: 2026,
    durationMinutes: 75,
    totalMarks: 52,
    yearGroups: ["Year 10"],
    curriculumTags: ["Advanced Year 10", "GCSE bridge", "Higher tier preparation"],
    boardTopicCoverage: "Built for advanced Year 10 students covering algebra, graph, and geometry material that commonly appears before Year 11 mock papers.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Algebra", "Functions", "Coordinate Geometry"],
    studentContextSummary: "Advanced Year 10 bridge paper for students already working above standard end-of-year expectation and moving toward full GCSE higher-tier habits.",
    gcsePreparationSummary: "Use this after end-of-year progression work when a student needs a stronger step into GCSE-style multi-skill questions before Year 11.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Algebra",
        marks: 3,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Algebra",
            prompt: "Solve 3(x + 2) = 2x + 11. Which answer is correct?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "x = 3" },
              { optionId: "b", label: "B", text: "x = 5" },
              { optionId: "c", label: "C", text: "x = 7" },
              { optionId: "d", label: "D", text: "x = 9" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-maths-advanced-gcse-bridge-paper-q1-v1",
          },
          {
            questionId: "q1-v2",
            number: 1,
            topic: "Algebra",
            prompt: "Solve 4x - 7 = 2x + 9. Which answer is correct?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "x = 6" },
              { optionId: "b", label: "B", text: "x = 7" },
              { optionId: "c", label: "C", text: "x = 8" },
              { optionId: "d", label: "D", text: "x = 9" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "year10-maths-advanced-gcse-bridge-paper-q1-v2",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Functions",
        marks: 3,
        type: "multiple-choice",
        guidance: "Substitute carefully, then simplify in the correct order.",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Functions",
            prompt: "If f(x) = 3x + 1 and g(x) = x - 2, what is f(4) + g(4)?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "13" },
              { optionId: "b", label: "B", text: "15" },
              { optionId: "c", label: "C", text: "17" },
              { optionId: "d", label: "D", text: "19" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-maths-advanced-gcse-bridge-paper-q2-v1",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Coordinate Geometry",
        marks: 3,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Coordinate Geometry",
            prompt: "A line segment joins (2, 3) to (10, 11). What is the midpoint?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "(4, 5)" },
              { optionId: "b", label: "B", text: "(6, 7)" },
              { optionId: "c", label: "C", text: "(8, 9)" },
              { optionId: "d", label: "D", text: "(12, 14)" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "year10-maths-advanced-gcse-bridge-paper-q3-v1",
          },
        ],
      },
    ],
  },
  {
    examId: "edexcel-maths-foundation-paper-1",
    title: "GCSE Mathematics Foundation Paper",
    subject: "Mathematics",
    paperMode: "full-gcse",
    studentStage: "year-11",
    board: "Edexcel",
    qualificationType: "GCSE",
    tier: "FOUNDATION",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 90,
    totalMarks: 80,
    yearGroups: ["Year 11"],
    curriculumTags: ["Foundation tier", "Year 11", "Full GCSE practice"],
    boardTopicCoverage: "Built around common Edexcel foundation-tier Year 11 paper expectations with accessible GCSE-style coverage.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Number", "Ratio", "Graphs"],
    studentContextSummary: "Full GCSE foundation paper practice for students who need complete paper timing with foundation-tier entry points.",
    gcsePreparationSummary: "Use this once Year 10 progression work is stable and the student is ready for a full foundation paper experience with access-arrangement support.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Number",
        marks: 1,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Number",
            prompt: "Work out 0.4 x 30. Which answer is correct?",
            marks: 1,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "1.2" },
              { optionId: "b", label: "B", text: "12" },
              { optionId: "c", label: "C", text: "34" },
              { optionId: "d", label: "D", text: "120" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "edexcel-maths-foundation-paper-1-q1-v1",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Ratio",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Ratio",
            prompt: "A ratio is 1:4. If the total is 25, what is the larger part?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "5" },
              { optionId: "b", label: "B", text: "15" },
              { optionId: "c", label: "C", text: "20" },
              { optionId: "d", label: "D", text: "24" },
            ],
            correctOptionId: "c",
            sourceQuestionKey: "edexcel-maths-foundation-paper-1-q2-v1",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Graphs",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Graphs",
            prompt: "A line crosses the y-axis at 4 and rises 1 for every 1 across. Which equation matches?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "y = x + 4" },
              { optionId: "b", label: "B", text: "y = 4x + 1" },
              { optionId: "c", label: "C", text: "y = x - 4" },
              { optionId: "d", label: "D", text: "y = 4 - x" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "edexcel-maths-foundation-paper-1-q3-v1",
          },
        ],
      },
    ],
  },
  {
    examId: "cambridge-igcse-maths-paper-1",
    title: "Cambridge iGCSE Mathematics Paper 1",
    subject: "Mathematics",
    paperMode: "igcse-full-course",
    studentStage: "year-11",
    board: "Cambridge IGCSE",
    qualificationType: "IGCSE",
    tier: "HIGHER",
    paperName: "Paper 1",
    year: 2025,
    durationMinutes: 90,
    totalMarks: 70,
    yearGroups: ["Year 10", "Year 11"],
    curriculumTags: ["iGCSE", "Advanced Year 10 bridge", "Year 11 full paper"],
    boardTopicCoverage: "Built around shared Cambridge iGCSE maths paper habits, especially algebra, graph interpretation, and proportional reasoning.",
    accessSupportLevel: "send-ready-foundation",
    sourceProviderId: "seed-exam-engine",
    skillsFocus: ["Linear Graphs", "Algebra", "Ratio"],
    studentContextSummary: "iGCSE paper practice for advanced Year 10 students and Year 11 students following an international GCSE route.",
    gcsePreparationSummary: "Use this paper when a student needs iGCSE-style command words and paper rhythm rather than domestic GCSE board wording.",
    questionSlots: [
      {
        slotId: "q1",
        number: 1,
        topic: "Linear Graphs",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q1-v1",
            number: 1,
            topic: "Linear Graphs",
            prompt: "A line has gradient 3 and y-intercept -2. Which equation is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "y = 3x - 2" },
              { optionId: "b", label: "B", text: "y = 2x - 3" },
              { optionId: "c", label: "C", text: "y = 3x + 2" },
              { optionId: "d", label: "D", text: "y = -3x - 2" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "cambridge-igcse-maths-paper-1-q1-v1",
          },
        ],
      },
      {
        slotId: "q2",
        number: 2,
        topic: "Algebra",
        marks: 2,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q2-v1",
            number: 2,
            topic: "Algebra",
            prompt: "Simplify 2a + 3b - a + 4b. Which answer is correct?",
            marks: 2,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "a + 7b" },
              { optionId: "b", label: "B", text: "3a + b" },
              { optionId: "c", label: "C", text: "a + b" },
              { optionId: "d", label: "D", text: "2a + 7b" },
            ],
            correctOptionId: "a",
            sourceQuestionKey: "cambridge-igcse-maths-paper-1-q2-v1",
          },
        ],
      },
      {
        slotId: "q3",
        number: 3,
        topic: "Ratio",
        marks: 3,
        type: "multiple-choice",
        variants: [
          {
            questionId: "q3-v1",
            number: 3,
            topic: "Ratio",
            prompt: "Red and blue are mixed in the ratio 5:2. If 15 litres of red are used, how much blue is needed?",
            marks: 3,
            type: "multiple-choice",
            options: [
              { optionId: "a", label: "A", text: "4 litres" },
              { optionId: "b", label: "B", text: "6 litres" },
              { optionId: "c", label: "C", text: "8 litres" },
              { optionId: "d", label: "D", text: "10 litres" },
            ],
            correctOptionId: "b",
            sourceQuestionKey: "cambridge-igcse-maths-paper-1-q3-v1",
          },
        ],
      },
    ],
  }
];

export function getMockExamPapers(): ExamPaper[] {
  return mockExamPaperBlueprints.map((paper) => ({
    ...paper,
    questions: paper.questionSlots.map((slot) => slot.variants[0]),
  }));
}

export function getMockExamSessionId(examId: string, attemptNumber = 1): string {
  return `${examId}-session-${String(attemptNumber).padStart(3, "0")}`;
}

export async function getMockExamSession(
  examId: string,
  options?: {
    userId?: string;
    startFreshAttempt?: boolean;
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const blueprint = mockExamPaperBlueprints.find((item) => item.examId === examId);

  if (!blueprint) {
    throw new Error(`Unknown mock exam paper: ${examId}`);
  }

  const userId = options?.userId ?? "student-demo";
  const examHistory = await listExamHistory(userId, examId, options?.savedProgressRepository);
  const latestRecord = examHistory[0];

  if (latestRecord && !options?.startFreshAttempt) {
    return buildSessionFromRecord(blueprint, latestRecord, examHistory.slice(1), userId, options);
  }

  const attemptNumber = (latestRecord ? parseAttemptNumber(latestRecord.entityId) : 0) + 1;
  const questions = buildGeneratedQuestionSet(blueprint, examHistory);
  const seededResponses = buildSeededResponses(examId, questions);
  const answeredCount = seededResponses.filter((response) => response.selectedOptionId).length;
  const appliedExam = await applyAccessArrangementsToExam(
    {
      examId: blueprint.examId,
      userId,
      officialDurationMinutes: blueprint.durationMinutes,
      qualificationType: blueprint.qualificationType,
      examBoard: blueprint.board,
      tier: blueprint.tier,
    },
    options?.accessProfileRepository,
  );

  const session: ExamSession = {
    examSessionId: getMockExamSessionId(examId, attemptNumber),
    examId: blueprint.examId,
    userId,
    attemptNumber,
    status: "in-progress",
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: "2026-06-05T09:08:00.000Z",
    durationMinutes: appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes: Math.max(
      appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes - (18 + answeredCount),
      12,
    ),
    accessArrangements: appliedExam,
    questions,
    questionResponses: seededResponses,
    generationSummary: buildGenerationSummary(questions, examHistory),
  };

  await saveExamProgress(
    {
      userId: session.userId,
      examSessionId: session.examSessionId,
      currentQuestionId: getCurrentQuestionId(session),
      questionSet: session.questions,
      questionResponses: session.questionResponses,
      timeRemainingMinutes: session.timeRemainingMinutes,
      status: session.status,
      accessArrangementSnapshot:
        session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    options?.savedProgressRepository,
  );

  return session;
}

export async function saveMockExamSession(
  examId: string,
  input: {
    examSessionId: string;
    currentQuestionId: string;
    questionResponses: ExamQuestionResponse[];
    timeRemainingMinutes: number;
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const session = await getMockExamSession(examId, {
    userId: input.userId,
    savedProgressRepository: input.savedProgressRepository,
  });

  if (session.examSessionId !== input.examSessionId) {
    throw new Error("Exam session mismatch while saving progress.");
  }

  const nextSession: ExamSession = {
    ...session,
    lastSavedAt: new Date().toISOString(),
    timeRemainingMinutes: Math.max(
      0,
      Math.min(input.timeRemainingMinutes, session.durationMinutes),
    ),
    questionResponses: input.questionResponses,
  };

  await saveExamProgress(
    {
      userId: nextSession.userId,
      examSessionId: nextSession.examSessionId,
      currentQuestionId: input.currentQuestionId,
      questionSet: nextSession.questions,
      questionResponses: nextSession.questionResponses,
      timeRemainingMinutes: nextSession.timeRemainingMinutes,
      status: nextSession.status,
      accessArrangementSnapshot:
        nextSession.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    input.savedProgressRepository,
  );

  return nextSession;
}

export async function submitMockExamSession(
  examId: string,
  input: {
    examSessionId: string;
    currentQuestionId: string;
    questionResponses: ExamQuestionResponse[];
    timeRemainingMinutes: number;
    userId?: string;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const session = await saveMockExamSession(examId, input);
  const submittedSession: ExamSession = {
    ...session,
    status: "submitted",
    lastSavedAt: new Date().toISOString(),
  };

  await saveExamProgress(
    {
      userId: submittedSession.userId,
      examSessionId: submittedSession.examSessionId,
      currentQuestionId: input.currentQuestionId,
      questionSet: submittedSession.questions,
      questionResponses: submittedSession.questionResponses,
      timeRemainingMinutes: submittedSession.timeRemainingMinutes,
      status: submittedSession.status,
      accessArrangementSnapshot:
        submittedSession.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
    },
    input.savedProgressRepository,
  );

  recordOperationsEvent(
    buildOperationsEvent({
      domain: "exam",
      action: "session-submitted",
      status: "success",
      userId: submittedSession.userId,
      entityId: submittedSession.examSessionId,
      detail: `Exam ${examId} was submitted and stored through the saved-progress layer.`,
    }),
  );

  return submittedSession;
}

async function buildSessionFromRecord(
  blueprint: ExamPaperBlueprint,
  record: SavedProgressRecord,
  priorHistory: SavedProgressRecord[],
  userId: string,
  options?: {
    accessProfileRepository?: StudentAccessProfileRepository;
    savedProgressRepository?: SavedProgressRepository;
  },
): Promise<ExamSession> {
  const appliedExam = await applyAccessArrangementsToExam(
    {
      examId: blueprint.examId,
      userId,
      officialDurationMinutes: blueprint.durationMinutes,
      qualificationType: blueprint.qualificationType,
      examBoard: blueprint.board,
      tier: blueprint.tier,
    },
    options?.accessProfileRepository,
  );

  const fallbackQuestions = buildGeneratedQuestionSet(blueprint, []);
  const questions = record.examProgress?.questionSet?.length
    ? record.examProgress.questionSet
    : fallbackQuestions;
  const generationSummary = buildGenerationSummary(questions, priorHistory);

  const session: ExamSession = {
    examSessionId: record.entityId,
    examId: blueprint.examId,
    userId,
    attemptNumber: parseAttemptNumber(record.entityId),
    status: record.status === "submitted" ? "submitted" : "in-progress",
    startedAt: "2026-06-05T08:45:00.000Z",
    lastSavedAt: record.lastActivityAt,
    durationMinutes: appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    timeRemainingMinutes:
      record.examProgress?.timeRemainingMinutes ??
      appliedExam.accessArrangementApplication.duration.adjustedDurationMinutes,
    accessArrangements: appliedExam,
    questions,
    questionResponses: record.examProgress?.questionResponses ?? buildSeededResponses(blueprint.examId, questions),
    generationSummary,
  };

  if (session.status !== "submitted") {
    await saveExamProgress(
      {
        userId: session.userId,
        examSessionId: session.examSessionId,
        currentQuestionId: getCurrentQuestionId(session),
        questionSet: session.questions,
        questionResponses: session.questionResponses,
        timeRemainingMinutes: session.timeRemainingMinutes,
        status: session.status,
        accessArrangementSnapshot:
          session.accessArrangements?.accessArrangementApplication.savedProgressSnapshot,
      },
      options?.savedProgressRepository,
    );
  }

  return session;
}

function buildGeneratedQuestionSet(
  blueprint: ExamPaperBlueprint,
  history: SavedProgressRecord[],
): ExamQuestion[] {
  const recentQuestionKeys = history
    .slice(0, 2)
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);
  const allQuestionKeys = history
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);

  return blueprint.questionSlots.map((slot) => {
    const variant = [...slot.variants].sort((left, right) => {
      const leftKey = left.sourceQuestionKey ?? left.questionId;
      const rightKey = right.sourceQuestionKey ?? right.questionId;
      const leftRecentPenalty = recentQuestionKeys.includes(leftKey) ? 1 : 0;
      const rightRecentPenalty = recentQuestionKeys.includes(rightKey) ? 1 : 0;

      if (leftRecentPenalty !== rightRecentPenalty) {
        return leftRecentPenalty - rightRecentPenalty;
      }

      const leftSeenCount = allQuestionKeys.filter((key) => key === leftKey).length;
      const rightSeenCount = allQuestionKeys.filter((key) => key === rightKey).length;

      if (leftSeenCount !== rightSeenCount) {
        return leftSeenCount - rightSeenCount;
      }

      return leftKey.localeCompare(rightKey);
    })[0];

    return {
      ...variant,
      number: slot.number,
      topic: slot.topic,
      marks: slot.marks,
      type: slot.type,
      guidance: variant.guidance ?? slot.guidance,
    };
  });
}

function buildSeededResponses(
  examId: string,
  questions: ExamQuestion[],
): ExamQuestionResponse[] {
  return questions.map((question, index) => ({
    questionId: question.questionId,
    status: index === 0 ? "in-progress" : "not-started",
    selectedOptionId: getSeededAnswerSelection(examId, question),
    workingNotes: getSeededWorkingNotes(examId, question),
    flagged: question.number === 2,
  }));
}

function getSeededAnswerSelection(examId: string, question: ExamQuestion): string | undefined {
  if (examId === "aqa-maths-higher-paper-1" && question.number === 1) {
    return question.correctOptionId;
  }

  return undefined;
}

function getSeededWorkingNotes(examId: string, question: ExamQuestion): string | undefined {
  if (examId === "aqa-maths-higher-paper-1" && question.topic === "Ratio") {
    return "Convert or scale the quantities first, then check whether the final unit stays in grams, litres, or kilometres.";
  }

  if (examId === "edexcel-english-paper-1" && question.topic === "Language Analysis") {
    return "Choose the quotation that most strongly matches the effect, not just a quotation from the same setting.";
  }

  return undefined;
}

function buildGenerationSummary(
  questions: ExamQuestion[],
  history: SavedProgressRecord[],
): ExamSessionGenerationSummary {
  const historicalKeys = history
    .flatMap((record) => record.examProgress?.questionSet ?? [])
    .map((question) => question.sourceQuestionKey ?? question.questionId);

  return {
    strategy: "topic-repeat-question-rotate",
    reusedQuestionCount: questions.filter((question) =>
      historicalKeys.includes(question.sourceQuestionKey ?? question.questionId),
    ).length,
    repeatedTopicCount:
      questions.length - new Set(questions.map((question) => question.topic)).size,
    questionSourceKeys: questions.map((question) => question.sourceQuestionKey ?? question.questionId),
  };
}

async function listExamHistory(
  userId: string,
  examId: string,
  repository?: SavedProgressRepository,
): Promise<SavedProgressRecord[]> {
  const records = await listSavedProgressByUser(userId, repository);

  return records
    .filter(
      (record) =>
        record.entityType === "exam-session" &&
        record.entityId.startsWith(`${examId}-session-`) &&
        record.examProgress,
    )
    .sort((left, right) => parseAttemptNumber(right.entityId) - parseAttemptNumber(left.entityId));
}

function parseAttemptNumber(entityId: string): number {
  const match = entityId.match(/-session-(\d+)$/);

  return match ? Number(match[1]) : 1;
}

function getCurrentQuestionId(session: ExamSession): string {
  const firstActiveResponse = session.questionResponses.find(
    (response) => response.status !== "not-started" || response.selectedOptionId,
  );

  return firstActiveResponse?.questionId ?? session.questionResponses[0]?.questionId ?? "";
}
