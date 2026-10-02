import Link from 'next/link';
import { useState } from 'react';
import { CheckIcon, TrashIcon, XIcon } from '@/components/icons';
import { formatDate, getErrorMessage, pluralizeQuestions } from '@/lib/questionTypes';
import type { QuizSummary } from '@/types/quiz';

interface QuizListItemProps {
  quiz: QuizSummary;
  onDelete: (id: number) => Promise<void>;
}

export function QuizListItem({ quiz, onDelete }: QuizListItemProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onDelete(quiz.id);
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirming(false);
      setDeleting(false);
    }
  };

  return (
    <li className="rounded-lg border border-line bg-paper">
      <div className="flex items-stretch">
        <Link
          href={`/quizzes/${quiz.id}`}
          className="min-w-0 flex-1 rounded-l-lg px-5 py-4 transition-colors hover:bg-canvas/50"
        >
          <span className="block truncate text-lg font-semibold">{quiz.title}</span>
          <span className="mt-0.5 flex flex-wrap gap-x-4 text-sm text-muted">
            <span>{pluralizeQuestions(quiz.questionCount)}</span>
            <span>Created {formatDate(quiz.createdAt)}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 pr-3 pl-2">
          {confirming ? (
            <>
              <span className="text-sm font-medium">Delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                aria-label={`Confirm deleting ${quiz.title}`}
                className="btn btn-danger px-2.5"
              >
                <CheckIcon />
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                aria-label="Cancel deleting"
                className="btn btn-secondary px-2.5"
              >
                <XIcon />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${quiz.title}`}
              title="Delete quiz"
              className="rounded-md p-2.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="border-t border-line px-5 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </li>
  );
}
