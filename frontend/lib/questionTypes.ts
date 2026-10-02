import type { QuestionType } from '@/types/quiz';

interface QuestionTypeMeta {
  label: string;
  /** Tailwind classes — written out in full so the compiler can detect them. */
  border: string;
  badge: string;
}

export const QUESTION_TYPE_META: Record<QuestionType, QuestionTypeMeta> = {
  boolean: {
    label: 'True / False',
    border: 'border-l-type-boolean',
    badge: 'bg-type-boolean/10 text-type-boolean',
  },
  input: {
    label: 'Short answer',
    border: 'border-l-type-input',
    badge: 'bg-type-input/10 text-type-input',
  },
  checkbox: {
    label: 'Multiple choice',
    border: 'border-l-type-checkbox',
    badge: 'bg-type-checkbox/10 text-type-checkbox',
  },
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso));

export const pluralizeQuestions = (count: number) =>
  `${count} ${count === 1 ? 'question' : 'questions'}`;

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';
