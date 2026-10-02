import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { ErrorMessage, FieldError } from '@/components/FeedbackMessages';
import { PlusIcon } from '@/components/icons';
import { getErrorMessage, QUESTION_TYPE_META } from '@/lib/questionTypes';
import {
  createEmptyQuestion,
  quizFormSchema,
  toCreatePayload,
  type QuizFormValues,
} from '@/lib/quizFormSchema';
import { quizService } from '@/services/quizService';
import { QUESTION_TYPES } from '@/types/quiz';
import { QuestionFields } from './QuestionFields';

const MAX_QUESTIONS = 100;

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { title: '', questions: [createEmptyQuestion('boolean')] },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

  const onSubmit = async (values: QuizFormValues) => {
    setSubmitError(null);
    try {
      const quiz = await quizService.create(toCreatePayload(values));
      await router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div>
          <label htmlFor="quiz-title" className="text-sm font-medium">
            Quiz title
          </label>
          <input
            id="quiz-title"
            type="text"
            placeholder="e.g. World capitals"
            aria-invalid={errors.title ? true : undefined}
            className="field mt-1 text-xl font-semibold"
            {...register('title')}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <QuestionFields
              key={field.id}
              index={index}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <div className="rounded-lg border border-dashed border-line p-4">
          <p className="text-sm font-medium">Add a question</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => append(createEmptyQuestion(type))}
                disabled={fields.length >= MAX_QUESTIONS}
                className="btn btn-secondary"
              >
                <PlusIcon /> {QUESTION_TYPE_META[type].label}
              </button>
            ))}
          </div>
        </div>

        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary px-6">
            {isSubmitting ? 'Saving...' : 'Save quiz'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
