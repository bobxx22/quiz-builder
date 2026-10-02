export const QUESTION_TYPES = ['boolean', 'input', 'checkbox'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export type Question =
  | { id: number; type: 'boolean'; text: string; correctAnswer: boolean }
  | { id: number; type: 'input'; text: string; correctAnswer: string }
  | { id: number; type: 'checkbox'; text: string; options: QuizOption[] };

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

/** Payload accepted by `POST /quizzes`. */
export type CreateQuizPayload = {
  title: string;
  questions: (
    | { type: 'boolean'; text: string; correctAnswer: boolean }
    | { type: 'input'; text: string; correctAnswer: string }
    | { type: 'checkbox'; text: string; options: { text: string; isCorrect: boolean }[] }
  )[];
};
