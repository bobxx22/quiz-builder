import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorMessage, LoadingMessage } from '@/components/FeedbackMessages';
import { ArrowLeftIcon } from '@/components/icons';
import { Layout } from '@/components/Layout';
import { QuestionView } from '@/components/QuestionView';
import { formatDate, getErrorMessage, pluralizeQuestions } from '@/lib/questionTypes';
import { ApiError } from '@/services/apiClient';
import { quizService } from '@/services/quizService';
import type { Quiz } from '@/types/quiz';

export default function QuizDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : null;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;
    let cancelled = false;
    setQuiz(null);
    setError(null);
    quizService
      .get(id)
      .then((data) => !cancelled && setQuiz(data))
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError && err.status === 404
            ? 'This quiz does not exist. It may have been deleted.'
            : getErrorMessage(err),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  return (
    <Layout title={quiz?.title ?? 'Quiz'}>
      <Link
        href="/quizzes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeftIcon width={16} height={16} /> All quizzes
      </Link>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && !quiz && <LoadingMessage>Loading quiz...</LoadingMessage>}

      {quiz && (
        <>
          <h1 className="text-3xl font-bold tracking-tight break-words">{quiz.title}</h1>
          <p className="mt-1 mb-6 flex flex-wrap gap-x-4 text-sm text-muted">
            <span>{pluralizeQuestions(quiz.questions.length)}</span>
            <span>Created {formatDate(quiz.createdAt)}</span>
          </p>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <QuestionView key={question.id} question={question} index={index} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
