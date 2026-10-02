import { useFormContext, useWatch } from 'react-hook-form';
import { FieldError } from '@/components/FeedbackMessages';
import { TrashIcon } from '@/components/icons';
import { QUESTION_TYPE_META } from '@/lib/questionTypes';
import type { QuizFormValues } from '@/lib/quizFormSchema';
import { QUESTION_TYPES } from '@/types/quiz';
import { OptionFields } from './OptionFields';

interface QuestionFieldsProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export function QuestionFields({ index, canRemove, onRemove }: QuestionFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const type = useWatch({ control, name: `questions.${index}.type` });
  const questionErrors = errors.questions?.[index];

  return (
    <section
      aria-label={`Question ${index + 1}`}
      className={`rounded-lg border border-l-4 border-line bg-paper p-5 ${QUESTION_TYPE_META[type].border}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted">Question {index + 1}</h2>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <TrashIcon width={16} height={16} /> Remove
        </button>
      </div>

      <fieldset className="mt-3">
        <legend className="sr-only">Question type</legend>
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-canvas/60 p-1">
          {QUESTION_TYPES.map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium has-checked:bg-brand has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register(`questions.${index}.type`)}
              />
              {QUESTION_TYPE_META[value].label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor={`question-${index}-text`} className="text-sm font-medium">
          Question
        </label>
        <input
          id={`question-${index}-text`}
          type="text"
          placeholder="Type your question"
          aria-invalid={questionErrors?.text ? true : undefined}
          className="field mt-1"
          {...register(`questions.${index}.text`)}
        />
        <FieldError message={questionErrors?.text?.message} />
      </div>

      <div className="mt-4">
        {type === 'boolean' && (
          <fieldset>
            <legend className="text-sm font-medium">Correct answer</legend>
            <div className="mt-1 flex gap-6">
              {(['true', 'false'] as const).map((value) => (
                <label key={value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value={value}
                    className="size-5 accent-brand"
                    {...register(`questions.${index}.booleanAnswer`)}
                  />
                  {value === 'true' ? 'True' : 'False'}
                </label>
              ))}
            </div>
            <FieldError message={questionErrors?.booleanAnswer?.message} />
          </fieldset>
        )}

        {type === 'input' && (
          <div>
            <label htmlFor={`question-${index}-answer`} className="text-sm font-medium">
              Expected answer
            </label>
            <input
              id={`question-${index}-answer`}
              type="text"
              placeholder="Short text answer"
              aria-invalid={questionErrors?.inputAnswer ? true : undefined}
              className="field mt-1"
              {...register(`questions.${index}.inputAnswer`)}
            />
            <FieldError message={questionErrors?.inputAnswer?.message} />
          </div>
        )}

        {type === 'checkbox' && <OptionFields questionIndex={index} />}
      </div>
    </section>
  );
}
