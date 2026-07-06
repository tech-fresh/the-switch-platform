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
  explanation: string;
}

export interface QuizProgressRecord {
  userId: string;
  topicId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  lastAnsweredAt: string;
}

export interface QuizProgressRepository {
  getByTopicId(userId: string, topicId: string): Promise<QuizProgressRecord | null>;
  listByUserId(userId: string): Promise<QuizProgressRecord[]>;
  save(record: QuizProgressRecord): Promise<QuizProgressRecord>;
}

export interface SubmitQuizAnswerResult {
  topicId: string;
  questionId: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  correctOptionId: string;
  correctOptionLabel: string;
  isCorrect: boolean;
  explanation: string;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  lastAnsweredAt: string;
}
