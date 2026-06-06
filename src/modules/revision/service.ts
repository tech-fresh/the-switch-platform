import type { RevisionContent } from "./types";

const mockRevisionContent: RevisionContent[] = [
  {
    contentId: "rev-maths-algebra",
    topicId: "maths-algebra",
    title: "Algebra Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Algebra is a way to describe missing numbers and relationships using symbols.",
      },
      {
        title: "Worked Examples",
        body: "Expand brackets step by step, then combine like terms carefully.",
      },
      {
        title: "Common Mistakes",
        body: "Dropping minus signs and mixing unlike terms are the fastest ways to lose marks.",
      },
      {
        title: "Exam Technique",
        body: "Show one clean line of working for every transformation so follow-through marks stay available.",
      },
    ],
  },
  {
    contentId: "rev-maths-ratio",
    topicId: "maths-ratio",
    title: "Ratio Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Ratio compares parts and helps you scale one quantity against another accurately.",
      },
      {
        title: "Worked Examples",
        body: "Write the total number of parts first, then divide the full amount before multiplying back up.",
      },
      {
        title: "Common Mistakes",
        body: "Students often reverse the ratio order or forget to simplify before comparing.",
      },
      {
        title: "Exam Technique",
        body: "Label units carefully, especially when ratio appears inside a map scale or recipe question.",
      },
    ],
  },
  {
    contentId: "rev-english-language-analysis",
    topicId: "english-language-analysis",
    title: "Language Analysis Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Language analysis is about what the writer chose and why it affects the reader.",
      },
      {
        title: "Worked Examples",
        body: "Start with a short quotation, identify a method, then explain its effect in context.",
      },
      {
        title: "Common Mistakes",
        body: "Retelling the extract instead of analysing the wording keeps answers stuck at low marks.",
      },
      {
        title: "Exam Technique",
        body: "Use precise verbs like suggests, emphasises, and highlights rather than vague comments.",
      },
    ],
  },
  {
    contentId: "rev-english-structure",
    topicId: "english-structure",
    title: "Structure Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Structure is about how the writer organises attention, not just what the text says.",
      },
      {
        title: "Worked Examples",
        body: "Track where the focus begins, what shifts in the middle, and what the ending leaves behind.",
      },
      {
        title: "Common Mistakes",
        body: "Listing techniques without linking them to the reader's experience keeps answers vague.",
      },
      {
        title: "Exam Technique",
        body: "Use movement language like zooms in, shifts, narrows, and returns to show structural control.",
      },
    ],
  },
  {
    contentId: "rev-science-chemical-changes",
    topicId: "science-chemical-changes",
    title: "Chemical Changes Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Chemical changes create new substances, often through reactions that transfer energy.",
      },
      {
        title: "Worked Examples",
        body: "Compare metals using reactivity rules before predicting what will happen in a displacement reaction.",
      },
      {
        title: "Common Mistakes",
        body: "Mixing up ions, atoms, and molecules can scramble electrolysis answers quickly.",
      },
      {
        title: "Exam Technique",
        body: "Name the products clearly and use the reactivity series to justify the answer, not just guess it.",
      },
    ],
  },
  {
    contentId: "rev-science-energy",
    topicId: "science-energy",
    title: "Energy Revision Stack",
    sections: [
      {
        title: "Explain Simply",
        body: "Energy moves between stores and pathways, even though it cannot be created or destroyed.",
      },
      {
        title: "Worked Examples",
        body: "Start by naming the initial store, then explain the transfer pathway and the final useful output.",
      },
      {
        title: "Common Mistakes",
        body: "Mixing up transfer pathways with stores is one of the most common mark-dropping errors.",
      },
      {
        title: "Exam Technique",
        body: "In efficiency questions, keep the calculation tidy and always include the final unit or percentage.",
      },
    ],
  },
];

export function getMockRevisionContent(topicId: string): RevisionContent {
  const content = mockRevisionContent.find((item) => item.topicId === topicId);

  if (!content) {
    throw new Error(`Unknown mock revision content for topic: ${topicId}`);
  }

  return content;
}
