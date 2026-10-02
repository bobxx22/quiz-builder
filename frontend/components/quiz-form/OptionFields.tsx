import { useFieldArray, useFormContext } from 'react-hook-form';
import { FieldError } from '@/components/FeedbackMessages';
import { PlusIcon, XIcon } from '@/components/icons';
import type { QuizFormValues } from '@/lib/quizFormSchema';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

export function OptionFields({ questionIndex }: { questionIndex: number }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const optionsErrors = errors.questions?.[questionIndex]?.options as unknown as
    { root?: { message?: string } } | Record<number, { text?: { message?: string } }> | undefined;
  const rootError = (optionsErrors as { root?: { message?: string } } | undefined)?.root?.message;

  return (
    <fieldset>
      <legend className="text-sm font-medium">Options</legend>
      <p className="text-sm text-muted">Tick every option that is a correct answer.</p>

      <ul className="mt-2 space-y-2">
        {fields.map((field, optionIndex) => {
          const textError = (
            optionsErrors as Record<number, { text?: { message?: string } }> | undefined
          )?.[optionIndex]?.text?.message;

          return (
            <li key={field.id}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label={`Option ${optionIndex + 1} is correct`}
                  className="size-5 shrink-0 accent-brand"
                  {...register(`questions.${questionIndex}.options.${optionIndex}.isCorrect`)}
                />
                <input
                  type="text"
                  aria-label={`Option ${optionIndex + 1} text`}
                  aria-invalid={textError ? true : undefined}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="field"
                  {...register(`questions.${questionIndex}.options.${optionIndex}.text`)}
                />
                <button
                  type="button"
                  onClick={() => remove(optionIndex)}
                  disabled={fields.length <= MIN_OPTIONS}
                  aria-label={`Remove option ${optionIndex + 1}`}
                  className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <XIcon />
                </button>
              </div>
              <FieldError message={textError} />
            </li>
          );
        })}
      </ul>

      <FieldError message={rootError} />

      <button
        type="button"
        onClick={() => append({ text: '', isCorrect: false })}
        disabled={fields.length >= MAX_OPTIONS}
        className="btn btn-secondary mt-3"
      >
        <PlusIcon /> Add option
      </button>
    </fieldset>
  );
}
