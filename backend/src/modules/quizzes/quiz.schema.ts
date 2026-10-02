import { z } from 'zod';

const questionText = z.string().trim().min(1, 'Question text is required').max(500);

const booleanQuestionSchema = z.object({
  type: z.literal('boolean'),
  text: questionText,
  correctAnswer: z.boolean(),
});

const inputQuestionSchema = z.object({
  type: z.literal('input'),
  text: questionText,
  correctAnswer: z.string().trim().min(1, 'Correct answer is required').max(200),
});

const optionSchema = z.object({
  text: z.string().trim().min(1, 'Option text is required').max(200),
  isCorrect: z.boolean(),
});

const checkboxQuestionSchema = z.object({
  type: z.literal('checkbox'),
  text: questionText,
  options: z
    .array(optionSchema)
    .min(2, 'Add at least 2 options')
    .max(10, 'No more than 10 options')
    .refine((options) => options.some((option) => option.isCorrect), {
      message: 'Mark at least one option as correct',
    }),
});

export const questionSchema = z.discriminatedUnion('type', [
  booleanQuestionSchema,
  inputQuestionSchema,
  checkboxQuestionSchema,
]);

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  questions: z.array(questionSchema).min(1, 'Add at least one question').max(100),
});

export const quizIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
