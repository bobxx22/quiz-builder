import { z } from 'zod';
import type { CreateQuizPayload, QuestionType } from '@/types/quiz';

/**
 * The form keeps one flat shape for every question so that switching a question's type
 * never loses what was typed. Only the fields relevant to the selected type are validated.
 */
const questionFormSchema = z
  .object({
    type: z.enum(['boolean', 'input', 'checkbox']),
    text: z
      .string()
      .trim()
      .min(1, 'Enter the question text')
      .max(500, 'Keep it under 500 characters'),
    booleanAnswer: z.enum(['true', 'false', '']),
    inputAnswer: z.string(),
    options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() })),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'boolean' && question.booleanAnswer === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['booleanAnswer'],
        message: 'Choose the correct answer',
      });
    }

    if (question.type === 'input' && !question.inputAnswer.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['inputAnswer'],
        message: 'Enter the expected answer',
      });
    }

    if (question.type === 'checkbox') {
      if (question.options.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Add at least 2 options',
        });
      }
      question.options.forEach((option, index) => {
        if (!option.text.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: ['options', index, 'text'],
            message: 'Enter the option text',
          });
        }
      });
      if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Mark at least one option as correct',
        });
      }
    }
  });

export const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a quiz title').max(200, 'Keep it under 200 characters'),
  questions: z.array(questionFormSchema).min(1, 'Add at least one question'),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = QuizFormValues['questions'][number];

export function createEmptyQuestion(type: QuestionType): QuestionFormValues {
  return {
    type,
    text: '',
    booleanAnswer: '',
    inputAnswer: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  };
}

export function toCreatePayload(values: QuizFormValues): CreateQuizPayload {
  return {
    title: values.title.trim(),
    questions: values.questions.map((question): CreateQuizPayload['questions'][number] => {
      const text = question.text.trim();
      switch (question.type) {
        case 'boolean':
          return { type: 'boolean', text, correctAnswer: question.booleanAnswer === 'true' };
        case 'input':
          return { type: 'input', text, correctAnswer: question.inputAnswer.trim() };
        case 'checkbox':
          return {
            type: 'checkbox',
            text,
            options: question.options.map((option) => ({
              text: option.text.trim(),
              isCorrect: option.isCorrect,
            })),
          };
      }
    }),
  };
}
