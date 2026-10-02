import type { Question, Quiz } from '../../models';

export type QuestionDto =
  | { id: number; type: 'boolean'; text: string; correctAnswer: boolean }
  | { id: number; type: 'input'; text: string; correctAnswer: string }
  | {
      id: number;
      type: 'checkbox';
      text: string;
      options: { id: number; text: string; isCorrect: boolean }[];
    };

export interface QuizDto {
  id: number;
  title: string;
  createdAt: string;
  questions: QuestionDto[];
}

export interface QuizSummaryDto {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

export function toQuestionDto(question: Question): QuestionDto {
  const base = { id: question.id, text: question.text };

  switch (question.type) {
    case 'boolean':
      return { ...base, type: 'boolean', correctAnswer: question.correctBoolean ?? false };
    case 'input':
      return { ...base, type: 'input', correctAnswer: question.correctText ?? '' };
    case 'checkbox':
      return {
        ...base,
        type: 'checkbox',
        options: (question.options ?? []).map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      };
  }
}

export function toQuizDto(quiz: Quiz): QuizDto {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: (quiz.questions ?? []).map(toQuestionDto),
  };
}
