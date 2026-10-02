import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorMessage, LoadingMessage } from '@/components/FeedbackMessages';
import { Layout } from '@/components/Layout';
import { QuizListItem } from '@/components/QuizListItem';
import { getErrorMessage } from '@/lib/questionTypes';
import { quizService } from '@/services/quizService';
import type { QuizSummary } from '@/types/quiz';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    quizService
      .list()
      .then((data) => !cancelled && setQuizzes(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    await quizService.remove(id);
    setQuizzes((current) => current?.filter((quiz) => quiz.id !== id) ?? null);
  };

  return (
    <Layout title="All quizzes">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">All quizzes</h1>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && quizzes === null && <LoadingMessage>Loading quizzes...</LoadingMessage>}

      {quizzes?.length === 0 && (
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <p className="text-lg font-semibold">No quizzes yet</p>
          <p className="mt-1 text-muted">Build your first quiz to see it here.</p>
          <Link href="/create" className="btn btn-primary mt-4">
            Create a quiz
          </Link>
        </div>
      )}

      {quizzes && quizzes.length > 0 && (
        <ul className="space-y-3">
          {quizzes.map((quiz) => (
            <QuizListItem key={quiz.id} quiz={quiz} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </Layout>
  );
}
