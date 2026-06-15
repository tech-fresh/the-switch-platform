export interface RevisionContentSection {
  title:
    | "Explain Simply"
    | "Standard Explanation"
    | "Detailed Explanation"
    | "Worked Examples"
    | "Common Mistakes"
    | "Practice Questions"
    | "Timed Assessment"
    | "Past Paper Questions"
    | "Mark Scheme"
    | "Exam Technique";
  body: string;
}

export interface RevisionContent {
  contentId: string;
  topicId: string;
  title: string;
  sections: RevisionContentSection[];
}
