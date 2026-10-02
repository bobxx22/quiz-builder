import { CheckIcon } from '@/components/icons';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { QUESTION_TYPE_META } from '@/lib/questionTypes';
import type { Question } from '@/types/quiz';

function AnswerRow({
  label,
  correct,
  shape,
}: {
  label: string;
  correct: boolean;
  shape: 'circle' | 'square';
}) {
  return (
    <li className="flex items-center gap-3 py-1.5">
      <span
        aria-hidden="true"
        className={`flex size-5 shrink-0 items-center justify-center border-2 ${
          shape === 'circle' ? 'rounded-full' : 'rounded-[5px]'
        } ${correct ? 'border-correct bg-correct text-white' : 'border-line bg-paper'}`}
      >
        {correct && <CheckIcon width={12} height={12} strokeWidth={3.5} />}
      </span>
      <span className={correct ? 'font-semibold' : undefined}>{label}</span>
      {correct && <span className="text-sm font-medium text-correct">Correct answer</span>}
    </li>
  );
}

/** Read-only rendering of a question's structure and its correct answer(s). */
export function QuestionView({ question, index }: { question: Question; index: number }) {
  return (
    <article
      className={`rounded-lg border border-l-4 border-line bg-paper p-5 ${QUESTION_TYPE_META[question.type].border}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted">Question {index + 1}</h2>
        <QuestionTypeBadge type={question.type} />
      </header>

      <p className="mt-2 text-lg font-semibold">{question.text}</p>

      <div className="mt-3">
        {question.type === 'boolean' && (
          <ul aria-label="Answer options">
            <AnswerRow label="True" correct={question.correctAnswer} shape="circle" />
            <AnswerRow label="False" correct={!question.correctAnswer} shape="circle" />
          </ul>
        )}

        {question.type === 'input' && (
          <dl className="rounded-md border border-line bg-canvas/60 px-3 py-2">
            <dt className="text-sm text-muted">Expected answer</dt>
            <dd className="font-semibold break-words">{question.correctAnswer}</dd>
          </dl>
        )}

        {question.type === 'checkbox' && (
          <ul aria-label="Answer options">
            {question.options.map((option) => (
              <AnswerRow
                key={option.id}
                label={option.text}
                correct={option.isCorrect}
                shape="square"
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
