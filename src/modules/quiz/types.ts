export interface QuizOption {
  optionId: string;
  label: string;
  text: string;
}

export interface QuizQuestion {
  questionId: string;
  topicId: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
}
